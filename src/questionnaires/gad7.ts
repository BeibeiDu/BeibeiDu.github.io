import type { QuestionnaireConfig } from "./types";

export const gad7: QuestionnaireConfig = {
  id: "gad-7",
  title: "Generalized Anxiety Disorder-7",
  shortTitle: "GAD-7",
  timeframe: "Over the last 2 weeks",
  instructions:
    "Select how often the participant has been bothered by each problem.",
  options: [
    { id: "not-at-all", label: "Not at all", value: 0 },
    { id: "several-days", label: "Several days", value: 1 },
    { id: "more-than-half", label: "More than half the days", value: 2 },
    { id: "nearly-every-day", label: "Nearly every day", value: 3 }
  ],
  totalScoreLabel: "GAD-7 total",
  scoreBands: [
    { min: 0, max: 4, label: "Minimal" },
    { min: 5, max: 9, label: "Mild" },
    { min: 10, max: 14, label: "Moderate" },
    { min: 15, max: 21, label: "Severe" }
  ],
  alertRules: [
    {
      type: "total-at-least",
      threshold: 15,
      title: "Severe GAD-7 score",
      message:
        "This score is in the severe range. Arrange clinical review according to local protocol before relying on manual transcription alone."
    }
  ],
  items: [
    { id: "gad7-1", prompt: "Feeling nervous, anxious, or on edge" },
    { id: "gad7-2", prompt: "Not being able to stop or control worrying" },
    { id: "gad7-3", prompt: "Worrying too much about different things" },
    { id: "gad7-4", prompt: "Trouble relaxing" },
    { id: "gad7-5", prompt: "Being so restless that it is hard to sit still" },
    { id: "gad7-6", prompt: "Becoming easily annoyed or irritable" },
    { id: "gad7-7", prompt: "Feeling afraid as if something awful might happen" }
  ]
};
