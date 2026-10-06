import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, Sparkles, ArrowRight, Briefcase, FileUp, X } from 'lucide-react';
import { SAMPLE_PRESETS, SamplePreset } from '../data/sampleResumes';

interface UploadZoneProps {
  onAnalyze: (payload: {
    resumeText?: string;
    resumeBase64?: string;
    mimeType?: string;
    fileName?: string;
    fileSize?: string;
    jobDescription?: string;
    targetRole?: string;
  }) => Promise<void>;
  isLoading: boolean;
}

export const UploadZone: React.FC<UploadZoneProps> = ({ onAnalyze, isLoading }) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'paste'>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [parsingStatus, setParsingStatus] = useState<string>('');

  const [resumeText, setResumeText] = useState<string>('');
  const [targetRole, setTargetRole] = useState<string>('');
  const [includeJd, setIncludeJd] = useState<boolean>(true);
  const [jobDescription, setJobDescription] = useState<string>('');
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const jdFileInputRef = useRef<HTMLInputElement>(null);

  const MAX_FILE_SIZE_MB = 10;
  const ALLOWED_EXTENSIONS = ['.pdf', '.doc', '.docx'];

  const handleFileSelection = (selectedFile: File) => {
    setFileError(null);
    setSelectedPresetId(null);

    // Extension check
    const lowerName = selectedFile.name.toLowerCase();
    const isSupported = ALLOWED_EXTENSIONS.some((ext) => lowerName.endsWith(ext));

    if (!isSupported) {
      setFileError('Unsupported file format. Please upload a PDF, DOC, or DOCX document.');
      return;
    }

    // Size check
    const sizeInMb = selectedFile.size / (1024 * 1024);
    if (sizeInMb > MAX_FILE_SIZE_MB) {
      setFileError(`File is too large (${sizeInMb.toFixed(1)} MB). Maximum allowed size is ${MAX_FILE_SIZE_MB} MB.`);
      return;
    }

    setFile(selectedFile);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  const handlePresetSelect = (preset: SamplePreset) => {
    setSelectedPresetId(preset.id);
    setFile(null);
    setFileError(null);
    setResumeText(preset.resumeText);
    setJobDescription(preset.jobDescription);
    setTargetRole(preset.role);
    setIncludeJd(true);
    setActiveTab('paste');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFileError(null);

    if (activeTab === 'upload' && !file) {
      setFileError('Please select a resume file (PDF, DOC, or DOCX) to upload.');
      return;
    }

    if (activeTab === 'paste' && !resumeText.trim()) {
      setFileError('Please paste your resume content to proceed.');
      return;
    }

    try {
      if (activeTab === 'upload' && file) {
        setProgress(25);
        setParsingStatus('Validating document structure & format...');
        await new Promise((r) => setTimeout(r, 400));

        setProgress(50);
        setParsingStatus('Extracting content, skills & career timeline...');

        // Convert file to base64
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = async () => {
          const base64String = (reader.result as string).split(',')[1];
          setProgress(75);
          setParsingStatus('Analyzing through the 10+ year Senior Recruiter lens...');

          await onAnalyze({
            resumeBase64: base64String,
            mimeType: file.type || 'application/pdf',
            fileName: file.name,
            fileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
            jobDescription: includeJd ? jobDescription : undefined,
            targetRole: targetRole.trim() || undefined,
          });
        };
      } else {
        setProgress(50);
        setParsingStatus('Analyzing resume & recruiter impact...');
        await onAnalyze({
          resumeText,
          fileName: selectedPresetId
            ? SAMPLE_PRESETS.find((p) => p.id === selectedPresetId)?.fileName
            : 'Pasted_Resume.txt',
          jobDescription: includeJd ? jobDescription : undefined,
          targetRole: targetRole.trim() || undefined,
        });
      }
    } catch (err: any) {
      setFileError(err.message || 'Analysis failed. Please check your document and try again.');
      setProgress(0);
      setParsingStatus('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      {/* Hero Headline */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Senior Recruiter Evaluation Engine</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-3">
          Your Resume.{' '}
          <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-rose-500 bg-clip-text text-transparent">
            Roasted by a Recruiter.
          </span>
          <br />Fixed by AI.
        </h1>
        <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto">
          Find out why your resume gets rejected in the first 6 seconds before the recruiter does. Candid, outcome-focused critique, ATS readiness checks, and high-impact rewrites.
        </p>

        {/* 1-Click Preset Selector */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Or test with a sample resume:</span>
          {SAMPLE_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => handlePresetSelect(preset)}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                selectedPresetId === preset.id
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800'
              }`}
            >
              {preset.name} ({preset.badge})
            </button>
          ))}
        </div>
      </div>

      {/* Main Upload Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl shadow-black/40 backdrop-blur-sm">
        {/* Tab switch: File Upload vs Text Paste */}
        <div className="flex border-b border-slate-800 pb-4 mb-6 justify-between items-center">
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={() => setActiveTab('upload')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors ${
                activeTab === 'upload'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white bg-slate-800/50'
              }`}
            >
              <FileUp className="w-4 h-4" />
              <span>Upload PDF / DOCX</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('paste')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors ${
                activeTab === 'paste'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white bg-slate-800/50'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Paste Resume Text</span>
            </button>
          </div>

          <div className="text-xs text-slate-400 hidden sm:block">
            Max 10 MB • PDF, DOC, DOCX
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {activeTab === 'upload' ? (
            <div>
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                  file
                    ? 'border-emerald-500/60 bg-emerald-500/5'
                    : 'border-slate-700 hover:border-amber-500/60 bg-slate-950/40 hover:bg-slate-950/70'
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => e.target.files?.[0] && handleFileSelection(e.target.files[0])}
                  accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  className="hidden"
                />

                {file ? (
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-semibold text-white mb-1">{file.name}</p>
                    <p className="text-xs text-slate-400 mb-3">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB • {file.type || 'Document'}
                    </p>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFile(null);
                      }}
                      className="inline-flex items-center space-x-1 text-xs text-rose-400 hover:text-rose-300 font-medium"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Remove file</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-slate-800 text-amber-400 flex items-center justify-center mb-3">
                      <UploadCloud className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-medium text-slate-200 mb-1">
                      Drag & drop your resume here, or <span className="text-amber-400 underline">browse</span>
                    </p>
                    <p className="text-xs text-slate-500">Supports PDF, DOC, DOCX up to 10MB</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Paste Resume Content
              </label>
              <textarea
                rows={8}
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste the full text of your resume (Contact info, Summary, Work History, Education, Skills)..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs sm:text-sm font-mono text-slate-200 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 resize-y"
              />
            </div>
          )}

          {/* Target Role input */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Target Role (Optional)
            </label>
            <div className="relative">
              <Briefcase className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="e.g. Senior Product Manager, Staff Infrastructure Engineer, Enterprise AE"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Specifying your desired role helps the recruiter evaluate seniority and keyword alignment accurately.
            </p>
          </div>

          {/* Target Job Description Section */}
          <div className="border border-slate-800 rounded-xl p-4 bg-slate-950/60">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="includeJd"
                  checked={includeJd}
                  onChange={(e) => setIncludeJd(e.target.checked)}
                  className="rounded border-slate-700 text-amber-500 focus:ring-amber-500/20 bg-slate-900 h-4 w-4"
                />
                <label htmlFor="includeJd" className="text-xs sm:text-sm font-bold text-slate-200 cursor-pointer">
                  Match Against a Target Job Description
                </label>
              </div>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                includeJd ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-slate-800 text-slate-400'
              }`}>
                {includeJd ? 'Resume + JD Comparison (25% Weight)' : 'Resume-Only Mode'}
              </span>
            </div>

            {includeJd && (
              <div className="space-y-3 pt-2">
                <p className="text-xs text-slate-400">
                  Paste the requirements, responsibilities, and qualifications from the target job posting to get a detailed match score, missing skills gap analysis, and keyword scan.
                </p>
                <textarea
                  rows={5}
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste Target Job Description (Requirements, Responsibilities, Preferred Qualifications)..."
                  className="w-full bg-slate-900/90 border border-slate-800 rounded-lg p-3 text-xs sm:text-sm font-mono text-slate-200 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                />
              </div>
            )}
          </div>

          {/* Error Message */}
          {fileError && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{fileError}</span>
            </div>
          )}

          {/* Progress / Status indicator */}
          {isLoading && (
            <div className="space-y-2 pt-2">
              <div className="flex justify-between text-xs font-medium text-slate-300">
                <span className="flex items-center space-x-2 text-amber-400">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  <span>{parsingStatus || 'Analyzing your resume...'}</span>
                </span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-amber-500 to-rose-500 h-full transition-all duration-300"
                  style={{ width: `${Math.max(progress, 15)}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-500 text-center italic">
                Senior recruiter is scanning ATS parseability, achievement metrics, and career progression...
              </p>
            </div>
          )}

          {/* Submit CTA */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-6 rounded-xl font-bold text-sm sm:text-base text-slate-950 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 hover:from-amber-300 hover:to-orange-400 transition-all shadow-lg shadow-amber-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 group"
          >
            <span>{isLoading ? 'Recruiter Is Reviewing...' : 'Roast My Resume'}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>
      </div>

      {/* Recruiter Guarantee Banner */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
        <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80">
          <p className="text-amber-400 font-bold text-sm mb-1">10+ Year Screening Model</p>
          <p className="text-xs text-slate-400">Evaluates business outcomes, scope, scale, and 6-second first impressions.</p>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80">
          <p className="text-amber-400 font-bold text-sm mb-1">Zero Fabricated Numbers</p>
          <p className="text-xs text-slate-400">Strictly maintains candidate truthfulness. Uses placeholders like [X%] where metrics are needed.</p>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80">
          <p className="text-amber-400 font-bold text-sm mb-1">ATS & Recruiter Ready</p>
          <p className="text-xs text-slate-400">Checks parsing compatibility, formatting traps, and job description alignment.</p>
        </div>
      </div>
    </div>
  );
};
