import type { QuestionnaireConfig } from "./types";

const standardOptions = [
  { id: "very-much", label: "Very much", value: 3 },
  { id: "a-lot", label: "A lot", value: 2 },
  { id: "a-little", label: "A little", value: 1 },
  { id: "not-at-all", label: "Not at all", value: 0 },
  { id: "not-relevant", label: "Not relevant", value: 0 }
];

export const dlqi: QuestionnaireConfig = {
  id: "dlqi",
  title: "Dermatology Life Quality Index",
  shortTitle: "DLQI",
  timeframe: "Over the last week",
  instructions:
    "Use the approved DLQI wording and format for each numbered item. This configuration supplies local scoring only.",
  options: standardOptions,
  totalScoreLabel: "DLQI total",
  scoreWhenUnansweredCountAtMost: 1,
  unansweredItemScore: 0,
  hideOptionValues: true,
  copyrightNotice:
    "© Dermatology Life Quality Index. A Y Finlay, G K Khan, April 1992",
  scoreBands: [
    { min: 0, max: 1, label: "No effect on patient's life" },
    { min: 2, max: 5, label: "Small effect on patient's life" },
    { min: 6, max: 10, label: "Moderate effect on patient's life" },
    { min: 11, max: 20, label: "Very large effect on patient's life" },
    { min: 21, max: 30, label: "Extremely large effect on patient's life" }
  ],
  subscales: [
    { id: "symptoms-feelings", label: "Symptoms and feelings", itemIds: ["dlqi-1", "dlqi-2"] },
    { id: "daily-activities", label: "Daily activities", itemIds: ["dlqi-3", "dlqi-4"] },
    { id: "leisure", label: "Leisure", itemIds: ["dlqi-5", "dlqi-6"] },
    { id: "work-school", label: "Work and school", itemIds: ["dlqi-7"] },
    { id: "personal-relationships", label: "Personal relationships", itemIds: ["dlqi-8", "dlqi-9"] },
    { id: "treatment", label: "Treatment", itemIds: ["dlqi-10"] }
  ],
  items: [
    { id: "dlqi-1", prompt: "DLQI question 1", subscale: "symptoms-feelings" },
    { id: "dlqi-2", prompt: "DLQI question 2", subscale: "symptoms-feelings" },
    { id: "dlqi-3", prompt: "DLQI question 3", subscale: "daily-activities" },
    { id: "dlqi-4", prompt: "DLQI question 4", subscale: "daily-activities" },
    { id: "dlqi-5", prompt: "DLQI question 5", subscale: "leisure" },
    { id: "dlqi-6", prompt: "DLQI question 6", subscale: "leisure" },
    {
      id: "dlqi-7",
      prompt: "DLQI question 7",
      subscale: "work-school",
      options: [
        { id: "yes", label: "Yes", value: 3 },
        { id: "a-lot", label: "A lot", value: 2 },
        { id: "a-little", label: "A little", value: 1 },
        { id: "not-at-all", label: "Not at all", value: 0 },
        { id: "not-relevant", label: "Not relevant", value: 0 }
      ]
    },
    { id: "dlqi-8", prompt: "DLQI question 8", subscale: "personal-relationships" },
    { id: "dlqi-9", prompt: "DLQI question 9", subscale: "personal-relationships" },
    { id: "dlqi-10", prompt: "DLQI question 10", subscale: "treatment" }
  ]
};
