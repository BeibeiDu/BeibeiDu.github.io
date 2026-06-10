import type { QuestionnaireConfig } from "./types";

const durationOptions = [
  { id: "none", label: "None", value: 0 },
  { id: "under-one", label: "Some, but less than 1 hour", value: 1 },
  { id: "one-to-three", label: "1 hour but less than 3 hours", value: 2 },
  { id: "three-plus", label: "3 hours or more", value: 3 }
];

export const gppaq: QuestionnaireConfig = {
  id: "gppaq",
  title: "General Practice Physical Activity Questionnaire",
  shortTitle: "GPPAQ",
  timeframe: "Over the last week",
  instructions:
    "Please mark one box only for work, one box only on each activity row, and one box only for usual walking pace. The Physical Activity Index is calculated locally.",
  options: durationOptions,
  scoringStrategy: "gppaq",
  totalScoreLabel: "GPPAQ physical activity index",
  items: [
    {
      id: "gppaq-work",
      prompt:
        "Please tell us the type and amount of physical activity involved in your work. Please tick one box that is closest to your present work from the following five possibilities.",
      options: [
        {
          id: "not-employed",
          label:
            "I am not in employment (e.g. retired, retired for health reasons, unemployed, full-time carer etc.)",
          value: 0
        },
        {
          id: "sitting",
          label: "I spend most of my time at work sitting (such as in an office)",
          value: 0
        },
        {
          id: "standing",
          label:
            "I spend most of my time at work standing or walking. However, my work does not require much intense physical effort (e.g. shop assistant, hairdresser, security guard, childminder, etc.)",
          value: 1
        },
        {
          id: "physical",
          label:
            "My work involves definite physical effort including handling of heavy objects and use of tools (e.g. plumber, electrician, carpenter, cleaner, hospital nurse, gardener, postal delivery workers etc.)",
          value: 2
        },
        {
          id: "vigorous",
          label:
            "My work involves vigorous physical activity including handling of very heavy objects (e.g. scaffolder, construction worker, refuse collector, etc.)",
          value: 3
        }
      ]
    },
    {
      id: "gppaq-exercise",
      prompt:
        "Physical exercise such as swimming, jogging, aerobics, football, tennis, gym workout etc."
    },
    {
      id: "gppaq-cycling",
      prompt: "Cycling, including cycling to work and during leisure time"
    },
    {
      id: "gppaq-walking",
      prompt: "Walking, including walking to work, shopping, for pleasure etc."
    },
    {
      id: "gppaq-housework",
      prompt: "Housework/Childcare"
    },
    {
      id: "gppaq-gardening",
      prompt: "Gardening/DIY"
    },
    {
      id: "gppaq-walking-pace",
      prompt: "How would you describe your usual walking pace? Please mark one box only.",
      options: [
        { id: "slow", label: "Slow pace (i.e. less than 3 mph)", value: 0 },
        { id: "steady", label: "Steady average pace", value: 1 },
        { id: "brisk", label: "Brisk pace", value: 2 },
        { id: "fast", label: "Fast pace (i.e. over 4mph)", value: 3 }
      ]
    }
  ]
};
