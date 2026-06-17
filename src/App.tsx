import { useEffect, useMemo, useState } from "react";
import { gad7 } from "./questionnaires/gad7";
import { gppaq } from "./questionnaires/gppaq";
import { phq9 } from "./questionnaires/phq9";
import { phqa } from "./questionnaires/phqa";
import type { QuestionnaireConfig, ResponseOption } from "./questionnaires/types";
import { type AnswerMap, scoreQuestionnaire } from "./scoring";

const optionId = (option: ResponseOption) =>
  option.id ?? `${option.label}-${option.value}`;

type DoseRow = {
  id: string;
  doseMg: string;
  weeks: string;
};

const initialDoseRows: DoseRow[] = [
  { id: "dose-row-1", doseMg: "", weeks: "" },
  { id: "dose-row-2", doseMg: "", weeks: "" },
  { id: "dose-row-3", doseMg: "", weeks: "" }
];

function App() {
  const [answers, setAnswers] = useState<AnswerMap>({});
  const currentPath = window.location.pathname.replace(/\/$/, "");
  const isRootPage = currentPath === "";
  const isGppaqPage = currentPath === "/gppaq";
  const isAdolescentPage = currentPath === "/gad7phqa";
  const isIsotretinoinPage = currentPath === "/isotretinoin";

  const gadScore = useMemo(() => scoreQuestionnaire(gad7, answers), [answers]);
  const phqScore = useMemo(() => scoreQuestionnaire(phq9, answers), [answers]);
  const phqaScore = useMemo(() => scoreQuestionnaire(phqa, answers), [answers]);
  const gppaqScore = useMemo(() => scoreQuestionnaire(gppaq, answers), [answers]);

  useEffect(() => {
    if (isRootPage) {
      document.title = "Questionnaire Selection";
      return;
    }

    if (isGppaqPage) {
      document.title = "GPPAQ";
      return;
    }

    if (isIsotretinoinPage) {
      document.title = "Isotretinoin Cumulative Dose Calculator";
      return;
    }

    document.title = isAdolescentPage
      ? "GAD-7 PHQ-A for Adolescents"
      : "Mental Health Screening Questionnaires";
  }, [isAdolescentPage, isGppaqPage, isIsotretinoinPage, isRootPage]);

  const setAnswer = (itemId: string, selectedOptionId: string) => {
    setAnswers((current) => ({ ...current, [itemId]: selectedOptionId }));
  };

  const reset = () => {
    setAnswers({});
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isRootPage) {
    return <SelectionPage />;
  }

  if (isIsotretinoinPage) {
    return <IsotretinoinCalculator />;
  }

  return isGppaqPage ? (
    <main className="app-shell">
      <PageIntro
        title="GPPAQ"
        description="Scores are calculated only in this browser session. This app has no backend, database, analytics, cookies, login, or network data submission."
      />

      <section className="control-panel" aria-label="Questionnaire set">
        <p className="combined-label">General Practice Physical Activity Questionnaire</p>
        <span>Complete the questionnaire, then transcribe the Physical Activity Index from the report below.</span>
      </section>

      <QuestionnaireForm
        questionnaire={gppaq}
        answers={answers}
        setAnswer={setAnswer}
      />

      <SingleScoreReport
        questionnaire={gppaq}
        score={gppaqScore}
        onReset={reset}
      />
    </main>
  ) : (
    <main className="app-shell">
      <PageIntro
        title={isAdolescentPage ? "GAD-7 PHQ-A for Adolescents" : "Mental Health Screening Questionnaires"}
        description="Scores are calculated only in this browser session. This app has no backend, database, analytics, cookies, login, or network data submission."
      />

      <section className="control-panel" aria-label="Questionnaire set">
        <p className="combined-label">
          {isAdolescentPage ? "GAD-7 and PHQ-A" : "GAD-7 and PHQ-9"}
        </p>
        <span>
          Complete both questionnaires, then transcribe both scores from the report below.
        </span>
      </section>

      <QuestionnaireForm
        questionnaire={gad7}
        answers={answers}
        setAnswer={setAnswer}
      />
      <QuestionnaireForm
        questionnaire={isAdolescentPage ? phqa : phq9}
        answers={answers}
        setAnswer={setAnswer}
      />

      <CombinedScoreReport
        scores={[
          { questionnaire: gad7, score: gadScore },
          {
            questionnaire: isAdolescentPage ? phqa : phq9,
            score: isAdolescentPage ? phqaScore : phqScore
          }
        ]}
        onReset={reset}
      />
    </main>
  );
}

