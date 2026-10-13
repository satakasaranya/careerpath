import React, { useState } from 'react';
import { theme } from '../theme';

export default function ResumeMatcher({ darkMode = true }) {
  const currentTheme = darkMode ? theme.dark : theme.light;

  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState(null);

  function handleAnalyze(e) {
    e.preventDefault();
    if (!resumeText.trim() || !jobDescription.trim()) return;

    setAnalyzing(true);

    // Keyword extraction & match calculation algorithm
    setTimeout(() => {
      const stopWords = new Set([
        'the', 'and', 'a', 'an', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from',
        'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does',
        'did', 'will', 'would', 'should', 'can', 'could', 'may', 'might', 'must', 'about',
        'we', 'our', 'you', 'your', 'this', 'that', 'these', 'those', 'as', 'or', 'if', 'into'
      ]);

      const tokenize = (text) =>
        text
          .toLowerCase()
          .replace(/[^\w\s+#]/g, ' ')
          .split(/\s+/)
          .filter((word) => word.length > 2 && !stopWords.has(word));

      const jobTokens = tokenize(jobDescription);
      const resumeTokens = new Set(tokenize(resumeText));

      // Frequency map for job description
      const jobFreq = {};
      jobTokens.forEach((token) => {
        jobFreq[token] = (jobFreq[token] || 0) + 1;
      });

      // Filter for primary keywords (frequently repeated or tech terms)
      const uniqueJobKeywords = Object.keys(jobFreq).sort((a, b) => jobFreq[b] - jobFreq[a]);

      const matched = [];
      const missing = [];

      uniqueJobKeywords.forEach((kw) => {
        if (resumeTokens.has(kw)) {
          matched.push(kw);
        } else {
          missing.push(kw);
        }
      });

      const totalKeywords = uniqueJobKeywords.length || 1;
      const score = Math.min(100, Math.round((matched.length / totalKeywords) * 100));

      // Generate action items based on missing top keywords
      const topMissing = missing.slice(0, 5);
      const suggestions = topMissing.map(
        (kw) => `Incorporate experience with "${kw.toUpperCase()}" in your summary or skill section.`
      );

      setResults({
        score,
        matchedKeywords: matched.slice(0, 15),
        missingKeywords: missing.slice(0, 15),
        suggestions,
      });

      setAnalyzing(false);
    }, 800);
  }

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className={`${currentTheme.bg.surface} p-6 rounded-xl border ${currentTheme.border.default} shadow-sm`}>
        <h2 className={`text-xl font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>
          🎯 AI Resume Keyword Matcher
        </h2>
        <p className={`text-xs mt-1 font-bold ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
          Paste your master resume and a target job description to analyze keyword coverage and improve match rates.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <form onSubmit={handleAnalyze} className={`${currentTheme.bg.surface} p-6 rounded-xl border ${currentTheme.border.default} shadow-sm space-y-4`}>
          <div>
            <label className={`block text-xs font-black uppercase tracking-wider mb-2 ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>
              Your Master Resume / Experience
            </label>
            <textarea
              rows="7"
              required
              placeholder="Paste your resume content, skills, or bullet points here..."
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              className={`w-full p-3.5 text-xs font-semibold rounded-lg border ${currentTheme.border.default} ${currentTheme.bg.app} ${darkMode ? 'text-white placeholder-slate-500' : 'text-slate-900 placeholder-slate-400'} focus:ring-2 focus:ring-emerald-600 focus:outline-none`}
            />
          </div>

          <div>
            <label className={`block text-xs font-black uppercase tracking-wider mb-2 ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>
              Target Job Description
            </label>
            <textarea
              rows="7"
              required
              placeholder="Paste the full job posting, key responsibilities, or requirements here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className={`w-full p-3.5 text-xs font-semibold rounded-lg border ${currentTheme.border.default} ${currentTheme.bg.app} ${darkMode ? 'text-white placeholder-slate-500' : 'text-slate-900 placeholder-slate-400'} focus:ring-2 focus:ring-emerald-600 focus:outline-none`}
            />
          </div>

          <button
            type="submit"
            disabled={analyzing}
            className={`w-full py-3 rounded-lg font-black text-xs transition cursor-pointer flex items-center justify-center gap-2 ${
              analyzing
                ? 'bg-emerald-800 text-emerald-200 cursor-not-allowed'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md'
            }`}
          >
            {analyzing ? '⚡ Analyzing Match Score...' : '🚀 Calculate Match Score'}
          </button>
        </form>

        {/* Results Panel */}
        <div className={`${currentTheme.bg.surface} p-6 rounded-xl border ${currentTheme.border.default} shadow-sm space-y-6 flex flex-col justify-between`}>
          {!results ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-16 space-y-3">
              <span className="text-4xl">📊</span>
              <p className={`text-sm font-extrabold ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                Ready for Analysis
              </p>
              <p className={`text-xs max-w-xs font-semibold ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>
                Provide both your resume and the target job description to compute the match breakdown.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Match Score Indicator */}
              <div className={`p-5 rounded-xl border ${currentTheme.border.default} ${currentTheme.bg.muted} flex items-center justify-between`}>
                <div>
                  <p className={`text-xs font-black uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    Overall Keyword Coverage
                  </p>
                  <p className="text-3xl font-black mt-1 text-emerald-500">
                    {results.score}% Match
                  </p>
                </div>
                <div className={`w-16 h-16 rounded-full flex items-center justify-center border-4 font-black text-lg ${
                  results.score >= 75
                    ? 'border-emerald-500 text-emerald-400 bg-emerald-950/40'
                    : results.score >= 50
                    ? 'border-amber-500 text-amber-400 bg-amber-950/40'
                    : 'border-rose-500 text-rose-400 bg-rose-950/40'
                }`}>
                  {results.score}%
                </div>
              </div>

              {/* Keyword Badges */}
              <div className="space-y-4">
                <div>
                  <h4 className={`text-xs font-black uppercase tracking-wider mb-2 text-emerald-400`}>
                    ✅ Matched Keywords ({results.matchedKeywords.length})
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {results.matchedKeywords.length > 0 ? (
                      results.matchedKeywords.map((kw) => (
                        <span key={kw} className="px-2.5 py-1 bg-emerald-950 text-emerald-200 border border-emerald-800 text-[11px] font-black rounded-md capitalize">
                          {kw}
                        </span>
                      ))
                    ) : (
                      <p className="text-xs font-bold text-slate-500">None detected.</p>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className={`text-xs font-black uppercase tracking-wider mb-2 text-rose-400`}>
                    ⚠️ Missing Core Keywords ({results.missingKeywords.length})
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {results.missingKeywords.length > 0 ? (
                      results.missingKeywords.map((kw) => (
                        <span key={kw} className="px-2.5 py-1 bg-rose-950 text-rose-200 border border-rose-800 text-[11px] font-black rounded-md capitalize">
                          {kw}
                        </span>
                      ))
                    ) : (
                      <p className="text-xs font-bold text-emerald-400">Great coverage! All key terms matched.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Actionable Tailoring Recommendations */}
              <div className={`p-4 rounded-xl border ${currentTheme.border.subtle} ${currentTheme.bg.app} space-y-2`}>
                <h4 className={`text-xs font-black uppercase tracking-wider ${darkMode ? 'text-amber-400' : 'text-amber-600'}`}>
                  💡 Tailoring Recommendations
                </h4>
                <ul className="space-y-1.5 text-xs font-semibold">
                  {results.suggestions.map((s, idx) => (
                    <li key={idx} className={`flex items-start gap-2 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                      <span className="text-amber-500">•</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}