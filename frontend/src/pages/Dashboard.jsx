import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { Link } from 'react-router-dom';
import { 
  Github, Code2, TerminalSquare, Linkedin, 
  Activity, Clock, ChevronRight, CheckCircle2 
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, BarChart, Bar 
} from 'recharts';

const StatCard = ({ title, value, icon, color }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-[var(--color-warmbeige)] hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-semibold text-[var(--color-steelblue)] mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-[var(--color-darkslate)]">{value}</h3>
      </div>
      <div className="p-4 rounded-xl text-white" style={{ backgroundColor: color }}>
        {icon}
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardInfo = async () => {
      setLoading(true);
      try {
        const [dashRes, todoRes] = await Promise.all([
          api.get('/user/dashboard'),
          api.get('/todos')
        ]);
        setDashboardData(dashRes.data);
        setTodos(todoRes.data.slice(0, 5));
      } catch (error) {
        console.error('Error fetching dashboard info', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardInfo();
  }, [user?.stats?.score]); // ✅ score change hone par dashboard refresh hoga

  if (loading) {
    return (
      <div className="animate-pulse bg-white/50 h-[80vh] rounded-xl flex items-center justify-center text-[var(--color-steelblue)]">
        Loading dashboard...
      </div>
    );
  }

  const stats = dashboardData?.stats || user?.stats || {};
  const chartData = dashboardData?.chartData || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--color-darkslate)]">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-[var(--color-steelblue)] mt-2">Here is a summary of your developer activity.</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-[var(--color-warmbeige)] flex items-center gap-2">
          <span className="text-sm font-bold text-[var(--color-darkslate)]">Rank Score:</span>
          <span className="text-lg font-black text-[var(--color-steelblue)]">{stats.score || 0}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title="GitHub Commits" value={stats.githubCommits || 0} icon={<Github size={24} />} color="#24292e" />
        <StatCard title="LeetCode Solved" value={stats.leetcodeSolved || 0} icon={<Code2 size={24} />} color="#f89f1b" />
        <StatCard title="HackerRank Progress" value={stats.hackerrankProgress || 0} icon={<TerminalSquare size={24} />} color="#00ea64" />
        <StatCard title="LinkedIn Posts" value={stats.linkedinPosts || 0} icon={<Linkedin size={24} />} color="#0a66c2" />
        <StatCard title="Coding Streak" value={`${stats.streak || 0} Days`} icon={<Activity size={24} />} color="#ff4757" />
        <StatCard
          title="Last Activity"
          value={stats.lastActivityTime ? new Date(stats.lastActivityTime).toLocaleDateString() : 'N/A'}
          icon={<Clock size={24} />}
          color="#7AA7C7"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">

          {/* ✅ Fixed: chart container explicit height with block display */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-[var(--color-warmbeige)]">
            <h3 className="text-lg font-bold text-[var(--color-darkslate)] mb-6">Weekly Activity Graph</h3>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E9E6DF" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#7AA7C7' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#7AA7C7' }} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Line type="monotone" dataKey="commits" stroke="#24292e" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="problems" stroke="#f89f1b" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-[var(--color-warmbeige)]">
            <h3 className="text-lg font-bold text-[var(--color-darkslate)] mb-6">Coding Progress Chart</h3>
            <div style={{ width: '100%', height: 200 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E9E6DF" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#7AA7C7' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#7AA7C7' }} />
                  <Tooltip cursor={{ fill: '#f3f4f6' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Bar dataKey="commits" fill="#7AA7C7" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Todo Preview */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-[var(--color-warmbeige)] flex flex-col h-full">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-[var(--color-darkslate)]">Todo Preview</h3>
            <Link to="/todo" className="p-1 rounded bg-[var(--color-lightsky)] text-[var(--color-steelblue)] hover:bg-[var(--color-softblue)] hover:text-white transition-colors">
              <ChevronRight size={20} />
            </Link>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pr-2">
            {todos.length === 0 ? (
              <p className="text-sm text-[var(--color-steelblue)] text-center py-8">No tasks yet. Create one!</p>
            ) : (
              todos.map(todo => (
                <div key={todo._id} className="flex items-start gap-3 p-3 rounded-lg border border-[var(--color-warmbeige)] bg-gray-50/50">
                  <CheckCircle2
                    size={18}
                    className={`shrink-0 mt-0.5 ${todo.completed ? 'text-green-500' : 'text-gray-300'}`}
                  />
                  <p className={`text-sm ${todo.completed ? 'text-gray-400 line-through' : 'text-[var(--color-darkslate)] font-medium'}`}>
                    {todo.task}
                  </p>
                </div>
              ))
            )}
          </div>

          <Link to="/todo" className="mt-4 w-full bg-[var(--color-lightsky)] hover:bg-[var(--color-softblue)] hover:text-white text-[var(--color-steelblue)] font-semibold py-3 px-4 rounded-xl transition-colors text-center text-sm">
            Manage All Tasks
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;