function SelectionPage() {
  const handleSelection = (nextPath: string) => {
    if (nextPath) {
      window.location.href = nextPath;
    }
  };

  return (
    <main className="app-shell">
      <PageIntro
        title="Questionnaire Selection"
        description="Choose the questionnaire set to complete. Scores are calculated only in this browser session and are not stored or transmitted."
      />

      <section className="selector-panel" aria-labelledby="questionnaire-select-label">
        <label id="questionnaire-select-label" htmlFor="questionnaire-route">
          Patient questionnaires
        </label>
        <select
          id="questionnaire-route"
          defaultValue=""
          onChange={(event) => handleSelection(event.target.value)}
        >
          <option value="" disabled>
            Choose an option
          </option>
          <option value="/gad7phq9/">GAD-7 and PHQ-9</option>
          <option value="/gad7phqa/">GAD-7 PHQ-A for adolescents</option>
          <option value="/gppaq/">GPPAQ</option>
        </select>
      </section>

      <section className="selector-panel" aria-labelledby="clinic-tools-select-label">
        <label id="clinic-tools-select-label" htmlFor="clinic-tool-route">
          Clinic Tools
        </label>
        <select
          id="clinic-tool-route"
          defaultValue=""
          onChange={(event) => handleSelection(event.target.value)}
        >
          <option value="" disabled>
            Choose an option
          </option>
          <option value="/isotretinoin/">Isotretinoin cumulative dose calculator</option>
        </select>
      </section>
    </main>
  );
}

