export interface AnalysisResult {
  riskLevel: string
  similarityScore?: number
  riskSentenceCount?: number
  headline?: string
  sampleSentence?: string
  sampleReason?: string
  beforeAfterExamples?: { original: string; improved: string | null }[]
  abstractRatio?: number
  generalRatio?: number
  subjectRepeat?: string
  concreteDensity?: string
  penaltyScenarios?: string[]
  bullets?: string[]
}
