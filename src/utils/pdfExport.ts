import { jsPDF } from 'jspdf';
import { ResumeAnalysis } from '../types/resume';

export function exportAnalysisPDF(analysis: ResumeAnalysis) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'letter',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 40;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  // Header Bar
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, pageWidth, 85, 'F');

  doc.setTextColor(245, 158, 11); // amber-500
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text('RESUME ROAST AI — RECRUITER AUDIT REPORT', margin, 38);

  doc.setTextColor(203, 213, 225); // slate-300
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(`Candidate: ${analysis.candidateName || 'Candidate'}  |  Target Role: ${analysis.targetRole || 'Not specified'}  |  Date: ${new Date(analysis.timestamp).toLocaleDateString()}`, margin, 58);

  y = 110;

  // Overall Score Banner
  doc.setFillColor(241, 245, 249); // slate-100
  doc.roundedRect(margin, y, contentWidth, 70, 6, 6, 'F');

  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('OVERALL RESUME SCORE', margin + 16, y + 26);

  doc.setFontSize(28);
  doc.setTextColor(analysis.overallScore >= 80 ? 22 : analysis.overallScore >= 70 ? 217 : 225, analysis.overallScore >= 80 ? 101 : analysis.overallScore >= 70 ? 119 : 29, analysis.overallScore >= 80 ? 52 : analysis.overallScore >= 70 ? 6 : 72);
  doc.text(`${analysis.overallScore}/100`, margin + 16, y + 55);

  doc.setFontSize(11);
  doc.setTextColor(71, 85, 105);
  doc.text(`Status: ${analysis.scoreStatus}`, margin + 130, y + 42);
  doc.setFontSize(9);
  doc.text('Evaluated through the lens of a Senior 10+ Year Tech Recruiter & ATS Parser', margin + 130, y + 56);

  y += 90;

  // Recruiter Roast: The Biggest Problem
  doc.setFillColor(254, 242, 242); // rose-50
  doc.setDrawColor(248, 113, 113);
  doc.roundedRect(margin, y, contentWidth, 90, 6, 6, 'FD');

  doc.setTextColor(153, 27, 27);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('🔥 THE RECRUITER ROAST: BIGGEST PROBLEM', margin + 16, y + 22);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(30, 41, 59);

  const problemLines = doc.splitTextToSize(analysis.recruiterRoast.biggestProblem, contentWidth - 32);
  doc.text(problemLines, margin + 16, y + 38);

  const reactionY = y + 38 + problemLines.length * 13;
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(100, 116, 139);
  const reactLines = doc.splitTextToSize(`Recruiter Reaction: "${analysis.recruiterRoast.recruiterReaction}"`, contentWidth - 32);
  doc.text(reactLines, margin + 16, reactionY);

  y += 110;

  // Category Breakdown Table
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('SCORING BREAKDOWN', margin, y);
  y += 15;

  const categories = [
    analysis.scoreBreakdown.atsScore,
    analysis.scoreBreakdown.impactScore,
    analysis.scoreBreakdown.contentScore,
    analysis.scoreBreakdown.skillsScore,
    analysis.scoreBreakdown.careerStoryScore,
    analysis.scoreBreakdown.readabilityScore,
  ];

  categories.forEach((cat) => {
    if (!cat) return;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(51, 65, 85);
    doc.text(`${cat.name} (${cat.weight}%)`, margin, y);

    doc.setTextColor(15, 23, 42);
    doc.text(`${cat.score}/100`, margin + 160, y);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    const feedbackLine = doc.splitTextToSize(cat.feedback || '', contentWidth - 210);
    doc.text(feedbackLine[0] || '', margin + 210, y);

    y += 18;
  });

  y += 15;

  // Top 5 Action Items
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('PRIORITY ACTION PLAN (TOP FIXES)', margin, y);
  y += 18;

  analysis.actionPlan?.slice(0, 4).forEach((item, idx) => {
    if (y > 700) {
      doc.addPage();
      y = margin;
    }
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text(`${idx + 1}. ${item.whatToChange}`, margin, y);
    y += 13;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(71, 85, 105);
    const whyText = doc.splitTextToSize(`Why: ${item.why}`, contentWidth - 10);
    doc.text(whyText, margin + 12, y);
    y += whyText.length * 12 + 6;
  });

  // Footer Disclaimer
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text(
    'Notice: Resume Roast AI is an AI-assisted evaluation model designed to simulate senior recruiter screening and ATS parsing. Scores do not represent guaranteed hiring outcomes.',
    margin,
    770
  );

  doc.save(`Resume_Roast_Report_${(analysis.candidateName || 'Candidate').replace(/\s+/g, '_')}.pdf`);
}

export function exportImprovedResumePDF(analysis: ResumeAnalysis, editedContent?: string) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'letter',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 45;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  // Candidate Name & Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(15, 23, 42);
  doc.text(analysis.candidateName || 'Candidate Name', margin, y + 10);
  y += 28;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(71, 85, 105);
  doc.text(`Target Role: ${analysis.targetRole || 'Professional'}  |  Recruiter-Optimized Draft`, margin, y);
  y += 16;

  // Divider
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(1);
  doc.line(margin, y, margin + contentWidth, y);
  y += 20;

  if (editedContent) {
    // If user provided custom edited markdown or text
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(30, 41, 59);
    const lines = doc.splitTextToSize(editedContent, contentWidth);
    lines.forEach((line: string) => {
      if (y > 740) {
        doc.addPage();
        y = margin;
      }
      doc.text(line, margin, y);
      y += 14;
    });
  } else {
    // Render improved sections
    analysis.improvedSections?.forEach((sec) => {
      if (y > 700) {
        doc.addPage();
        y = margin;
      }

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(15, 23, 42);
      doc.text(sec.sectionTitle.toUpperCase(), margin, y);
      y += 6;

      doc.setDrawColor(226, 232, 240);
      doc.line(margin, y, margin + contentWidth, y);
      y += 14;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9.5);
      doc.setTextColor(51, 65, 85);

      const sectionLines = doc.splitTextToSize(sec.improvedContent, contentWidth);
      sectionLines.forEach((line: string) => {
        if (y > 740) {
          doc.addPage();
          y = margin;
        }
        doc.text(line, margin, y);
        y += 13;
      });

      y += 15;
    });
  }

  doc.save(`${(analysis.candidateName || 'Candidate').replace(/\s+/g, '_')}_Recruiter_Optimized_Resume.pdf`);
}

export function downloadTextFile(filename: string, content: string) {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
