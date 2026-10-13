import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
} from 'recharts';
import { theme } from '../theme';

const STATUS_COLORS = {
  Saved: '#94a3b8',
  Applied: '#3b82f6',
  Assessment: '#a855f7',
  Interview: '#f59e0b',
  Offer: '#10b981',
  Rejected: '#f43f5e',
};

export default function AnalyticsDashboard({ applications, darkMode = true }) {
  const currentTheme = darkMode ? theme.dark : theme.light;
  const total = applications.length;

  const stageCounts = theme.statuses.reduce((acc, status) => {
    acc[status] = applications.filter((app) => app.status === status).length;
    return acc;
  }, {});

  const barData = theme.statuses.map((status) => ({
    status,
    count: stageCounts[status] || 0,
    color: STATUS_COLORS[status],
  }));

  const appliedCount = stageCounts['Applied'] || 0;
  const interviewCount = stageCounts['Interview'] || 0;
  const offerCount = stageCounts['Offer'] || 0;

  const interviewRate = appliedCount > 0 ? ((interviewCount / appliedCount) * 100).toFixed(1) : 0;
  const offerRate = interviewCount > 0 ? ((offerCount / interviewCount) * 100).toFixed(1) : 0;
  const overallSuccessRate = total > 0 ? ((offerCount / total) * 100).toFixed(1) : 0;

  const activeCount = (stageCounts['Applied'] || 0) + (stageCounts['Assessment'] || 0) + (stageCounts['Interview'] || 0);
  const pieData = [
    { name: 'Active Pipeline', value: activeCount, color: '#10b981' },
    { name: 'Saved / Backlog', value: stageCounts['Saved'] || 0, color: '#64748b' },
    { name: 'Offers Received', value: offerCount, color: '#a855f7' },
    { name: 'Rejected', value: stageCounts['Rejected'] || 0, color: '#f43f5e' },
  ].filter((item) => item.value > 0);

  const axisTextColor = darkMode ? '#f1f5f9' : '#0f172a';
  const cardBg = darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-300';

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className={`${cardBg} p-5 rounded-xl border shadow-sm`}>
          <p className={`text-xs font-extrabold uppercase tracking-wider ${currentTheme.text.muted}`}>Total Applications</p>
          <p className={`text-3xl font-black mt-2 ${currentTheme.text.primary}`}>{total}</p>
        </div>

        <div className={`${cardBg} p-5 rounded-xl border shadow-sm`}>
          <p className={`text-xs font-extrabold uppercase tracking-wider ${currentTheme.text.muted}`}>Interview Conversion Rate</p>
          <p className="text-3xl font-black text-amber-500 mt-2">{interviewRate}%</p>
          <p className={`text-[11px] font-semibold mt-1 ${currentTheme.text.muted}`}>Applied → Interview stage</p>
        </div>

        <div className={`${cardBg} p-5 rounded-xl border shadow-sm`}>
          <p className={`text-xs font-extrabold uppercase tracking-wider ${currentTheme.text.muted}`}>Offer Win Rate</p>
          <p className="text-3xl font-black text-emerald-500 mt-2">{offerRate}%</p>
          <p className={`text-[11px] font-semibold mt-1 ${currentTheme.text.muted}`}>Interview → Final Offer</p>
        </div>

        <div className={`${cardBg} p-5 rounded-xl border shadow-sm`}>
          <p className={`text-xs font-extrabold uppercase tracking-wider ${currentTheme.text.muted}`}>Overall Success Rate</p>
          <p className="text-3xl font-black text-indigo-400 mt-2">{overallSuccessRate}%</p>
          <p className={`text-[11px] font-semibold mt-1 ${currentTheme.text.muted}`}>Total → Offers received</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={`lg:col-span-2 ${cardBg} p-6 rounded-xl border shadow-sm space-y-4`}>
          <div className="flex justify-between items-center">
            <h3 className={`text-lg font-black ${currentTheme.text.primary}`}>Application Pipeline Funnel</h3>
            <span className={`text-xs font-bold ${currentTheme.text.muted}`}>Applications by Status</span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="status" tick={{ fill: axisTextColor, fontSize: 12, fontWeight: 700 }} />
                <YAxis allowDecimals={false} tick={{ fill: axisTextColor, fontSize: 12, fontWeight: 700 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: darkMode ? '#0f172a' : '#ffffff',
                    borderRadius: '8px',
                    borderColor: darkMode ? '#334155' : '#cbd5e1',
                    color: axisTextColor,
                    fontWeight: 700,
                  }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {barData.map((entry) => (
                    <Cell key={entry.status} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={`${cardBg} p-6 rounded-xl border shadow-sm space-y-4`}>
          <h3 className={`text-lg font-black ${currentTheme.text.primary}`}>Pipeline Breakdown</h3>

          {pieData.length === 0 ? (
            <p className={`text-sm font-semibold text-center py-20 ${currentTheme.text.muted}`}>No application data available yet.</p>
          ) : (
            <div className="h-72 w-full flex flex-col items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: darkMode ? '#0f172a' : '#ffffff',
                      borderRadius: '8px',
                      borderColor: darkMode ? '#334155' : '#cbd5e1',
                      color: axisTextColor,
                      fontWeight: 700,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>

              <div className="grid grid-cols-2 gap-2 text-xs font-bold w-full pt-2">
                {pieData.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></span>
                    <span className={`${currentTheme.text.secondary} truncate`}>{item.name}: {item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}