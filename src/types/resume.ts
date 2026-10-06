export type ScoreStatus = 
  | 'Exceptional' 
  | 'Strong' 
  | 'Good but improvable' 
  | 'Needs improvement' 
  | 'High risk of rejection';

export type SeverityLevel = 'Critical' | 'High' | 'Medium' | 'Low';

export type MatchLevel = 'Strong Match' | 'Partial Match' | 'Missing';

export interface ScoreCategory {
  name: string;
  score: number;
  weight: number;
  status: 'good' | 'warning' | 'danger';
  feedback: string;
}

export interface RecruiterRoast {
  candidateName: string;
  targetRole: string;
  overallScore: number;
  scoreStatus: ScoreStatus;
  oneSentenceStory: string;
  sixSecondImpression: string;
  biggestProblem: string;
  recruiterReaction: string;
  whatThisSignals: string;
  howToFixIt: string;
}

export interface ProblemItem {
  id: string;
  severity: SeverityLevel;
  problem: string;
  whyItMatters: string;
  exampleFromResume: string;
  recommendedFix: string;
  suggestedRewrite: string;
}

export interface BulletReview {
  id: string;
  originalBullet: string;
  companyOrRole?: string;
  problem: string;
  recruiterConcern: string;
  betterVersion: string;
  missingMetricAdvice: string;
}

export interface JobMatchItem {
  jdRequirement: string;
  category: 'Required Skill' | 'Responsibility' | 'Domain' | 'Tool' | 'Seniority' | 'Certification';
  matchLevel: MatchLevel;
  resumeEvidence: string;
  gapExplanation: string;
}

export interface JobMatchBreakdown {
  overallMatch: number;
  requiredSkills: number;
  responsibilities: number;
  domain: number;
  seniority: number;
  tools: number;
  keywords: number;
  keyGaps: string[];
}

export interface SkillsGapAnalysis {
  strongSkills: string[];
  transferableSkills: string[];
  missingSkills: Array<{
    skill: string;
    warning: string;
  }>;
  overusedKeywords: string[];
  keywordsPresent: string[];
  missingKeywords: string[];
}

export interface RoleRelevance {
  roleTitle: string;
  company: string;
  relevance: 'High' | 'Medium' | 'Low';
  reasoning: string;
  evidence: string;
}

export interface ATSCheckItem {
  name: string;
  status: 'Pass' | 'Warning' | 'Fail';
  riskDescription: string;
  recommendation: string;
}

export interface SectionAnalysis {
  sectionName: string;
  present: boolean;
  quality: 'Strong' | 'Average' | 'Needs Work' | 'Missing';
  recommendation: string;
}

export interface SummaryAnalysis {
  currentSummary: string;
  problems: string[];
  suggestedSummary: string;
}

export interface ActionPlanItem {
  stepNumber: number;
  whatToChange: string;
  why: string;
  how: string;
  example: string;
}

export interface ImprovedSection {
  id: string;
  sectionTitle: string;
  originalContent: string;
  improvedContent: string;
  accepted?: boolean;
}

export interface ResumeAnalysis {
  id: string;
  timestamp: number;
  fileName: string;
  fileSize?: string;
  hasJobDescription: boolean;
  targetRole: string;
  candidateName: string;

  // Scores
  overallScore: number;
  scoreStatus: ScoreStatus;
  scoreBreakdown: {
    atsScore: ScoreCategory;
    jobMatchScore: ScoreCategory;
    impactScore: ScoreCategory;
    contentScore: ScoreCategory;
    skillsScore: ScoreCategory;
    careerStoryScore: ScoreCategory;
    readabilityScore: ScoreCategory;
  };

  // Roast core
  recruiterRoast: RecruiterRoast;

  // Top 10 Problems
  topProblems: ProblemItem[];

  // Bullet analysis
  bulletReviews: BulletReview[];

  // Job Match (if JD provided)
  jobMatchBreakdown?: JobMatchBreakdown;
  jobMatchComparisons?: JobMatchItem[];
  skillsGap?: SkillsGapAnalysis;
  roleRelevance?: RoleRelevance[];

  // ATS & Structure
  atsReadinessScore: number;
  atsRisks: ATSCheckItem[];
  structureAnalysis: SectionAnalysis[];

  // Summary & Framework
  summaryAnalysis: SummaryAnalysis;
  actionPlan: ActionPlanItem[];

  // Improved Resume Draft
  improvedSections: ImprovedSection[];
}
