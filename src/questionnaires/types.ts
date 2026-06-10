export type ScoreValue = number;

export type ResponseOption = {
  id?: string;
  label: string;
  value: ScoreValue;
};

export type QuestionnaireItem = {
  id: string;
  prompt: string;
  subscale?: string;
  options?: ResponseOption[];
  reverseScore?: boolean;
};

export type SubscaleConfig = {
  id: string;
  label: string;
  itemIds: string[];
};

export type ScoreBand = {
  min: number;
  max: number;
  label: string;
};

export type ScoreAlertRule =
  | {
      type: "total-at-least";
      threshold: number;
      title: string;
      message: string;
    }
  | {
      type: "item-at-least";
      itemId: string;
      threshold: number;
      title: string;
      message: string;
    };

export type QuestionnaireConfig = {
  id: string;
  title: string;
  shortTitle: string;
  timeframe: string;
  instructions: string;
  options: ResponseOption[];
  items: QuestionnaireItem[];
  subscales?: SubscaleConfig[];
  totalScoreLabel: string;
  scoringStrategy?: "sum" | "gppaq";
  scoreBands?: ScoreBand[];
  alertRules?: ScoreAlertRule[];
  scoreWhenUnansweredCountAtMost?: number;
  unansweredItemScore?: number;
  hideOptionValues?: boolean;
  copyrightNotice?: string;
};
