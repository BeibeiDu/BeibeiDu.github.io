import type { QuestionnaireConfig } from "./types";

export const phq9: QuestionnaireConfig = {
  id: "phq-9",
  title: "Patient Health Questionnaire-9",
  shortTitle: "PHQ-9",
  timeframe: "Over the last 2 weeks",
  instructions:
    "Select how often the participant has been bothered by each problem.",
  options: [
    { id: "not-at-all", label: "Not at all", value: 0 },
    { id: "several-days", label: "Several days", value: 1 },
    { id: "more-than-half", label: "More than half the days", value: 2 },
    { id: "nearly-every-day", label: "Nearly every day", value: 3 }
  ],
  totalScoreLabel: "PHQ-9 total",
  scoreBands: [
    { min: 0, max: 4, label: "Minimal" },
    { min: 5, max: 9, label: "Mild" },
    { min: 10, max: 14, label: "Moderate" },
    { min: 15, max: 19, label: "Moderately severe" },
    { min: 20, max: 27, label: "Severe" }
  ],
  alertRules: [
    {
      type: "item-at-least",
      itemId: "phq9-9",
      threshold: 1,
      title: "Suicidal ideation indicated",
      message:
        "PHQ-9 item 9 is above 0. Follow the clinic suicide-risk or safeguarding protocol immediately and ensure this is reviewed by an appropriate clinician."
    },
    {
      type: "total-at-least",
      threshold: 20,
      title: "Severe PHQ-9 score",
      message:
        "This score is in the severe range. Arrange clinical review according to local protocol before relying on manual transcription alone."
    }
  ],
  items: [
    { id: "phq9-1", prompt: "Little interest or pleasure in doing things" },
    { id: "phq9-2", prompt: "Feeling down, depressed, or hopeless" },
    { id: "phq9-3", prompt: "Trouble falling or staying asleep, or sleeping too much" },
    { id: "phq9-4", prompt: "Feeling tired or having little energy" },
    { id: "phq9-5", prompt: "Poor appetite or overeating" },
    {
      id: "phq9-6",
      prompt:
        "Feeling bad about yourself, or that you are a failure or have let yourself or your family down"
    },
    { id: "phq9-7", prompt: "Trouble concentrating on things, such as reading or watching television" },
    {
      id: "phq9-8",
      prompt:
        "Moving or speaking so slowly that other people could have noticed, or the opposite"
    },
    {
      id: "phq9-9",
      prompt:
        "Thoughts that you would be better off dead, or of hurting yourself in some way"
    }
  ]
};
