export interface OptionInput {
  id: string;
  name: string;
  notes?: string;
}

export interface DecisionInput {
  id: string;
  title: string;
  category: string;
  context: string;
  options: OptionInput[];
  userCriteria: string[];
  createdAt: string;
  status?: 'deciding' | 'decided' | 'revisit';
  chosenOptionIndex?: number;
}

export interface ProItem {
  point: string;
  impact: 'High' | 'Medium' | 'Low' | string;
  score: number;
  reasoning: string;
}

export interface ConItem {
  point: string;
  severity: 'High' | 'Medium' | 'Low' | string;
  score: number;
  mitigation: string;
}

export interface SwotMatrix {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export interface TimeHorizon {
  tenMinutes: string;
  tenMonths: string;
  tenYears: string;
}

export interface OptionAnalysis {
  optionIndex: number;
  optionName: string;
  tagline: string;
  pros: ProItem[];
  cons: ConItem[];
  swot: SwotMatrix;
  timeHorizon10x: TimeHorizon;
}

export interface CriterionScore {
  optionIndex: number;
  optionName: string;
  score: number;
  comment: string;
}

export interface Criterion {
  name: string;
  category: string;
  description: string;
  scores: CriterionScore[];
}

export interface ComparisonMatrix {
  criteria: Criterion[];
}

export interface TiebreakerVerdict {
  recommendedOptionIndex: number;
  recommendedOptionName: string;
  confidenceScore: number;
  headline: string;
  executiveSummary: string;
  theDecidingQuestion: string;
  reversibilityType: string;
  reversibilityExplanation: string;
  gutCheckPrompt: string;
  actionPlan: string[];
}

export interface DuelChoice {
  text: string;
  favorsOptionIndex: number;
}

export interface DuelQuestion {
  id: number;
  scenario: string;
  choiceA: DuelChoice;
  choiceB: DuelChoice;
}

export interface AnalysisResult {
  summary: string;
  optionsAnalysis: OptionAnalysis[];
  comparisonMatrix: ComparisonMatrix;
  tiebreakerVerdict: TiebreakerVerdict;
  tiebreakerDuelQuestions: DuelQuestion[];
}

export interface SavedDecisionRecord {
  id: string;
  input: DecisionInput;
  analysis: AnalysisResult;
  updatedAt: string;
  userWeights?: Record<string, number>; // criterion name -> weight 1 to 5
  duelAnswers?: Record<number, number>; // questionId -> chosenOptionIndex
}

export interface ChallengeResponse {
  devilsAdvocateSummary: string;
  blindspots: string[];
  worstCaseScenario: string;
  deriskingMoves: string[];
  acidTestQuestion: string;
}