function IsotretinoinCalculator() {
  const [doseRows, setDoseRows] = useState<DoseRow[]>(initialDoseRows);
  const [weightKg, setWeightKg] = useState("");
  const [targetMgPerKg, setTargetMgPerKg] = useState("120");
  const [remainingDoseMg, setRemainingDoseMg] = useState("");

  const doseEntries = useMemo(() => calculateDoseEntries(doseRows), [doseRows]);
  const completedTotalMg = doseEntries.reduce((sum, entry) => sum + entry.totalMg, 0);
  const weight = parsePositiveNumber(weightKg);
  const target = Number(targetMgPerKg);
  const targetTotalMg = weight ? weight * target : undefined;
  const remainingMg = targetTotalMg
    ? Math.max(targetTotalMg - completedTotalMg, 0)
    : undefined;
  const remainingDose = parsePositiveNumber(remainingDoseMg);
  const remainingWeeks =
    remainingMg !== undefined && remainingDose
      ? remainingMg / (remainingDose * 7)
      : undefined;
  const completedMgPerKg = weight ? completedTotalMg / weight : undefined;

  const updateDoseRow = (id: string, field: "doseMg" | "weeks", value: string) => {
    setDoseRows((currentRows) =>
      currentRows.map((row) =>
        row.id === id ? { ...row, [field]: value } : row
      )
    );
  };

  const addDoseRow = () => {
    setDoseRows((currentRows) => [
      ...currentRows,
      { id: `dose-row-${Date.now()}`, doseMg: "", weeks: "" }
    ]);
  };

  const removeDoseRow = (id: string) => {
    setDoseRows((currentRows) =>
      currentRows.length === 1
        ? [{ ...currentRows[0], doseMg: "", weeks: "" }]
        : currentRows.filter((row) => row.id !== id)
    );
  };

  const reset = () => {
    setDoseRows(initialDoseRows);
    setWeightKg("");
    setTargetMgPerKg("120");
    setRemainingDoseMg("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="app-shell">
      <PageIntro
        title="Isotretinoin Cumulative Dose Calculator"
        description="For clinician arithmetic only. Inputs stay in this browser session and are not stored or transmitted."
      />

      <section className="control-panel" aria-label="Calculator note">
        <p className="combined-label">Clinic Tools</p>
        <span>
          Enter daily dose periods as structured rows. The calculator multiplies
          daily dose in mg by duration in weeks by 7 days.
        </span>
      </section>

      <section className="tool-panel" aria-labelledby="dose-history-title">
        <div className="section-heading compact-heading">
          <p>Completed treatment</p>
          <h2 id="dose-history-title">Dose history</h2>
          <span>
            Add one row for each dose period, such as 2 weeks at 20 mg or 8
            weeks at 60 mg.
          </span>
        </div>

        <div className="dose-grid" aria-label="Dose history entries">
          <div className="dose-grid-head" aria-hidden="true">
            <span />
            <span>Dose (mg/day)</span>
            <span>Duration</span>
            <span />
          </div>
          {doseRows.map((row, index) => (
            <div className="dose-grid-row" key={row.id}>
              <div className="dose-row-label">Dose {index + 1}</div>

              <label className="visually-hidden" htmlFor={`${row.id}-dose`}>
                Dose {index + 1} dose in mg per day
              </label>
              <div className="dose-grid-cell">
                <span className="mobile-column-label">Dose (mg/day)</span>
                <div className="input-with-unit">
                  <input
                    id={`${row.id}-dose`}
                    inputMode="decimal"
                    pattern="[0-9]*[.]?[0-9]*"
                    type="text"
                    value={row.doseMg}
                    onChange={(event) =>
                      updateDoseRow(row.id, "doseMg", event.target.value)
                    }
                  />
                  <span>mg/day</span>
                </div>
              </div>

              <label className="visually-hidden" htmlFor={`${row.id}-weeks`}>
                Dose {index + 1} duration in weeks
              </label>
              <div className="dose-grid-cell">
                <span className="mobile-column-label">Duration</span>
                <div className="input-with-unit">
                  <input
                    id={`${row.id}-weeks`}
                    inputMode="decimal"
                    pattern="[0-9]*[.]?[0-9]*"
                    type="text"
                    value={row.weeks}
                    onChange={(event) =>
                      updateDoseRow(row.id, "weeks", event.target.value)
                    }
                  />
                  <span>weeks</span>
                </div>
              </div>

              <button
                type="button"
                className="secondary-button"
                onClick={() => removeDoseRow(row.id)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <div className="actions">
          <button type="button" className="add-button" onClick={addDoseRow}>
            Add dose period
          </button>
        </div>

        {doseEntries.length === 0 ? (
          <p className="helper-text">Add at least one complete dose period to show a total.</p>
        ) : null}
      </section>

      <section className="tool-panel" aria-labelledby="target-title">
        <div className="section-heading compact-heading">
          <p>Target dose</p>
          <h2 id="target-title">Weight and cumulative target</h2>
        </div>

        <div className="input-grid">
          <label className="field-label" htmlFor="weight-kg">
            Weight in kg
            <input
              id="weight-kg"
              inputMode="decimal"
              min="0"
              type="number"
              value={weightKg}
              onChange={(event) => setWeightKg(event.target.value)}
              placeholder="e.g. 70"
            />
          </label>

          <fieldset className="target-options">
            <legend>Target cumulative dose</legend>
            <label>
              <input
                type="radio"
                name="target-dose"
                value="120"
                checked={targetMgPerKg === "120"}
                onChange={(event) => setTargetMgPerKg(event.target.value)}
              />
              120 mg/kg
            </label>
            <label>
              <input
                type="radio"
                name="target-dose"
                value="150"
                checked={targetMgPerKg === "150"}
                onChange={(event) => setTargetMgPerKg(event.target.value)}
              />
              150 mg/kg
            </label>
          </fieldset>
        </div>
      </section>

      <section className="tool-panel" aria-labelledby="remaining-title">
        <div className="section-heading compact-heading">
          <p>Remaining treatment</p>
          <h2 id="remaining-title">Time remaining calculator</h2>
        </div>

        <label className="field-label" htmlFor="remaining-dose">
          Planned ongoing daily dose in mg
          <input
            id="remaining-dose"
            inputMode="decimal"
            min="0"
            type="number"
            value={remainingDoseMg}
            onChange={(event) => setRemainingDoseMg(event.target.value)}
            placeholder="e.g. 40"
          />
        </label>
      </section>

      <aside className="score-summary combined-report tool-summary" aria-live="polite">
        <div className="report-heading">
          <p className="score-label">Calculator report</p>
          <h2>Totals for clinical review</h2>
        </div>

        <div className="metric-grid">
          <MetricCard label="Completed cumulative dose" value={`${formatNumber(completedTotalMg)} mg`} />
          <MetricCard
            label="Completed dose by weight"
            value={completedMgPerKg === undefined ? "--" : `${formatNumber(completedMgPerKg)} mg/kg`}
          />
          <MetricCard
            label="Target cumulative dose"
            value={targetTotalMg === undefined ? "--" : `${formatNumber(targetTotalMg)} mg`}
          />
          <MetricCard
            label="Remaining to target"
            value={remainingMg === undefined ? "--" : `${formatNumber(remainingMg)} mg`}
          />
          <MetricCard
            label="Estimated time remaining"
            value={remainingWeeks === undefined ? "--" : formatRemainingTime(remainingWeeks)}
          />
        </div>

        <div className="actions">
          <button type="button" className="reset-button" onClick={reset}>
            Reset calculator
          </button>
        </div>

        <p className="manual-note">
          This tool performs dose arithmetic only. Confirm dosing decisions,
          monitoring, contraindications, pregnancy prevention requirements, and
          local protocols outside this calculator.
        </p>
      </aside>
    </main>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <section className="metric-card">
      <span>{label}</span>
      <strong>{value}</strong>
    </section>
  );
}

type PageIntroProps = {
  title: string;
  description: string;
};

function PageIntro({ title, description }: PageIntroProps) {
  return (
    <section className="intro-band">
      <div className="intro-content">
        <p className="kicker">Local-only clinic scoring</p>
        <h1>{title}</h1>
        <p className="privacy-note">{description}</p>
      </div>
    </section>
  );
}

type QuestionnaireFormProps = {
  questionnaire: QuestionnaireConfig;
  answers: AnswerMap;
  setAnswer: (itemId: string, selectedOptionId: string) => void;
};

function QuestionnaireForm({
  questionnaire,
  answers,
  setAnswer
}: QuestionnaireFormProps) {
  return (
    <section className="questionnaire" aria-labelledby="questionnaire-title">
      <div className="section-heading">
        <p>{questionnaire.timeframe}</p>
        <h2 id="questionnaire-title">{questionnaire.title}</h2>
        <span>{questionnaire.instructions}</span>
      </div>

      <div className="items">
        {questionnaire.items.map((item, index) => {
          const options = item.options ?? questionnaire.options;

          return (
            <fieldset className="item" key={item.id}>
              <legend>
                <span>{index + 1}</span>
                {item.prompt}
              </legend>
              <div className="option-grid" role="radiogroup">
                {options.map((option) => (
                  <button
                    type="button"
                    role="radio"
                    data-item-id={item.id}
                    data-option-id={optionId(option)}
                    aria-checked={answers[item.id] === optionId(option)}
                    className={
                      `${answers[item.id] === optionId(option) ? "option selected" : "option"}${
                        questionnaire.hideOptionValues ? " no-value" : ""
                      }`
                    }
                    key={optionId(option)}
                    onClick={() => setAnswer(item.id, optionId(option))}
                  >
                    <span className="radio-dot" aria-hidden="true" />
                    <span className="option-label">{option.label}</span>
                    {questionnaire.hideOptionValues ? null : (
                      <span className="option-value">{option.value}</span>
                    )}
                  </button>
                ))}
              </div>
            </fieldset>
          );
        })}
      </div>

      {questionnaire.copyrightNotice ? (
        <p className="copyright-notice">{questionnaire.copyrightNotice}</p>
      ) : null}
    </section>
  );
}

type ScoreCardProps = {
  questionnaire: QuestionnaireConfig;
  score: ReturnType<typeof scoreQuestionnaire>;
};

type CombinedScoreReportProps = {
  scores: ScoreCardProps[];
  onReset: () => void;
};

type SingleScoreReportProps = ScoreCardProps & {
  onReset: () => void;
};

function CombinedScoreReport({ scores, onReset }: CombinedScoreReportProps) {
  return (
    <aside className="score-summary combined-report" aria-live="polite">
      <div className="report-heading">
        <p className="score-label">Combined report</p>
        <h2>Scores for transcription</h2>
      </div>

      <div className="score-cards">
        {scores.map(({ questionnaire, score }) => (
          <ScoreCard
            key={questionnaire.id}
            questionnaire={questionnaire}
            score={score}
          />
        ))}
      </div>

      <div className="actions">
        <button type="button" className="reset-button" onClick={onReset}>
          Reset questionnaires
        </button>
      </div>

      <p className="manual-note">
        Manually transcribe both displayed scores into the approved capture
        system, then reset before returning the phone.
      </p>
    </aside>
  );
}

function SingleScoreReport({ questionnaire, score, onReset }: SingleScoreReportProps) {
  return (
    <aside className="score-summary combined-report" aria-live="polite">
      <div className="report-heading">
        <p className="score-label">Report</p>
        <h2>Score for transcription</h2>
      </div>

      <div className="score-cards single-score-card">
        <ScoreCard questionnaire={questionnaire} score={score} />
      </div>

      <div className="actions">
        <button type="button" className="reset-button" onClick={onReset}>
          Reset questionnaire
        </button>
      </div>

      <p className="manual-note">
        Manually transcribe the displayed score into the approved capture
        system, then reset before returning the phone.
      </p>
    </aside>
  );
}

function ScoreCard({ questionnaire, score }: ScoreCardProps) {
  return (
    <section className="score-card" aria-label={`${questionnaire.shortTitle} score`}>
      <div>
        <p className="score-label">{questionnaire.totalScoreLabel}</p>
        <div className="score-row">
          <strong className={score.displayValue && score.displayValue.length > 6 ? "category-score" : undefined}>
            {score.isScorable ? score.displayValue ?? score.total : "--"}
          </strong>
          <span>
            {score.answeredCount}/{score.totalCount} answered
          </span>
        </div>
        {score.isScorable && score.bandLabel ? (
          <p className="band">
            {questionnaire.scoringStrategy === "gppaq" ? "Category" : "Band"}: {score.bandLabel}
          </p>
        ) : !score.isScorable && questionnaire.scoreWhenUnansweredCountAtMost ? (
          <p className="band muted">
            Complete at least {score.totalCount - questionnaire.scoreWhenUnansweredCountAtMost} items to show final scores.
          </p>
        ) : (
          <p className="band muted">Complete all items to show final scores.</p>
        )}
      </div>

      {score.alerts.length > 0 ? (
        <div className="alerts" role="alert">
          {score.alerts.map((alert) => (
            <div className="alert" key={alert.title}>
              <strong>{alert.title}</strong>
              <span>{alert.message}</span>
            </div>
          ))}
        </div>
      ) : null}

      {score.subscales.length > 0 ? (
        <div className="subscales">
          {score.subscales.map((subscale) => (
            <div className="subscale" key={subscale.id}>
              <span>{subscale.label}</span>
              <strong>
                {score.isScorable && subscale.answeredCount === subscale.totalCount
                  ? subscale.score
                  : "--"}
              </strong>
            </div>
          ))}
        </div>
      ) : null}

    </section>
  );
}

function parsePositiveNumber(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
}

function calculateDoseEntries(rows: DoseRow[]) {
  return rows.flatMap((row) => {
    const doseMg = parsePositiveNumber(row.doseMg);
    const weeks = parsePositiveNumber(row.weeks);

    if (!doseMg || !weeks) {
      return [];
    }

    return [
      {
        id: row.id,
        doseMg,
        weeks,
        totalMg: doseMg * weeks * 7
      }
    ];
  });
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-GB", {
    maximumFractionDigits: value < 10 ? 1 : 0
  }).format(value);
}

function formatRemainingTime(weeks: number) {
  const totalDays = Math.ceil(weeks * 7);
  const wholeWeeks = Math.floor(totalDays / 7);
  const remainingDays = totalDays % 7;
  const months = Math.floor(totalDays / 30);
  const daysAfterMonths = totalDays % 30;
  const approximateWeeks = Math.round(daysAfterMonths / 7);
  const exactParts = [
    wholeWeeks > 0 ? pluralise(wholeWeeks, "week") : "",
    remainingDays > 0 ? pluralise(remainingDays, "day") : ""
  ].filter(Boolean);
  const approximateParts = [
    months > 0 ? pluralise(months, "month") : "",
    approximateWeeks > 0 ? pluralise(approximateWeeks, "week") : ""
  ].filter(Boolean);

  if (totalDays === 0) {
    return "0 weeks, 0 days (approx. 0 months)";
  }

  return `${exactParts.join(" ")} (approx. ${approximateParts.join(" ") || "0 months"})`;
}

function pluralise(value: number, unit: string) {
  return `${value} ${unit}${value === 1 ? "" : "s"}`;
}

export default App;
