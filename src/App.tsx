import { useMemo, useState } from "react";
import { gad7 } from "./questionnaires/gad7";
import { phq9 } from "./questionnaires/phq9";
import type { QuestionnaireConfig, ResponseOption } from "./questionnaires/types";
import { type AnswerMap, scoreQuestionnaire } from "./scoring";

const optionId = (option: ResponseOption) =>
  option.id ?? `${option.label}-${option.value}`;

function App() {
  const [answers, setAnswers] = useState<AnswerMap>({});

  const gadScore = useMemo(() => scoreQuestionnaire(gad7, answers), [answers]);
  const phqScore = useMemo(() => scoreQuestionnaire(phq9, answers), [answers]);

  const setAnswer = (itemId: string, selectedOptionId: string) => {
    setAnswers((current) => ({ ...current, [itemId]: selectedOptionId }));
  };

  const reset = () => {
    setAnswers({});
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="app-shell">
      <section className="intro-band">
        <div className="intro-content">
          <p className="kicker">Local-only clinic scoring</p>
          <h1>Questionnaire scorer</h1>
          <p className="privacy-note">
            Scores are calculated only in this browser session. This app has no
            backend, database, analytics, cookies, login, or network data
            submission.
          </p>
        </div>
      </section>

      <section className="control-panel" aria-label="Questionnaire set">
        <p className="combined-label">GAD-7 and PHQ-9</p>
        <span>Complete both questionnaires, then transcribe both scores from the report below.</span>
      </section>

      <QuestionnaireForm
        questionnaire={gad7}
        answers={answers}
        setAnswer={setAnswer}
      />
      <QuestionnaireForm
        questionnaire={phq9}
        answers={answers}
        setAnswer={setAnswer}
      />

      <CombinedScoreReport
        scores={[
          { questionnaire: gad7, score: gadScore },
          { questionnaire: phq9, score: phqScore }
        ]}
        onReset={reset}
      />
    </main>
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

export default App;
