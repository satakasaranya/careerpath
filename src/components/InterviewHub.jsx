import React, { useState } from 'react';
import { theme } from '../theme';

export default function InterviewHub({ applications, onUpdateNotes, darkMode = true }) {
  const currentTheme = darkMode ? theme.dark : theme.light;
  
  // Filter applications that are in "Interview" or "Assessment" stage
  const interviewApps = applications.filter(
    (app) => app.status === 'Interview' || app.status === 'Assessment'
  );

  const [selectedAppId, setSelectedAppId] = useState(interviewApps[0]?.id || null);
  const selectedApp = applications.find((a) => a.id === selectedAppId) || interviewApps[0];

  const [prepNotes, setPrepNotes] = useState(selectedApp?.notes || '');
  const [activeTab, setActiveTab] = useState('cheatSheet'); // 'cheatSheet', 'star', 'salary'

  // STAR Method Template Generator
  const [starStories, setStarStories] = useState([
    {
      situation: 'Led a system architecture migration under tight deadlines.',
      task: 'Reduce database latency by 40% while ensuring zero downtime.',
      action: 'Implemented Redis caching layer and optimized PostgreSQL query indexes.',
      result: 'Cut average response times from 350ms to 85ms across core APIs.',
    },
  ]);

  const [newStory, setNewStory] = useState({ situation: '', task: '', action: '', result: '' });

  function handleAddStory(e) {
    e.preventDefault();
    if (!newStory.situation) return;
    setStarStories([...starStories, newStory]);
    setNewStory({ situation: '', task: '', action: '', result: '' });
  }

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className={`${currentTheme.bg.surface} p-6 rounded-xl border ${currentTheme.border.default} shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4`}>
        <div>
          <h2 className={`text-xl font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            🎙️ Interview Prep & Workspace
          </h2>
          <p className={`text-xs mt-1 font-bold ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Organize company research, STAR-method stories, and salary negotiation notes for active interviews.
          </p>
        </div>
        <span className={`text-xs font-black ${darkMode ? 'text-amber-300 bg-amber-950/60 border-amber-800' : 'text-amber-900 bg-amber-100 border-amber-300'} px-3 py-1.5 rounded-lg border self-start md:self-auto`}>
          Active Interviews: {interviewApps.length}
        </span>
      </div>

      {interviewApps.length === 0 ? (
        <div className={`${currentTheme.bg.surface} p-12 rounded-xl border ${currentTheme.border.default} text-center space-y-3`}>
          <p className="text-3xl">🎯</p>
          <h3 className={`text-base font-black ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>
            No Applications in Interview Stage
          </h3>
          <p className={`text-xs max-w-md mx-auto font-bold ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Move job cards to "Interview" or "Assessment" on your Kanban board to automatically populate this workspace.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Active Companies List */}
          <div className={`${currentTheme.bg.surface} p-4 rounded-xl border ${currentTheme.border.default} shadow-sm space-y-3`}>
            <h3 className={`text-xs font-black uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Active Pipeline
            </h3>
            <div className="space-y-2">
              {interviewApps.map((app) => (
                <button
                  key={app.id}
                  onClick={() => {
                    setSelectedAppId(app.id);
                    setPrepNotes(app.notes || '');
                  }}
                  className={`w-full text-left p-3 rounded-lg border text-xs font-black transition cursor-pointer flex justify-between items-center ${
                    (selectedApp?.id === app.id)
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
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${currentTheme.statusBadges[app.status]}`}>
                    {app.status}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Main Interview Prep Workspace */}
          <div className={`lg:col-span-3 ${currentTheme.bg.surface} p-6 rounded-xl border ${currentTheme.border.default} shadow-sm space-y-6`}>
            {/* Selected Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-4 border-slate-800">
              <div>
                <h3 className={`text-xl font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                  {selectedApp?.company_name} — {selectedApp?.role_title}
                </h3>
                <p className={`text-xs font-bold ${darkMode ? 'text-slate-400' : 'text-slate-600'} mt-0.5`}>
                  📍 {selectedApp?.location} | 📅 Applied: {selectedApp?.applied_date || 'N/A'}
                </p>
              </div>

              {/* Sub-Tabs Switcher */}
              <div className={`flex ${currentTheme.bg.muted} p-1 rounded-lg border ${currentTheme.border.default} text-xs font-black self-start sm:self-auto`}>
                <button
                  onClick={() => setActiveTab('cheatSheet')}
                  className={`px-3 py-1.5 rounded-md cursor-pointer ${
                    activeTab === 'cheatSheet' ? 'bg-emerald-600 text-white' : 'text-slate-300'
                  }`}
                >
                  📄 Company Notes
                </button>
                <button
                  onClick={() => setActiveTab('star')}
                  className={`px-3 py-1.5 rounded-md cursor-pointer ${
                    activeTab === 'star' ? 'bg-emerald-600 text-white' : 'text-slate-300'
                  }`}
                >
                  ⭐ STAR Stories
                </button>
              </div>
            </div>

            {/* TAB 1: COMPANY NOTES & CHEAT SHEET */}
            {activeTab === 'cheatSheet' && (
              <div className="space-y-4">
                <div>
                  <label className={`block text-xs font-black uppercase tracking-wider mb-2 ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                    Research & Interview Brief
                  </label>
                  <textarea
                    rows="8"
                    placeholder="Record company mission, tech stack, interviewer names, key products, and questions to ask..."
                    value={prepNotes}
                    onChange={(e) => setPrepNotes(e.target.value)}
                    className={`w-full p-3.5 text-xs font-semibold rounded-lg border ${currentTheme.border.default} ${currentTheme.bg.app} ${darkMode ? 'text-white placeholder-slate-500' : 'text-slate-900 placeholder-slate-400'} focus:ring-2 focus:ring-emerald-600 focus:outline-none`}
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => onUpdateNotes(selectedApp.id, prepNotes)}
                    className={currentTheme.buttons.primary}
                  >
                    💾 Save Notes
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: STAR METHOD STORIES */}
            {activeTab === 'star' && (
              <div className="space-y-6">
                <div className="space-y-3">
                  <h4 className={`text-xs font-black uppercase tracking-wider ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    Saved Behavioral Stories (Situation, Task, Action, Result)
                  </h4>

                  {starStories.map((story, idx) => (
                    <div key={idx} className={`p-4 rounded-xl border ${currentTheme.border.default} ${currentTheme.bg.muted} space-y-2 text-xs`}>
                      <p><span className="font-black text-emerald-400">Situation:</span> <span className={darkMode ? 'text-slate-200' : 'text-slate-800'}>{story.situation}</span></p>
                      <p><span className="font-black text-amber-400">Task:</span> <span className={darkMode ? 'text-slate-200' : 'text-slate-800'}>{story.task}</span></p>
                      <p><span className="font-black text-blue-400">Action:</span> <span className={darkMode ? 'text-slate-200' : 'text-slate-800'}>{story.action}</span></p>
                      <p><span className="font-black text-purple-400">Result:</span> <span className={darkMode ? 'text-slate-200' : 'text-slate-800'}>{story.result}</span></p>
                    </div>
                  ))}
                </div>

                {/* Add STAR Story Form */}
                <form onSubmit={handleAddStory} className={`p-4 rounded-xl border ${currentTheme.border.default} ${currentTheme.bg.app} space-y-3`}>
                  <h4 className={`text-xs font-black uppercase tracking-wider ${darkMode ? 'text-amber-400' : 'text-amber-600'}`}>
                    + Add New STAR Story
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Situation..."
                      value={newStory.situation}
                      onChange={(e) => setNewStory({ ...newStory, situation: e.target.value })}
                      className={`p-2.5 text-xs font-bold rounded-lg border ${currentTheme.border.default} ${currentTheme.bg.surface} ${darkMode ? 'text-white' : 'text-slate-900'}`}
                    />
                    <input
                      type="text"
                      placeholder="Task..."
                      value={newStory.task}
                      onChange={(e) => setNewStory({ ...newStory, task: e.target.value })}
                      className={`p-2.5 text-xs font-bold rounded-lg border ${currentTheme.border.default} ${currentTheme.bg.surface} ${darkMode ? 'text-white' : 'text-slate-900'}`}
                    />
                    <input
                      type="text"
                      placeholder="Action..."
                      value={newStory.action}
                      onChange={(e) => setNewStory({ ...newStory, action: e.target.value })}
                      className={`p-2.5 text-xs font-bold rounded-lg border ${currentTheme.border.default} ${currentTheme.bg.surface} ${darkMode ? 'text-white' : 'text-slate-900'}`}
                    />
                    <input
                      type="text"
                      placeholder="Result..."
                      value={newStory.result}
                      onChange={(e) => setNewStory({ ...newStory, result: e.target.value })}
                      className={`p-2.5 text-xs font-bold rounded-lg border ${currentTheme.border.default} ${currentTheme.bg.surface} ${darkMode ? 'text-white' : 'text-slate-900'}`}
                    />
                  </div>

                  <button type="submit" className={currentTheme.buttons.primary}>
                    + Add STAR Story
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}