import { ResumeAnalysis } from '../types/resume';

export interface AnalyzeResumeParams {
  resumeText?: string;
  resumeBase64?: string;
  mimeType?: string;
  fileName?: string;
  jobDescription?: string;
  targetRole?: string;
}

export async function analyzeResumeApi(params: AnalyzeResumeParams): Promise<ResumeAnalysis> {
  const response = await fetch('/api/analyze-resume', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    let errMessage = 'Failed to analyze resume.';
    try {
      const errData = await response.json();
      if (errData.error) errMessage = errData.error;
    } catch (e) {
      // ignore
    }
    throw new Error(errMessage);
  }

  return response.json();
}

export async function rewriteBulletApi(params: {
  bullet: string;
  targetRole?: string;
  context?: string;
}): Promise<{ betterVersion: string; frameworkBreakdown?: any; metricsAdvice?: string }> {
  const response = await fetch('/api/rewrite-bullet', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    throw new Error('Failed to rewrite bullet.');
  }

  return response.json();
}
