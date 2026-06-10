import type { QuestionnaireConfig, ResponseOption } from "./questionnaires/types";

export type AnswerMap = Record<string, string | undefined>;

export type ScoreResult = {
  answeredCount: number;
  totalCount: number;
  isComplete: boolean;
  isScorable: boolean;
  unansweredCount: number;
  total: number;
  displayValue?: string;
  bandLabel?: string;
  alerts: Array<{
    title: string;
    message: string;
  }>;
  subscales: Array<{
    id: string;
    label: string;
    score: number;
    answeredCount: number;
    totalCount: number;
  }>;
};

export function scoreQuestionnaire(
  questionnaire: QuestionnaireConfig,
  answers: AnswerMap
): ScoreResult {
  const optionId = (option: ResponseOption) =>
    option.id ?? `${option.label}-${option.value}`;

  const optionsForItem = (itemId: string) => {
    const item = questionnaire.items.find((candidate) => candidate.id === itemId);
    return item?.options ?? questionnaire.options;
  };

  const scoreItem = (itemId: string) => {
    const item = questionnaire.items.find((candidate) => candidate.id === itemId);
    const answer = answers[itemId];
    const unansweredScore = questionnaire.unansweredItemScore;

    if (!item || answer === undefined) {
      return unansweredScore;
    }

    const options = optionsForItem(itemId);
    const selectedOption = options.find((option) => optionId(option) === answer);

    if (!selectedOption) {
      return undefined;
    }

    const maxOption = Math.max(...options.map((option) => option.value));
    return item.reverseScore ? maxOption - selectedOption.value : selectedOption.value;
  };

  const selectedItemValue = (itemId: string) => {
    const answer = answers[itemId];

    if (answer === undefined) {
      return undefined;
    }

    const selectedOption = optionsForItem(itemId).find(
      (option) => optionId(option) === answer
    );

    return selectedOption?.value;
  };

  const itemScores = questionnaire.items.map((item) => scoreItem(item.id));
  const answeredCount = questionnaire.items.filter(
    (item) => answers[item.id] !== undefined
  ).length;
  const unansweredCount = questionnaire.items.length - answeredCount;
  const isComplete = unansweredCount === 0;
  const isScorable =
    isComplete ||
    unansweredCount <= (questionnaire.scoreWhenUnansweredCountAtMost ?? 0);

  if (questionnaire.scoringStrategy === "gppaq") {
    const result = isComplete ? scoreGppaq(answers) : undefined;

    return {
      answeredCount,
      totalCount: questionnaire.items.length,
      isComplete,
      isScorable: isComplete && result !== undefined,
      unansweredCount,
      total: result?.rank ?? 0,
      displayValue: result?.category,
      bandLabel: result?.description,
      alerts: [],
      subscales: []
    };
  }

  const total = itemScores.reduce<number>(
    (sum, score) => sum + (score ?? 0),
    0
  );
  const bandLabel = questionnaire.scoreBands?.find(
    (band) => total >= band.min && total <= band.max
  )?.label;
  const alerts = isScorable ? getAlerts(questionnaire, total, selectedItemValue) : [];

  const subscales =
    questionnaire.subscales?.map((subscale) => {
      const scores = subscale.itemIds.map(scoreItem);
      return {
        id: subscale.id,
        label: subscale.label,
        score: scores.reduce<number>((sum, score) => sum + (score ?? 0), 0),
        answeredCount: subscale.itemIds.filter(
          (itemId) => answers[itemId] !== undefined
        ).length,
        totalCount: subscale.itemIds.length
      };
    }) ?? [];

  return {
    answeredCount,
    totalCount: questionnaire.items.length,
    isComplete,
    isScorable,
    unansweredCount,
    total,
    displayValue: String(total),
    bandLabel,
    alerts,
    subscales
  };
}

function getAlerts(
  questionnaire: QuestionnaireConfig,
  total: number,
  selectedItemValue: (itemId: string) => number | undefined
) {
  return (
    questionnaire.alertRules
      ?.filter((rule) => {
        if (rule.type === "total-at-least") {
          return total >= rule.threshold;
        }

        return (selectedItemValue(rule.itemId) ?? 0) >= rule.threshold;
      })
      .map((rule) => ({
        title: rule.title,
        message: rule.message
      })) ?? []
  );
}

function scoreGppaq(answers: AnswerMap) {
  const work = answers["gppaq-work"];
  const exercise = answers["gppaq-exercise"];

  if (!work || !exercise) {
    return undefined;
  }

  const workRank: Record<string, number> = {
    "not-employed": 0,
    sitting: 0,
    standing: 1,
    physical: 2,
    vigorous: 3
  };

  const exerciseRank: Record<string, number> = {
    none: 0,
    "under-one": 1,
    "one-to-three": 2,
    "three-plus": 3
  };

  const rank = workRank[work] ?? 0;
  const activity = exerciseRank[exercise] ?? 0;

  if (rank >= 3 || activity >= 3 || (rank >= 2 && activity >= 1) || (rank >= 1 && activity >= 2)) {
    return {
      rank: 4,
      category: "Active",
      description: "Meets the GPPAQ active category"
    };
  }

  if ((rank === 0 && activity === 2) || (rank === 1 && activity === 1) || (rank === 2 && activity === 0)) {
    return {
      rank: 3,
      category: "Moderately active",
      description: "Meets the GPPAQ moderately active category"
    };
  }

  if ((rank === 0 && activity === 1) || (rank === 1 && activity === 0)) {
    return {
      rank: 2,
      category: "Moderately inactive",
      description: "Meets the GPPAQ moderately inactive category"
    };
  }

  return {
    rank: 1,
    category: "Inactive",
    description: "Meets the GPPAQ inactive category"
  };
}
