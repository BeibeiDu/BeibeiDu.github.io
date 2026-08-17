import type { QuestionnaireConfig } from "./types";

export const phqa: QuestionnaireConfig = {
  id: "phq-a",
  title: "Patient Health Questionnaire for Adolescents",
  shortTitle: "PHQ-A",
  timeframe: "",
  instructions:
    "Over the last 2 weeks, how often have you been bothered by the following problems?",
  options: [
    { id: "not-at-all", label: "Not at all", value: 0 },
    { id: "several-days", label: "Several days", value: 1 },
    { id: "more-than-half", label: "More than half the days", value: 2 },
    { id: "nearly-every-day", label: "Nearly every day", value: 3 }
  ],
  copyrightNotice:
    "Modified with permission from the PHQ (Spitzer, Williams & Kroenke, 1999) by J. Johnson (Johnson, 2002).",
  totalScoreLabel: "PHQ-A total",
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
      itemId: "phqa-9",
      threshold: 1,
      title: "Self-harm or suicidal ideation indicated",
      message:
        "PHQ-A item 9 is above 0. Follow the clinic child/adolescent suicide-risk or safeguarding protocol immediately and ensure this is reviewed by an appropriate clinician."
    },
    {
      type: "total-at-least",
      threshold: 20,
      title: "Severe PHQ-A score",
      message:
        "This score is in the severe range. Arrange clinical review according to local child/adolescent protocol before relying on manual transcription alone."
    }
  ],
  items: [
    { id: "phqa-1", prompt: "Feeling down, depressed, irritable, or hopeless" },
    { id: "phqa-2", prompt: "Little interest or pleasure in doing things" },
    { id: "phqa-3", prompt: "Trouble falling or staying asleep, or sleeping too much" },
    { id: "phqa-4", prompt: "Poor appetite, weight loss, or overeating" },
    { id: "phqa-5", prompt: "Feeling tired or having little energy" },
    {
      id: "phqa-6",
      prompt:
        "Feeling bad about yourself, or that you are a failure or have let yourself or your family down"
    },
    {
      id: "phqa-7",
      prompt:
        "Trouble concentrating on things like school work, reading, or watching TV"
    },
    {
      id: "phqa-8",
      prompt:
        "Moving or speaking so slowly that other people could have noticed, or being so fidgety or restless that you were moving around a lot more than usual"
    },
    {
      id: "phqa-9",
      prompt:
        "Thoughts that you would be better off dead, or of hurting yourself in some way"
    }
  ]
};
