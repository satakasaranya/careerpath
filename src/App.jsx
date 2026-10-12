import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import Auth from './Auth'

export default function App() {
  const [session, setSession] = useState(null)
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)

  const [companyName, setCompanyName] = useState('')
  const [roleTitle, setRoleTitle] = useState('')
  const [status, setStatus] = useState('Applied')

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (session) fetchApplications()
  }, [session])

  async function fetchApplications() {
    setLoading(true)
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error) setApplications(data || [])
    setLoading(false)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!companyName.trim() || !roleTitle.trim()) return

    const { data, error } = await supabase
      .from('applications')
      .insert([{ 
        company_name: companyName, 
        role_title: roleTitle, 
        status,
        user_id: session.user.id
      }])
      .select()

    if (!error && data) {
      setApplications([data[0], ...applications])
      setCompanyName('')
      setRoleTitle('')
      setStatus('Applied')
    }
  }

  async function handleStatusChange(id, newStatus) {
    const { error } = await supabase
      .from('applications')
      .update({ status: newStatus })
      .eq('id', id)

    if (!error) {
      setApplications(applications.map(app => app.id === id ? { ...app, status: newStatus } : app))
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this entry?')) return
    const { error } = await supabase.from('applications').delete().eq('id', id)
    if (!error) {
      setApplications(applications.filter(app => app.id !== id))
    }
  }

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Wishlist':
        return 'bg-purple-950/60 text-purple-300 border-purple-800'
      case 'Applied':
        return 'bg-emerald-950/60 text-emerald-300 border-emerald-800'
      case 'Interviewing':
        return 'bg-amber-950/60 text-amber-300 border-amber-800'
      case 'Offered':
        return 'bg-teal-950/60 text-teal-300 border-teal-800'
      case 'Rejected':
        return 'bg-rose-950/60 text-rose-300 border-rose-800'
      default:
        return 'bg-stone-800 text-stone-300 border-stone-700'
    }
  }

  if (!session) return <Auth />

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 py-10 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <header className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-6">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 shadow-md shadow-emerald-500/30"></div>
              <h1 className="text-2xl font-bold text-white tracking-tight">CareerPath Tracker</h1>
            </div>
            <p className="text-stone-400 text-xs mt-1">Logged in as: <span className="text-stone-200 font-medium">{session.user.email}</span></p>
          </div>
          <button
            onClick={() => supabase.auth.signOut()}
            className="self-start sm:self-auto text-xs bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700 px-3.5 py-2 rounded-xl transition font-medium"
          >
            Sign Out
          </button>
        </header>

        {/* Input Form */}
        <div className="bg-stone-900 rounded-2xl border border-stone-800 p-6 mb-8 shadow-lg">
          <h2 className="text-base font-semibold text-white mb-4">Add New Application</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Company Name (e.g. Google)"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-sm text-white placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
              <input
                type="text"
                placeholder="Role Title (e.g. SDE Intern)"
                value={roleTitle}
                onChange={(e) => setRoleTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-sm text-white placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="Wishlist">Wishlist</option>
              <option value="Applied">Applied</option>
              <option value="Interviewing">Interviewing</option>
              <option value="Offered">Offered</option>
              <option value="Rejected">Rejected</option>
            </select>
            <button
              type="submit"
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm rounded-xl shadow-md transition active:scale-95"
            >
              Save Application
            </button>
          </form>
        </div>

        {/* Applications List */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-white">My Applications</h2>
            <span className="bg-stone-800 text-stone-300 text-xs font-bold px-3 py-1 rounded-full border border-stone-700">
              {applications.length}
            </span>
          </div>

          {loading ? (
            <div className="text-center py-12 text-stone-500 text-sm">Loading applications...</div>
          ) : applications.length === 0 ? (
            <div className="bg-stone-900 rounded-2xl border border-dashed border-stone-800 p-8 text-center text-stone-500 text-sm">
              No applications recorded yet. Fill out the form above to get started!
            </div>
          ) : (
            <div className="space-y-3">
              {applications.map((app) => (
                <div key={app.id} className="bg-stone-900 rounded-xl border border-stone-800 p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-stone-700 transition">
                  <div>
                    <h3 className="font-semibold text-white text-base">{app.company_name}</h3>
                    <p className="text-xs text-stone-400 mt-0.5">{app.role_title}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <select
                      value={app.status}
                      onChange={(e) => handleStatusChange(app.id, e.target.value)}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-lg border focus:outline-none transition cursor-pointer ${getStatusStyle(app.status)}`}
                    >
                      <option value="Wishlist" className="bg-stone-900 text-stone-100">Wishlist</option>
                      <option value="Applied" className="bg-stone-900 text-stone-100">Applied</option>
                      <option value="Interviewing" className="bg-stone-900 text-stone-100">Interviewing</option>
                      <option value="Offered" className="bg-stone-900 text-stone-100">Offered</option>
                      <option value="Rejected" className="bg-stone-900 text-stone-100">Rejected</option>
                    </select>
                    <button
                      onClick={() => handleDelete(app.id)}
                      className="text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 px-2.5 py-1.5 rounded-lg border border-transparent hover:border-rose-900/50 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}