import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { Link } from 'react-router-dom';
import { 
  Github, Code2, TerminalSquare, Linkedin, 
  Activity, Clock, ChevronRight, CheckCircle2, 
  Trophy, Medal, Flame, Sparkles, CheckSquare
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, BarChart, Bar 
} from 'recharts';

const StatCard = ({ title, value, subtitle, icon, color, gradient }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-[var(--color-warmbeige)] hover:shadow-lg transition-all duration-300 hover:-translate-y-1 relative overflow-hidden group">
    <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${gradient} opacity-10 rounded-bl-full group-hover:scale-150 transition-transform duration-500`} />
    <div className="flex items-start justify-between relative z-10">
      <div>
        <p className="text-sm font-semibold text-gray-500 tracking-wide uppercase">{title}</p>
        <h3 className="text-3xl font-black text-[var(--color-darkslate)] mt-1 tracking-tight">{value}</h3>
        {subtitle && <p className="text-xs text-[var(--color-steelblue)] mt-2 font-medium">{subtitle}</p>}
      </div>
      <div className="p-4 rounded-xl text-white shadow-sm" style={{ backgroundColor: color }}>
        {icon}
      </div>
    </div>
  </div>
);

// Leaderboard Rank Logic
const getLeaderboardBadge = (pos) => {
  if (pos === 1) return { name: "Rank #1", title: "Gold Tier", color: "text-yellow-600", bg: "bg-yellow-100", border: "border-yellow-300", icon: <Trophy size={28} className="text-yellow-600" /> };
  if (pos === 2) return { name: "Rank #2", title: "Silver Tier", color: "text-gray-500", bg: "bg-gray-100", border: "border-gray-300", icon: <Medal size={28} className="text-gray-500" /> };
  if (pos === 3) return { name: "Rank #3", title: "Bronze Tier", color: "text-[#cd7f32]", bg: "bg-orange-50", border: "border-[#cd7f32]/30", icon: <Medal size={28} className="text-[#cd7f32]" /> };
  if (pos > 0) return { name: `Rank #${pos}`, title: "Global Rank", color: "text-[var(--color-steelblue)]", bg: "bg-[var(--color-lightsky)]/50", border: "border-[var(--color-softblue)]", icon: <Medal size={28} className="text-[var(--color-steelblue)]" /> };
  return { name: "Unranked", title: "Start Coding", color: "text-gray-400", bg: "bg-gray-50", border: "border-gray-200", icon: <Medal size={28} className="text-gray-400" /> };
};

const Dashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Custom Live Timing Logic
  const [time, setTime] = useState(new Date());
  const [sessionTime, setSessionTime] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
      setSessionTime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatSessionTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h > 0 ? h + 'h ' : ''}${m}m ${s}s`;
  };

  useEffect(() => {
    const fetchDashboardInfo = async () => {
      setLoading(true);
      try {
        const [dashRes, todoRes] = await Promise.all([
          api.get('/user/dashboard'),
          api.get('/todos')
        ]);
        setDashboardData(dashRes.data);
        setTodos(todoRes.data.slice(0, 4));
      } catch (error) {
        console.error('Error fetching dashboard info', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardInfo();
  }, [user?.stats?.score]); 

  if (loading) {
    return (
      <div className="animate-pulse flex flex-col gap-6 h-[80vh]">
         <div className="h-40 bg-white/60 rounded-3xl w-full"></div>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="h-32 bg-white/60 rounded-2xl w-full"></div>
            <div className="h-32 bg-white/60 rounded-2xl w-full"></div>
            <div className="h-32 bg-white/60 rounded-2xl w-full"></div>
         </div>
      </div>
    );
  }

  const stats = dashboardData?.stats || user?.stats || {};
  const chartData = dashboardData?.chartData || [];
  const rankPosition = dashboardData?.rankPosition || 0;
  const badge = getLeaderboardBadge(rankPosition);

  return (
    <div className="space-y-8 pb-10">
      
      {/* 🚀 Hero Section with Rank & Live Timer */}
      <div className="relative bg-gradient-to-br from-[var(--color-darkslate)] to-[#1a1d24] rounded-3xl shadow-xl overflow-hidden text-white border border-[var(--color-darkslate)]">
        {/* Abstract Background Design */}
        <div className="absolute -top-24 -right-10 w-96 h-96 bg-[var(--color-softblue)] opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 left-10 w-72 h-72 bg-[var(--color-steelblue)] opacity-20 rounded-full blur-3xl"></div>

        <div className="relative z-10 p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex-1 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-sm font-medium mb-6">
               <Clock size={16} className="text-blue-300" />
               <span className="tracking-widest">{time.toLocaleTimeString()} | {time.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-3 tracking-tight">
              Welcome back, <span className="text-[var(--color-softblue)]">{user?.name}!</span>
            </h1>
            <p className="text-lg text-gray-400 font-medium mb-4">Keep pushing your limits. Your current active session is <span className="text-white font-bold">{formatSessionTime(sessionTime)}</span></p>
            
            <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-[var(--color-steelblue)]/20 text-blue-200 rounded-xl border border-[var(--color-steelblue)]/30 backdrop-blur-sm">
               <Flame size={20} className="text-orange-400" />
               <span className="font-bold text-lg tracking-wide">DevTrack Streak: <span className="text-white">{stats.streak || 0} Days</span></span>
            </div>
          </div>

          {/* Rank Badge Indicator */}
          <div className={`shrink-0 flex flex-col items-center justify-center p-6 rounded-2xl border-2 ${badge.bg} ${badge.border} shadow-[0_0_30px_rgba(0,0,0,0.3)] min-w-[200px] backdrop-blur-md bg-opacity-90 transform transition hover:scale-105`}>
            <div className="bg-white p-3 rounded-full shadow-inner mb-3">
              {badge.icon}
            </div>
            <h2 className={`text-2xl font-black uppercase tracking-widest ${badge.color}`}>{badge.name}</h2>
            <p className="text-sm font-bold text-gray-600 mt-1 uppercase tracking-wide">{badge.title}</p>
            <p className="text-xs font-bold text-gray-400 mt-1">Score: {stats.score || 0}</p>
          </div>
        </div>
      </div>

      {/* 📊 Global Platform Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard 
          title="GitHub Commits" 
          value={stats.githubCommits || 0} 
          subtitle="Total Contributions"
          icon={<Github size={24} />} 
          color="#24292e" 
          gradient="from-gray-500 to-gray-900"
        />
        <StatCard 
          title="GitHub Repos" 
          value={stats.githubRepos || 0} 
          subtitle="Public Repositories"
          icon={<Github size={24} />} 
          color="#2b3137" 
          gradient="from-gray-600 to-gray-800"
        />
        <StatCard 
          title="LeetCode" 
          value={stats.leetcodeSolved || 0} 
          subtitle="Problems Solved"
          icon={<Code2 size={24} />} 
          color="#f89f1b" 
          gradient="from-yellow-400 to-orange-500"
        />
        <StatCard 
          title="HackerRank" 
          value={stats.hackerrankSolved || 0} 
          subtitle="Challenges Won"
          icon={<TerminalSquare size={24} />} 
          color="#00ea64" 
          gradient="from-green-400 to-emerald-600"
        />
        <StatCard 
          title="CodeChef" 
          value={stats.codechefSolved || 0} 
          subtitle="Questions Done"
          icon={<TerminalSquare size={24} />} 
          color="#8B5A2B" 
          gradient="from-yellow-700 to-red-900"
        />
        <StatCard 
          title="LinkedIn" 
          value={stats.linkedinPosts || 0} 
          subtitle="Network Posts"
          icon={<Linkedin size={24} />} 
          color="#0a66c2" 
          gradient="from-blue-400 to-blue-700"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">

          {/* 📈 Enhanced Activity Graph */}
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-[var(--color-warmbeige)] hover:border-[var(--color-softblue)]/50 transition-colors">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-extrabold text-[var(--color-darkslate)] flex items-center gap-2">
                 <Activity className="text-[var(--color-steelblue)]" /> Activity Flow (Last 7 Days)
              </h3>
            </div>
            
            <div style={{ width: '100%', height: 320 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorCommits" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7AA7C7" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#7AA7C7" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E9E6DF" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#7AA7C7', fontSize: 13, fontWeight: 600 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#7AA7C7', fontWeight: 500 }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: '1px solid #E9E6DF', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} 
                    itemStyle={{ fontWeight: 600 }}
                  />
                  <Area type="monotone" dataKey="commits" stroke="#7AA7C7" strokeWidth={3} fillOpacity={1} fill="url(#colorCommits)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-[var(--color-warmbeige)]">
            <h3 className="text-xl font-extrabold text-[var(--color-darkslate)] mb-6">Execution Consistency</h3>
            <div style={{ width: '100%', height: 220 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E9E6DF" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#7AA7C7', fontWeight: 600 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#7AA7C7', fontWeight: 500 }} />
                  <Tooltip cursor={{ fill: '#f3f4f6' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Bar dataKey="commits" fill="#2A2F36" radius={[6, 6, 0, 0]} maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* ✨ Enhanced Todo / Focus Panel */}
        <div className="space-y-6">
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-[var(--color-warmbeige)] flex flex-col h-full relative overflow-hidden">
            
            <div className="flex items-center justify-between mb-8 relative z-10">
              <div>
                <h3 className="text-xl font-extrabold text-[var(--color-darkslate)]">Focus List</h3>
                <p className="text-xs text-gray-400 font-medium tracking-wide uppercase mt-1">Pending Objectives</p>
              </div>
              <Link to="/todo" className="p-2 rounded-xl bg-[var(--color-lightsky)] text-[var(--color-steelblue)] hover:bg-[var(--color-softblue)] hover:text-white transition-all hover:scale-110">
                <ChevronRight size={24} />
              </Link>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-2 relative z-10">
              {todos.length === 0 ? (
                <div className="text-center py-12 px-4">
                   <div className="w-16 h-16 bg-[var(--color-lightsky)] rounded-full flex items-center justify-center mx-auto mb-4 text-[var(--color-steelblue)]">
                     <CheckCircle2 size={32} />
                   </div>
                   <p className="text-[var(--color-darkslate)] font-bold text-lg">All caught up!</p>
                   <p className="text-sm text-[var(--color-steelblue)] mt-1">You have no tasks pending.</p>
                </div>
              ) : (
                todos.map((todo, idx) => (
                  <div key={todo._id} className="group flex items-start gap-4 p-4 rounded-xl border border-[var(--color-warmbeige)] bg-gradient-to-r hover:from-[var(--color-lightsky)]/30 hover:to-transparent transition-all cursor-pointer">
                    <div className="mt-0.5">
                      <CheckCircle2
                        size={22}
                        className={`transition-colors ${todo.completed ? 'text-green-500' : 'text-gray-300 group-hover:text-[var(--color-softblue)]'}`}
                      />
                    </div>
                    <div>
                      <p className={`text-base font-semibold transition-all ${todo.completed ? 'text-gray-400 line-through' : 'text-[var(--color-darkslate)]'}`}>
                        {todo.task}
                      </p>
                      <p className="text-xs text-gray-400 mt-1 font-medium">Goal #{idx+1}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <Link to="/todo" className="mt-8 w-full bg-gradient-to-r from-[var(--color-steelblue)] to-[var(--color-darkslate)] hover:from-[var(--color-softblue)] hover:to-[var(--color-steelblue)] text-white font-bold py-4 px-4 rounded-xl transition-all shadow-md text-center text-sm tracking-wide uppercase relative z-10 flex items-center justify-center gap-2">
              <span>Manage Your Goals</span>
              <ChevronRight size={18} />
            </Link>

            {/* Background Icon */}
            <div className="absolute -bottom-10 -right-10 text-[var(--color-warmbeige)] opacity-50 z-0">
               <CheckSquare size={200} strokeWidth={1} />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;