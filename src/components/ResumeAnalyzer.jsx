import { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Loader2, Briefcase, FileText, Key, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';

const ROLES = ['Software Engineer', 'Product Manager', 'Data Scientist', 'UX Designer'];

export default function ResumeAnalyzer() {
  const [apiKey, setApiKey] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [jobRole, setJobRole] = useState(ROLES[0]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    if (!apiKey) {
      setError('Please provide a Gemini API Key.');
      return;
    }
    if (!resumeText.trim()) {
      setError('Please paste your resume text.');
      return;
    }

    setIsAnalyzing(true);
    setError('');
    setResult(null);

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const prompt = `
        Act as an expert technical recruiter and resume reviewer.
        Analyze the following resume for the target role of ${jobRole}.
        Provide the output STRICTLY as a valid JSON object with EXACTLY the following keys (no extra text):
        {
          "skills": ["skill 1", "skill 2"],
          "strengths": ["strength 1", "strength 2"],
          "areasToImprove": ["area 1", "area 2"],
          "suggestions": ["suggestion 1", "suggestion 2"]
        }

        Resume Text:
        ${resumeText}
      `;

      const response = await model.generateContent(prompt);
      const responseText = response.response.text();
      
      const jsonStr = responseText.replace(/```json/gi, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(jsonStr);
      
      setResult(parsed);
    } catch (err) {
      console.error(err);
      setError('Failed to analyze the resume. Please check your API key and try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-8">
      <div className="mb-10 text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white inline-flex items-center gap-3">
          <Sparkles className="w-10 h-10 text-blue-500" />
          AI Resume Analyzer
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          Elevate your career with AI-powered insights. Paste your resume and get tailored feedback for your dream role.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Input Form */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 shadow-xl relative overflow-hidden group hover:border-blue-500/30 transition-colors">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="space-y-5 relative">
              {/* API Key */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                  <Key className="w-4 h-4 text-blue-400" /> Gemini API Key
                </label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Job Role */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-blue-400" /> Target Role
                </label>
                <select
                  value={jobRole}
                  onChange={(e) => setJobRole(e.target.value)}
                  className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none cursor-pointer"
                >
                  {ROLES.map((role) => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>

              {/* Resume Text */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-400" /> Resume Content
                </label>
                <textarea
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder="Paste your resume here..."
                  rows={8}
                  className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                />
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <p className="text-sm">{error}</p>
                </div>
              )}

              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold py-4 px-6 rounded-xl shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Analyzing your profile...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Analyze Resume
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Results */}
        <div className="lg:col-span-7">
          {result ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
              {/* Skills */}
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <span className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                    <Sparkles className="w-5 h-5" />
                  </span>
                  Key Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {result.skills?.map((skill, i) => (
                    <span key={i} className="px-3 py-1.5 bg-slate-900 text-blue-300 rounded-full text-sm font-medium border border-blue-500/20">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Strengths */}
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-emerald-500/20">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <span className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
                      <CheckCircle2 className="w-5 h-5" />
                    </span>
                    Core Strengths
                  </h3>
                  <ul className="space-y-3">
                    {result.strengths?.map((item, i) => (
                      <li key={i} className="text-slate-300 text-sm flex items-start gap-2">
                        <span className="text-emerald-500 mt-1">•</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Areas to Improve */}
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-amber-500/20">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <span className="p-2 bg-amber-500/10 rounded-lg text-amber-400">
                      <AlertCircle className="w-5 h-5" />
                    </span>
                    Areas to Improve
                  </h3>
                  <ul className="space-y-3">
                    {result.areasToImprove?.map((item, i) => (
                      <li key={i} className="text-slate-300 text-sm flex items-start gap-2">
                        <span className="text-amber-500 mt-1">•</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Suggestions */}
              <div className="bg-gradient-to-r from-blue-900/20 to-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-blue-500/20">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <span className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
                    <Briefcase className="w-5 h-5" />
                  </span>
                  Actionable Suggestions
                </h3>
                <div className="space-y-4">
                  {result.suggestions?.map((suggestion, i) => (
                    <div key={i} className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50 text-slate-300 text-sm leading-relaxed">
                      {suggestion}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[400px] bg-slate-800/30 border border-slate-700/50 border-dashed rounded-2xl flex flex-col items-center justify-center p-8 text-center">
              <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-6">
                <FileText className="w-10 h-10 text-slate-500" />
              </div>
              <h3 className="text-xl font-medium text-slate-300 mb-2">Awaiting Resume</h3>
              <p className="text-slate-500 max-w-sm">
                Paste your resume and click analyze to see detailed feedback, skills breakdown, and actionable suggestions.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
