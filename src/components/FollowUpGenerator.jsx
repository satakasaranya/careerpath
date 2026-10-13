import React, { useState } from 'react';
import { theme } from '../theme';

export default function FollowUpGenerator({ applications, darkMode = true }) {
  const currentTheme = darkMode ? theme.dark : theme.light;

  // Identify stale applications (> 14 days without update)
  const fourteenDaysAgo = new Date();
  fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

  const staleApps = applications.filter((app) => {
    if (!app.applied_date) return false;
    const appliedDate = new Date(app.applied_date);
    return appliedDate <= fourteenDaysAgo && (app.status === 'Applied' || app.status === 'Interview');
  });

  const [selectedApp, setSelectedApp] = useState(staleApps[0] || applications[0] || null);
  const [templateType, setTemplateType] = useState('staleCheckIn'); // 'staleCheckIn', 'postInterview', 'offerNegotiation'
  const [copied, setCopied] = useState(false);

  function generateEmailText() {
    if (!selectedApp) return '';

    const company = selectedApp.company_name || '[Company Name]';
    const role = selectedApp.role_title || '[Role Title]';

    if (templateType === 'staleCheckIn') {
      return `Subject: Following up on Application for ${role} - ${company}

Hi Hiring Team,

I hope you're having a great week!

I'm following up on my application for the ${role} position at ${company}. I remains very excited about the possibility of joining your team and contributing to your upcoming initiatives.

Could you provide a quick update regarding the status of my application or next steps in the hiring timeline?

Best regards,
[Your Name]
[Your Phone / Portfolio Link]`;
    }

    if (templateType === 'postInterview') {
      return `Subject: Thank you for the interview - ${role} at ${company}

Hi [Interviewer Name],

Thank you for taking the time to speak with me today about the ${role} role at ${company}. I thoroughly enjoyed learning more about your team's current priorities and projects.

Our conversation reinforced my strong enthusiasm for this role, and I am confident that my technical skills and experience align well with your team's goals.

Please let me know if you need any additional information from my end. Looking forward to hearing about the next steps!

Best regards,
[Your Name]`;
    }

    if (templateType === 'offerNegotiation') {
      return `Subject: ${role} Offer Discussion - ${company}

Hi [Hiring Manager / Recruiter Name],

Thank you so much for extending the offer for the ${role} position at ${company}! I am thrilled about the opportunity to join the team.

Before finalizing the offer, I wanted to discuss the compensation package. Based on my experience and current industry standards for this role, I was hoping to see if there is flexibility around the base salary or starting bonus.

I am eager to finalize the details and would love to schedule a brief call to discuss this further.

Best regards,
[Your Name]`;
    }

    return '';
  }

  const emailBody = generateEmailText();

  function handleCopy() {
    navigator.clipboard.writeText(emailBody);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className={`${currentTheme.bg.surface} p-6 rounded-xl border ${currentTheme.border.default} shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4`}>
        <div>
          <h2 className={`text-xl font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            ⏰ Follow-Up Reminders & Email Generator
          </h2>
          <p className={`text-xs mt-1 font-bold ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Automatically detect stale applications and draft tailored follow-up emails in seconds.
          </p>
        </div>
        <span className={`text-xs font-black ${staleApps.length > 0 ? 'text-rose-300 bg-rose-950/60 border-rose-800' : 'text-emerald-300 bg-emerald-950/60 border-emerald-800'} px-3 py-1.5 rounded-lg border self-start md:self-auto`}>
          {staleApps.length} Stale Applications (&gt;14 Days)
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stale Applications Selector */}
        <div className={`${currentTheme.bg.surface} p-5 rounded-xl border ${currentTheme.border.default} shadow-sm space-y-4`}>
          <h3 className={`text-xs font-black uppercase tracking-wider ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
            Target Application
          </h3>

          <div className="space-y-2">
            {applications.map((app) => (
              <button
                key={app.id}
                onClick={() => setSelectedApp(app)}
                className={`w-full text-left p-3 rounded-lg border text-xs font-black transition cursor-pointer flex justify-between items-center ${
                  selectedApp?.id === app.id
                    ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                    : `${currentTheme.bg.muted}${darkMode ? 'text-slate-200 border-slate-700 hover:bg-slate-700' : 'text-slate-800 border-slate-300 hover:bg-slate-200'}`
                }`}
              >
                <div>
                  <p className="truncate">{app.company_name}</p>
                  <p className={`text-[11px] font-bold ${selectedApp?.id === app.id ? 'text-emerald-100' : 'text-slate-400'}`}>
                    {app.role_title}
                  </p>
                </div>
                {staleApps.some((s) => s.id === app.id) && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-black bg-rose-900 text-rose-100 border border-rose-700">
                    ⚠️ Stale
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Email Generator Editor */}
        <div className={`lg:col-span-2 ${currentTheme.bg.surface} p-6 rounded-xl border ${currentTheme.border.default} shadow-sm space-y-5`}>
          {/* Template Type Selector */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <h3 className={`text-sm font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              Select Email Objective
            </h3>

            <div className={`flex overflow-x-auto ${currentTheme.bg.muted} p-1 rounded-lg border ${currentTheme.border.default} text-xs font-black`}>
              <button
                onClick={() => setTemplateType('staleCheckIn')}
                className={`px-3 py-1.5 rounded-md whitespace-nowrap cursor-pointer ${
                  templateType === 'staleCheckIn' ? 'bg-emerald-600 text-white' : 'text-slate-300'
                }`}
              >
                📩 Stale Check-In
              </button>
              <button
                onClick={() => setTemplateType('postInterview')}
                className={`px-3 py-1.5 rounded-md whitespace-nowrap cursor-pointer ${
                  templateType === 'postInterview' ? 'bg-emerald-600 text-white' : 'text-slate-300'
                }`}
              >
                🤝 Post-Interview Thank You
              </button>
              <button
                onClick={() => setTemplateType('offerNegotiation')}
                className={`px-3 py-1.5 rounded-md whitespace-nowrap cursor-pointer ${
                  templateType === 'offerNegotiation' ? 'bg-emerald-600 text-white' : 'text-slate-300'
                }`}
              >
                💰 Offer Negotiation
              </button>
            </div>
          </div>

          {/* Rendered Email Content Box */}
          <div className="space-y-3">
            <textarea
              readOnly
              rows="12"
              value={emailBody}
              className={`w-full p-4 text-xs font-semibold rounded-lg border ${currentTheme.border.default} ${currentTheme.bg.app} ${darkMode ? 'text-white' : 'text-slate-900'} focus:outline-none font-mono leading-relaxed`}
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={handleCopy}
                className={currentTheme.buttons.primary}
              >
                {copied ? '✅ Copied to Clipboard!' : '📋 Copy Email Text'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}