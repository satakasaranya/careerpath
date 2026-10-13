import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { theme } from './theme';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import ResumeMatcher from './components/ResumeMatcher';
import InterviewHub from './components/InterviewHub';
import FollowUpGenerator from './components/FollowUpGenerator';

export default function App() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('kanban'); // 'kanban', 'grid', 'analytics', 'matcher', 'interview', 'reminders'
  const [darkMode, setDarkMode] = useState(true);
  const [draggedAppId, setDraggedAppId] = useState(null);

  const currentTheme = darkMode ? theme.dark : theme.light;

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    company_name: '',
    role_title: '',
    status: 'Saved',
    location: 'Remote',
    job_url: '',
    applied_date: new Date().toISOString().split('T')[0],
    notes: '',
  });

  useEffect(() => {
    fetchApplications();
  }, []);

  async function fetchApplications() {
    setLoading(true);
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) console.error('Error fetching applications:', error);
    else setApplications(data || []);
    setLoading(false);
  }

  // Drag & Drop Handlers
  function handleDragStart(e, id) {
    setDraggedAppId(id);
    e.dataTransfer.setData('text/plain', id);
  }

  function handleDragOver(e) {
    e.preventDefault();
  }

  async function handleDrop(e, newStatus) {
    e.preventDefault();
    const appId = draggedAppId || e.dataTransfer.getData('text/plain');
    if (!appId) return;

    setApplications((prev) =>
      prev.map((app) => (app.id === appId ? { ...app, status: newStatus } : app))
    );

    const { error } = await supabase
      .from('applications')
      .update({ status: newStatus })
      .eq('id', appId);

    if (error) {
      console.error('Failed to update status:', error);
      fetchApplications();
    }
    setDraggedAppId(null);
  }

  function handleOpenModal(app = null, defaultStatus = 'Saved') {
    if (app) {
      setEditingId(app.id);
      setFormData({
        company_name: app.company_name || '',
        role_title: app.role_title || '',
        status: app.status || 'Saved',
        location: app.location || 'Remote',
        job_url: app.job_url || '',
        applied_date: app.applied_date || new Date().toISOString().split('T')[0],
        notes: app.notes || '',
      });
    } else {
      setEditingId(null);
      setFormData({
        company_name: '',
        role_title: '',
        status: defaultStatus,
        location: 'Remote',
        job_url: '',
        applied_date: new Date().toISOString().split('T')[0],
        notes: '',
      });
    }
    setIsModalOpen(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();
    const payload = { ...formData, user_id: user?.id };

    if (editingId) {
      await supabase.from('applications').update(payload).eq('id', editingId);
    } else {
      await supabase.from('applications').insert([payload]);
    }

    setIsModalOpen(false);
    fetchApplications();
  }

  async function handleDelete(id) {
    if (window.confirm('Delete this application?')) {
      await supabase.from('applications').delete().eq('id', id);
      fetchApplications();
    }
  }

  async function handleUpdateNotes(id, notes) {
    await supabase.from('applications').update({ notes }).eq('id', id);
    fetchApplications();
  }

  const filteredApps = applications.filter((app) =>
    app.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.role_title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`min-h-screen ${currentTheme.bg.app} ${darkMode ? 'text-slate-100' : 'text-slate-900'} p-3 sm:p-6 md:p-8 font-sans transition-colors duration-200`}>
      <div className="max-w-[1600px] mx-auto space-y-4 sm:space-y-6">

        {/* Responsive Header Navigation */}
        <div className={`flex flex-col xl:flex-row xl:items-center justify-between gap-4 ${currentTheme.bg.surface} p-4 sm:p-6 rounded-xl shadow-sm border ${currentTheme.border.default}`}>
          <div className="flex items-center justify-between xl:block">
            <div>
              <h1 className={`text-2xl sm:text-3xl font-black ${darkMode ? 'text-white' : 'text-slate-900'} tracking-tight`}>CareerPath</h1>
              <p className={`text-[11px] sm:text-xs mt-0.5 sm:mt-1 font-semibold ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Track and organize job applications seamlessly.</p>
            </div>
            
            {/* Mobile Theme Switcher */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`xl:hidden px-2.5 py-1.5 rounded-lg border text-[11px] font-black transition cursor-pointer ${
                darkMode
                  ? 'bg-slate-800 text-amber-300 border-slate-700'
                  : 'bg-slate-200 text-slate-800 border-slate-300'
              }`}
            >
              {darkMode ? '🌙' : '☀️'}
            </button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            {/* Desktop Theme Switcher */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`hidden xl:block px-3 py-1.5 rounded-lg border text-xs font-black transition cursor-pointer ${
                darkMode
                  ? 'bg-slate-800 text-amber-300 border-slate-700 hover:bg-slate-700'
                  : 'bg-slate-200 text-slate-800 border-slate-300 hover:bg-slate-300'
              }`}
            >
              {darkMode ? '🌙 Dark Mode' : '☀️ Light Mode'}
            </button>

            {/* View Switcher Navigation Bar */}
            <div className={`flex overflow-x-auto ${currentTheme.bg.muted} p-1 rounded-xl border ${currentTheme.border.default} text-xs font-black shadow-inner`}>
              <button
                onClick={() => setViewMode('kanban')}
                className={`px-3 sm:px-3.5 py-1.5 rounded-lg transition-all duration-150 whitespace-nowrap cursor-pointer ${
                  viewMode === 'kanban'
                    ? 'bg-emerald-600 text-white shadow-sm font-extrabold'
                    : darkMode ? 'text-slate-200 hover:text-white' : 'text-slate-800 hover:text-slate-950'
                }`}
              >
                📋 Kanban
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 sm:px-3.5 py-1.5 rounded-lg transition-all duration-150 whitespace-nowrap cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-emerald-600 text-white shadow-sm font-extrabold'
                    : darkMode ? 'text-slate-200 hover:text-white' : 'text-slate-800 hover:text-slate-950'
                }`}
              >
                🗂 Grid
              </button>
              <button
                onClick={() => setViewMode('analytics')}
                className={`px-3 sm:px-3.5 py-1.5 rounded-lg transition-all duration-150 whitespace-nowrap cursor-pointer ${
                  viewMode === 'analytics'
                    ? 'bg-emerald-600 text-white shadow-sm font-extrabold'
                    : darkMode ? 'text-slate-200 hover:text-white' : 'text-slate-800 hover:text-slate-950'
                }`}
              >
                📊 Analytics
              </button>
              <button
                onClick={() => setViewMode('matcher')}
                className={`px-3 sm:px-3.5 py-1.5 rounded-lg transition-all duration-150 whitespace-nowrap cursor-pointer ${
                  viewMode === 'matcher'
                    ? 'bg-emerald-600 text-white shadow-sm font-extrabold'
                    : darkMode ? 'text-slate-200 hover:text-white' : 'text-slate-800 hover:text-slate-950'
                }`}
              >
                🎯 AI Matcher
              </button>
              <button
                onClick={() => setViewMode('interview')}
                className={`px-3 sm:px-3.5 py-1.5 rounded-lg transition-all duration-150 whitespace-nowrap cursor-pointer ${
                  viewMode === 'interview'
                    ? 'bg-emerald-600 text-white shadow-sm font-extrabold'
                    : darkMode ? 'text-slate-200 hover:text-white' : 'text-slate-800 hover:text-slate-950'
                }`}
              >
                🎙️ Interview Prep
              </button>
              <button
                onClick={() => setViewMode('reminders')}
                className={`px-3 sm:px-3.5 py-1.5 rounded-lg transition-all duration-150 whitespace-nowrap cursor-pointer ${
                  viewMode === 'reminders'
                    ? 'bg-emerald-600 text-white shadow-sm font-extrabold'
                    : darkMode ? 'text-slate-200 hover:text-white' : 'text-slate-800 hover:text-slate-950'
                }`}
              >
                ⏰ Follow-ups
              </button>
            </div>

            <button onClick={() => handleOpenModal()} className={`${currentTheme.buttons.primary} w-full sm:w-auto text-center justify-center`}>
              + Add Application
            </button>
          </div>
        </div>

        {/* Search Header */}
        {viewMode !== 'analytics' && viewMode !== 'matcher' && viewMode !== 'interview' && viewMode !== 'reminders' && (
          <div className={`${currentTheme.bg.surface} p-3.5 sm:p-4 rounded-xl border ${currentTheme.border.default} shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3`}>
            <input
              type="text"
              placeholder="Search company or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full sm:max-w-md px-4 py-2 text-sm ${currentTheme.bg.surface} ${darkMode ? 'text-white placeholder-slate-400' : 'text-slate-900 placeholder-slate-500'} border ${currentTheme.border.default} rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 font-semibold`}
            />
            <span className={`text-center text-xs font-black ${darkMode ? 'text-slate-200 bg-slate-800 border-slate-700' : 'text-slate-800 bg-slate-200 border-slate-300'} px-3 py-2 rounded-md border`}>
              Total Applications: {filteredApps.length}
            </span>
          </div>
        )}

        {/* VIEW 1: KANBAN BOARD */}
        {viewMode === 'kanban' && (
          <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-thin scrollbar-thumb-slate-700">
            {theme.statuses.map((status) => {
              const columnApps = filteredApps.filter((a) => a.status === status);

              return (
                <div
                  key={status}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, status)}
                  className={`min-w-[280px] max-w-[320px] flex-1 ${currentTheme.bg.muted} rounded-xl p-3 flex flex-col min-h-[550px] border ${currentTheme.border.default}`}
                >
                  <div className={`flex items-center justify-between px-3 py-2 rounded-lg border text-xs mb-3 shadow-xs ${currentTheme.statusBadges[status]}`}>
                    <span>{status}</span>
                    <span className="bg-slate-950 text-white px-2 py-0.5 rounded-full text-[10px] font-black">
                      {columnApps.length}
                    </span>
                  </div>

                  <div className="space-y-3 flex-1">
                    {columnApps.map((app) => (
                      <div
                        key={app.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, app.id)}
                        className={`${currentTheme.bg.surface} p-4 rounded-xl shadow-sm hover:shadow-md border ${currentTheme.border.default} cursor-grab active:cursor-grabbing transition space-y-2 group`}
                      >
                        <div className="flex justify-between items-start">
                          <h4 className={`font-extrabold text-sm ${darkMode ? 'text-white' : 'text-slate-900'} group-hover:text-emerald-500 transition`}>{app.company_name}</h4>
                          <button onClick={() => handleOpenModal(app)} className={`text-[11px] ${darkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'} font-bold`}>
                            Edit
                          </button>
                        </div>
                        <p className={`text-xs font-bold ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>{app.role_title}</p>

                        <div className={`text-[11px] ${darkMode ? 'text-slate-400' : 'text-slate-600'} space-y-1 pt-2 border-t ${currentTheme.border.subtle} font-semibold`}>
                          <p>📍 {app.location}</p>
                          <p>📅 {app.applied_date || 'No Date'}</p>
                          {app.job_url && (
                            <a href={app.job_url} target="_blank" rel="noreferrer" className="text-emerald-500 hover:underline block truncate font-bold">
                              🔗 View Posting
                            </a>
                          )}
                        </div>

                        <div className="flex justify-end pt-1">
                          <button onClick={() => handleDelete(app.id)} className="text-[11px] text-rose-500 hover:text-rose-400 font-bold">
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}

                    <button
                      onClick={() => handleOpenModal(null, status)}
                      className={`w-full py-2 ${currentTheme.bg.surface} border ${currentTheme.border.dashed} ${darkMode ? 'text-slate-300 hover:text-white' : 'text-slate-700 hover:text-slate-900'} rounded-lg text-xs font-extrabold transition shadow-xs cursor-pointer`}
                    >
                      + Add Card
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* VIEW 2: GRID VIEW */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredApps.map((app) => (
              <div key={app.id} className={`${currentTheme.bg.surface} p-5 rounded-xl border ${currentTheme.border.default} shadow-sm space-y-3`}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className={`font-extrabold ${darkMode ? 'text-white' : 'text-slate-900'} text-lg`}>{app.company_name}</h3>
                    <p className={`text-sm font-bold ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>{app.role_title}</p>
                  </div>
                  <span className={`px-3 py-1 text-xs rounded-full border ${currentTheme.statusBadges[app.status]}`}>
                    {app.status}
                  </span>
                </div>
                <div className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-600'} space-y-1 font-semibold`}>
                  <p>📍 Location: {app.location}</p>
                  <p>📅 Applied: {app.applied_date}</p>
                </div>
                <div className={`flex justify-end gap-3 pt-3 border-t ${currentTheme.border.subtle} font-bold`}>
                  <button onClick={() => handleOpenModal(app)} className={`text-xs ${darkMode ? 'text-slate-300 hover:text-white' : 'text-slate-700 hover:text-slate-950'}`}>Edit</button>
                  <button onClick={() => handleDelete(app.id)} className="text-xs text-rose-500 hover:text-rose-400">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* VIEW 3: ANALYTICS DASHBOARD */}
        {viewMode === 'analytics' && (
          <AnalyticsDashboard applications={applications} darkMode={darkMode} />
        )}

        {/* VIEW 4: AI RESUME MATCHER */}
        {viewMode === 'matcher' && (
          <ResumeMatcher darkMode={darkMode} />
        )}

        {/* VIEW 5: INTERVIEW PREP HUB */}
        {viewMode === 'interview' && (
          <InterviewHub
            applications={applications}
            onUpdateNotes={handleUpdateNotes}
            darkMode={darkMode}
          />
        )}

        {/* VIEW 6: FOLLOW-UP REMINDERS */}
        {viewMode === 'reminders' && (
          <FollowUpGenerator
            applications={applications}
            darkMode={darkMode}
          />
        )}

        {/* Application Modal */}
        {isModalOpen && (
          <div className={`fixed inset-0 ${currentTheme.bg.overlay} flex items-center justify-center p-3 sm:p-4 z-50 overflow-y-auto`}>
            <div className={`${currentTheme.bg.surface} rounded-xl shadow-2xl max-w-lg w-full p-5 sm:p-6 space-y-4 border ${currentTheme.border.default} my-auto`}>
              <h2 className={`text-lg sm:text-xl font-black ${darkMode ? 'text-white' : 'text-slate-900'} border-b ${currentTheme.border.subtle} pb-2`}>
                {editingId ? 'Edit Application' : 'Add Application'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className={`block text-xs font-extrabold ${darkMode ? 'text-slate-200' : 'text-slate-800'} mb-1`}>Company *</label>
                    <input
                      required
                      type="text"
                      value={formData.company_name}
                      onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                      className={`w-full px-3 py-2 ${currentTheme.bg.surface} ${darkMode ? 'text-white' : 'text-slate-900'} border ${currentTheme.border.default} rounded-lg text-sm font-bold focus:ring-2 focus:ring-emerald-600`}
                    />
                  </div>
                  <div>
                    <label className={`block text-xs font-extrabold ${darkMode ? 'text-slate-200' : 'text-slate-800'} mb-1`}>Role Title *</label>
                    <input
                      required
                      type="text"
                      value={formData.role_title}
                      onChange={(e) => setFormData({ ...formData, role_title: e.target.value })}
                      className={`w-full px-3 py-2 ${currentTheme.bg.surface} ${darkMode ? 'text-white' : 'text-slate-900'} border ${currentTheme.border.default} rounded-lg text-sm font-bold focus:ring-2 focus:ring-emerald-600`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className={`block text-xs font-extrabold ${darkMode ? 'text-slate-200' : 'text-slate-800'} mb-1`}>Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className={`w-full px-3 py-2 ${currentTheme.bg.surface} ${darkMode ? 'text-white bg-slate-900' : 'text-slate-900 bg-white'} border ${currentTheme.border.default} rounded-lg text-sm font-bold focus:ring-2 focus:ring-emerald-600`}
                    >
                      {theme.statuses.map((st) => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={`block text-xs font-extrabold ${darkMode ? 'text-slate-200' : 'text-slate-800'} mb-1`}>Location</label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className={`w-full px-3 py-2 ${currentTheme.bg.surface} ${darkMode ? 'text-white' : 'text-slate-900'} border ${currentTheme.border.default} rounded-lg text-sm font-bold focus:ring-2 focus:ring-emerald-600`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className={`block text-xs font-extrabold ${darkMode ? 'text-slate-200' : 'text-slate-800'} mb-1`}>Applied Date</label>
                    <input
                      type="date"
                      value={formData.applied_date}
                      onChange={(e) => setFormData({ ...formData, applied_date: e.target.value })}
                      className={`w-full px-3 py-2 ${currentTheme.bg.surface} ${darkMode ? 'text-white' : 'text-slate-900'} border ${currentTheme.border.default} rounded-lg text-sm font-bold focus:ring-2 focus:ring-emerald-600`}
                    />
                  </div>
                  <div>
                    <label className={`block text-xs font-extrabold ${darkMode ? 'text-slate-200' : 'text-slate-800'} mb-1`}>Job Link</label>
                    <input
                      type="url"
                      value={formData.job_url}
                      onChange={(e) => setFormData({ ...formData, job_url: e.target.value })}
                      className={`w-full px-3 py-2 ${currentTheme.bg.surface} ${darkMode ? 'text-white' : 'text-slate-900'} border ${currentTheme.border.default} rounded-lg text-sm font-bold focus:ring-2 focus:ring-emerald-600`}
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-xs font-extrabold ${darkMode ? 'text-slate-200' : 'text-slate-800'} mb-1`}>Notes</label>
                  <textarea
                    rows="3"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className={`w-full px-3 py-2 ${currentTheme.bg.surface} ${darkMode ? 'text-white' : 'text-slate-900'} border ${currentTheme.border.default} rounded-lg text-sm font-bold focus:ring-2 focus:ring-emerald-600`}
                  ></textarea>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className={currentTheme.buttons.secondary}
                  >
                    Cancel
                  </button>
                  <button type="submit" className={currentTheme.buttons.primary}>
                    {editingId ? 'Save' : 'Add Application'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}