// import { useState, useEffect } from 'react';
// import { useAuth } from '../context/AuthContext';
// import api from '../api/axios';
// import { Link } from 'react-router-dom';
// import { 
//   Github, Code2, TerminalSquare, Linkedin, 
//   Activity, Clock, ChevronRight, CheckCircle2, 
//   Trophy, Medal, Flame, Sparkles, CheckSquare
// } from 'lucide-react';
// import { 
//   AreaChart, Area, XAxis, YAxis, CartesianGrid, 
//   Tooltip, ResponsiveContainer, BarChart, Bar 
// } from 'recharts';

// const StatCard = ({ title, value, subtitle, icon, color, gradient }) => (
//   <div className="bg-white p-6 rounded-2xl shadow-sm border border-[var(--color-warmbeige)] hover:shadow-lg transition-all duration-300 hover:-translate-y-1 relative overflow-hidden group">
//     <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${gradient} opacity-10 rounded-bl-full group-hover:scale-150 transition-transform duration-500`} />
//     <div className="flex items-start justify-between relative z-10">
//       <div>
//         <p className="text-sm font-semibold text-gray-500 tracking-wide uppercase">{title}</p>
//         <h3 className="text-3xl font-black text-[var(--color-darkslate)] mt-1 tracking-tight">{value}</h3>
//         {subtitle && <p className="text-xs text-[var(--color-steelblue)] mt-2 font-medium">{subtitle}</p>}
//       </div>
//       <div className="p-4 rounded-xl text-white shadow-sm" style={{ backgroundColor: color }}>
//         {icon}
//       </div>
//     </div>
//   </div>
// );

// // Leaderboard Rank Logic
// const getLeaderboardBadge = (pos) => {
//   if (pos === 1) return { name: "Rank #1", title: "Gold Tier", color: "text-yellow-600", bg: "bg-yellow-100", border: "border-yellow-300", icon: <Trophy size={28} className="text-yellow-600" /> };
//   if (pos === 2) return { name: "Rank #2", title: "Silver Tier", color: "text-gray-500", bg: "bg-gray-100", border: "border-gray-300", icon: <Medal size={28} className="text-gray-500" /> };
//   if (pos === 3) return { name: "Rank #3", title: "Bronze Tier", color: "text-[#cd7f32]", bg: "bg-orange-50", border: "border-[#cd7f32]/30", icon: <Medal size={28} className="text-[#cd7f32]" /> };
//   if (pos > 0) return { name: `Rank #${pos}`, title: "Global Rank", color: "text-[var(--color-steelblue)]", bg: "bg-[var(--color-lightsky)]/50", border: "border-[var(--color-softblue)]", icon: <Medal size={28} className="text-[var(--color-steelblue)]" /> };
//   return { name: "Unranked", title: "Start Coding", color: "text-gray-400", bg: "bg-gray-50", border: "border-gray-200", icon: <Medal size={28} className="text-gray-400" /> };
// };

// const Dashboard = () => {
//   const { user } = useAuth();
//   const [dashboardData, setDashboardData] = useState(null);
//   const [todos, setTodos] = useState([]);
//   const [loading, setLoading] = useState(true);
  
//   // Custom Live Timing Logic
//   const [time, setTime] = useState(new Date());
//   const [sessionTime, setSessionTime] = useState(0);

//   useEffect(() => {
//     const timer = setInterval(() => {
//       setTime(new Date());
//       setSessionTime(prev => prev + 1);
//     }, 1000);
//     return () => clearInterval(timer);
//   }, []);

//   const formatSessionTime = (seconds) => {
//     const h = Math.floor(seconds / 3600);
//     const m = Math.floor((seconds % 3600) / 60);
//     const s = seconds % 60;
//     return `${h > 0 ? h + 'h ' : ''}${m}m ${s}s`;
//   };

//   useEffect(() => {
//     const fetchDashboardInfo = async () => {
//       setLoading(true);
//       try {
//         const [dashRes, todoRes] = await Promise.all([
//           api.get('/user/dashboard'),
//           api.get('/todos')
//         ]);
//         setDashboardData(dashRes.data);
//         setTodos(todoRes.data.slice(0, 4));
//       } catch (error) {
//         console.error('Error fetching dashboard info', error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchDashboardInfo();
//   }, [user?.stats?.score]); 

//   if (loading) {
//     return (
//       <div className="animate-pulse flex flex-col gap-6 h-[80vh]">
//          <div className="h-40 bg-white/60 rounded-3xl w-full"></div>
//          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             <div className="h-32 bg-white/60 rounded-2xl w-full"></div>
//             <div className="h-32 bg-white/60 rounded-2xl w-full"></div>
//             <div className="h-32 bg-white/60 rounded-2xl w-full"></div>
//          </div>
//       </div>
//     );
//   }

//   const stats = dashboardData?.stats || user?.stats || {};
//   const chartData = dashboardData?.chartData || [];
//   const rankPosition = dashboardData?.rankPosition || 0;
//   const badge = getLeaderboardBadge(rankPosition);

//   return (
//     <div className="space-y-8 pb-10">
      
//       {/* 🚀 Hero Section with Rank & Live Timer */}
//       <div className="relative bg-gradient-to-br from-[var(--color-darkslate)] to-[#1a1d24] rounded-3xl shadow-xl overflow-hidden text-white border border-[var(--color-darkslate)]">
//         {/* Abstract Background Design */}
//         <div className="absolute -top-24 -right-10 w-96 h-96 bg-[var(--color-softblue)] opacity-10 rounded-full blur-3xl"></div>
//         <div className="absolute -bottom-24 left-10 w-72 h-72 bg-[var(--color-steelblue)] opacity-20 rounded-full blur-3xl"></div>

//         <div className="relative z-10 p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8">
//           <div className="flex-1 text-center md:text-left">
//             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-sm font-medium mb-6">
//                <Clock size={16} className="text-blue-300" />
//                <span className="tracking-widest">{time.toLocaleTimeString()} | {time.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</span>
//             </div>
//             <h1 className="text-4xl md:text-5xl font-black mb-3 tracking-tight">
//               Welcome back, <span className="text-[var(--color-softblue)]">{user?.name}!</span>
//             </h1>
//             <p className="text-lg text-gray-400 font-medium mb-4">Keep pushing your limits. Your current active session is <span className="text-white font-bold">{formatSessionTime(sessionTime)}</span></p>
            
//             <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-[var(--color-steelblue)]/20 text-blue-200 rounded-xl border border-[var(--color-steelblue)]/30 backdrop-blur-sm">
//                <Flame size={20} className="text-orange-400" />
//                <span className="font-bold text-lg tracking-wide">DevTrack Streak: <span className="text-white">{stats.streak || 0} Days</span></span>
//             </div>
//           </div>

//           {/* Rank Badge Indicator */}
//           <div className={`shrink-0 flex flex-col items-center justify-center p-6 rounded-2xl border-2 ${badge.bg} ${badge.border} shadow-[0_0_30px_rgba(0,0,0,0.3)] min-w-[200px] backdrop-blur-md bg-opacity-90 transform transition hover:scale-105`}>
//             <div className="bg-white p-3 rounded-full shadow-inner mb-3">
//               {badge.icon}
//             </div>
//             <h2 className={`text-2xl font-black uppercase tracking-widest ${badge.color}`}>{badge.name}</h2>
//             <p className="text-sm font-bold text-gray-600 mt-1 uppercase tracking-wide">{badge.title}</p>
//             <p className="text-xs font-bold text-gray-400 mt-1">Score: {stats.score || 0}</p>
//           </div>
//         </div>
//       </div>

//       {/* 📊 Global Platform Metrics */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
//         <StatCard 
//           title="GitHub Commits" 
//           value={stats.githubCommits || 0} 
//           subtitle="Total Contributions"
//           icon={<Github size={24} />} 
//           color="#24292e" 
//           gradient="from-gray-500 to-gray-900"
//         />
//         <StatCard 
//           title="GitHub Repos" 
//           value={stats.githubRepos || 0} 
//           subtitle="Public Repositories"
//           icon={<Github size={24} />} 
//           color="#2b3137" 
//           gradient="from-gray-600 to-gray-800"
//         />
//         <StatCard 
//           title="LeetCode" 
//           value={stats.leetcodeSolved || 0} 
//           subtitle="Problems Solved"
//           icon={<Code2 size={24} />} 
//           color="#f89f1b" 
//           gradient="from-yellow-400 to-orange-500"
//         />
//         <StatCard 
//           title="HackerRank" 
//           value={stats.hackerrankSolved || 0} 
//           subtitle="Challenges Won"
//           icon={<TerminalSquare size={24} />} 
//           color="#00ea64" 
//           gradient="from-green-400 to-emerald-600"
//         />
//         <StatCard 
//           title="CodeChef" 
//           value={stats.codechefSolved || 0} 
//           subtitle="Questions Done"
//           icon={<TerminalSquare size={24} />} 
//           color="#8B5A2B" 
//           gradient="from-yellow-700 to-red-900"
//         />
//         <StatCard 
//           title="LinkedIn" 
//           value={stats.linkedinPosts || 0} 
//           subtitle="Network Posts"
//           icon={<Linkedin size={24} />} 
//           color="#0a66c2" 
//           gradient="from-blue-400 to-blue-700"
//         />
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//         <div className="lg:col-span-2 space-y-8">

//           {/* 📈 Enhanced Activity Graph */}
//           <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-[var(--color-warmbeige)] hover:border-[var(--color-softblue)]/50 transition-colors">
//             <div className="flex justify-between items-center mb-8">
//               <h3 className="text-xl font-extrabold text-[var(--color-darkslate)] flex items-center gap-2">
//                  <Activity className="text-[var(--color-steelblue)]" /> Activity Flow (Last 7 Days)
//               </h3>
//             </div>
            
//             <div style={{ width: '100%', height: 320 }}>
//               <ResponsiveContainer width="100%" height="100%">
//                 <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
//                   <defs>
//                     <linearGradient id="colorCommits" x1="0" y1="0" x2="0" y2="1">
//                       <stop offset="5%" stopColor="#7AA7C7" stopOpacity={0.4}/>
//                       <stop offset="95%" stopColor="#7AA7C7" stopOpacity={0}/>
//                     </linearGradient>
//                   </defs>
//                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E9E6DF" />
//                   <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#7AA7C7', fontSize: 13, fontWeight: 600 }} dy={10} />
//                   <YAxis axisLine={false} tickLine={false} tick={{ fill: '#7AA7C7', fontWeight: 500 }} />
//                   <Tooltip 
//                     contentStyle={{ borderRadius: '12px', border: '1px solid #E9E6DF', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} 
//                     itemStyle={{ fontWeight: 600 }}
//                   />
//                   <Area type="monotone" dataKey="commits" stroke="#7AA7C7" strokeWidth={3} fillOpacity={1} fill="url(#colorCommits)" />
//                 </AreaChart>
//               </ResponsiveContainer>
//             </div>
//           </div>

//           <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-[var(--color-warmbeige)]">
//             <h3 className="text-xl font-extrabold text-[var(--color-darkslate)] mb-6">Execution Consistency</h3>
//             <div style={{ width: '100%', height: 220 }}>
//               <ResponsiveContainer width="100%" height="100%">
//                 <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
//                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E9E6DF" />
//                   <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#7AA7C7', fontWeight: 600 }} dy={10} />
//                   <YAxis axisLine={false} tickLine={false} tick={{ fill: '#7AA7C7', fontWeight: 500 }} />
//                   <Tooltip cursor={{ fill: '#f3f4f6' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
//                   <Bar dataKey="commits" fill="#2A2F36" radius={[6, 6, 0, 0]} maxBarSize={40} />
//                 </BarChart>
//               </ResponsiveContainer>
//             </div>
//           </div>
//         </div>

//         {/* ✨ Enhanced Todo / Focus Panel */}
//         <div className="space-y-6">
//           <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-[var(--color-warmbeige)] flex flex-col h-full relative overflow-hidden">
            
//             <div className="flex items-center justify-between mb-8 relative z-10">
//               <div>
//                 <h3 className="text-xl font-extrabold text-[var(--color-darkslate)]">Focus List</h3>
//                 <p className="text-xs text-gray-400 font-medium tracking-wide uppercase mt-1">Pending Objectives</p>
//               </div>
//               <Link to="/todo" className="p-2 rounded-xl bg-[var(--color-lightsky)] text-[var(--color-steelblue)] hover:bg-[var(--color-softblue)] hover:text-white transition-all hover:scale-110">
//                 <ChevronRight size={24} />
//               </Link>
//             </div>

//             <div className="flex-1 overflow-y-auto space-y-4 pr-2 relative z-10">
//               {todos.length === 0 ? (
//                 <div className="text-center py-12 px-4">
//                    <div className="w-16 h-16 bg-[var(--color-lightsky)] rounded-full flex items-center justify-center mx-auto mb-4 text-[var(--color-steelblue)]">
//                      <CheckCircle2 size={32} />
//                    </div>
//                    <p className="text-[var(--color-darkslate)] font-bold text-lg">All caught up!</p>
//                    <p className="text-sm text-[var(--color-steelblue)] mt-1">You have no tasks pending.</p>
//                 </div>
//               ) : (
//                 todos.map((todo, idx) => (
//                   <div key={todo._id} className="group flex items-start gap-4 p-4 rounded-xl border border-[var(--color-warmbeige)] bg-gradient-to-r hover:from-[var(--color-lightsky)]/30 hover:to-transparent transition-all cursor-pointer">
//                     <div className="mt-0.5">
//                       <CheckCircle2
//                         size={22}
//                         className={`transition-colors ${todo.completed ? 'text-green-500' : 'text-gray-300 group-hover:text-[var(--color-softblue)]'}`}
//                       />
//                     </div>
//                     <div>
//                       <p className={`text-base font-semibold transition-all ${todo.completed ? 'text-gray-400 line-through' : 'text-[var(--color-darkslate)]'}`}>
//                         {todo.task}
//                       </p>
//                       <p className="text-xs text-gray-400 mt-1 font-medium">Goal #{idx+1}</p>
//                     </div>
//                   </div>
//                 ))
//               )}
//             </div>

//             <Link to="/todo" className="mt-8 w-full bg-gradient-to-r from-[var(--color-steelblue)] to-[var(--color-darkslate)] hover:from-[var(--color-softblue)] hover:to-[var(--color-steelblue)] text-white font-bold py-4 px-4 rounded-xl transition-all shadow-md text-center text-sm tracking-wide uppercase relative z-10 flex items-center justify-center gap-2">
//               <span>Manage Your Goals</span>
//               <ChevronRight size={18} />
//             </Link>

//             {/* Background Icon */}
//             <div className="absolute -bottom-10 -right-10 text-[var(--color-warmbeige)] opacity-50 z-0">
//                <CheckSquare size={200} strokeWidth={1} />
//             </div>
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// };

// export default Dashboard;


import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { Link } from 'react-router-dom';
import {
  Github, Code2, TerminalSquare, Linkedin,
  Clock, ChevronRight, CheckCircle2,
  Trophy, Medal, Flame, CheckSquare, Zap, Star, GitCommit, BookOpen
} from 'lucide-react';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  ResponsiveContainer, Tooltip
} from 'recharts';

// ─── Stat Card ───────────────────────────────────────────────────────────────
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

// ─── Leaderboard Badge ────────────────────────────────────────────────────────
const getLeaderboardBadge = (pos) => {
  if (pos === 1) return { name: "Rank #1", title: "Gold Tier",   color: "text-yellow-600",              bg: "bg-yellow-100",               border: "border-yellow-300",         icon: <Trophy size={28} className="text-yellow-600" /> };
  if (pos === 2) return { name: "Rank #2", title: "Silver Tier", color: "text-gray-500",                bg: "bg-gray-100",                  border: "border-gray-300",           icon: <Medal  size={28} className="text-gray-500" /> };
  if (pos === 3) return { name: "Rank #3", title: "Bronze Tier", color: "text-[#cd7f32]",               bg: "bg-orange-50",                 border: "border-[#cd7f32]/30",       icon: <Medal  size={28} className="text-[#cd7f32]" /> };
  if (pos > 0)   return { name: `Rank #${pos}`, title: "Global Rank", color: "text-[var(--color-steelblue)]", bg: "bg-[var(--color-lightsky)]/50", border: "border-[var(--color-softblue)]", icon: <Medal size={28} className="text-[var(--color-steelblue)]" /> };
  return           { name: "Unranked",  title: "Start Coding",  color: "text-gray-400",                bg: "bg-gray-50",                   border: "border-gray-200",           icon: <Medal  size={28} className="text-gray-400" /> };
};

// ─── Roadmap data ─────────────────────────────────────────────────────────────
const PHASE1_FEATURES = [
  'GitHub commits & repository tracking',
  'LeetCode, HackerRank & CodeChef stats',
  'LinkedIn post monitoring',
  'Global leaderboard & streak tracking',
  'Todo / focus list & goal management',
  'Platform progress radar & achievements feed',
];

const PHASE2_FEATURES = [
  'Personalized AI learning roadmap',
  'Skill gap analysis & smart suggestions',
  'AI-powered job & internship recommendations',
  'NGO collaboration for underprivileged students',
  'Mentorship & resource distribution programs',
  'Subsidized access & opportunity matching',
];

// ─── Achievement Feed Item ────────────────────────────────────────────────────
const AchievementItem = ({ icon, label, value, time, accent }) => (
  <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-[var(--color-lightsky)]/20 transition-colors group">
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${accent}`}>
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-semibold text-[var(--color-darkslate)] truncate">{label}</p>
      <p className="text-xs text-gray-400 mt-0.5">{time}</p>
    </div>
    <span className="text-sm font-black text-[var(--color-steelblue)] flex-shrink-0">+{value}</span>
  </div>
);

// ─── Dashboard ────────────────────────────────────────────────────────────────
const Dashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
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
        <div className="h-40 bg-white/60 rounded-3xl w-full" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-32 bg-white/60 rounded-2xl w-full" />
          <div className="h-32 bg-white/60 rounded-2xl w-full" />
          <div className="h-32 bg-white/60 rounded-2xl w-full" />
        </div>
      </div>
    );
  }

  const stats        = dashboardData?.stats       || user?.stats || {};
  const rankPosition = dashboardData?.rankPosition || 0;
  const badge        = getLeaderboardBadge(rankPosition);

  // Radar chart — normalise each platform score to a 0-100 scale for display
  const radarData = [
    { platform: 'GitHub',     value: Math.min(100, Math.round((stats.githubCommits  || 0) / 3)) },
    { platform: 'LeetCode',   value: Math.min(100, Math.round((stats.leetcodeSolved || 0) / 5)) },
    { platform: 'HackerRank', value: Math.min(100, Math.round((stats.hackerrankSolved || 0) / 2)) },
    { platform: 'CodeChef',   value: Math.min(100, Math.round((stats.codechefSolved || 0) / 2)) },
    { platform: 'LinkedIn',   value: Math.min(100, Math.round((stats.linkedinPosts  || 0) * 5)) },
    { platform: 'Streak',     value: Math.min(100, Math.round((stats.streak         || 0) * 3)) },
  ];

  // Recent achievements — derived from live stats
  const achievements = [
    stats.githubCommits  && { icon: <GitCommit size={18} className="text-white" />, label: 'GitHub commits pushed',    value: stats.githubCommits,    time: 'All time',    accent: 'bg-[#24292e]' },
    stats.leetcodeSolved && { icon: <Code2      size={18} className="text-white" />, label: 'LeetCode problems solved', value: stats.leetcodeSolved,   time: 'Total solved', accent: 'bg-[#f89f1b]' },
    stats.hackerrankSolved && { icon: <TerminalSquare size={18} className="text-white" />, label: 'HackerRank challenges',  value: stats.hackerrankSolved, time: 'Completed',   accent: 'bg-[#00b14f]' },
    stats.codechefSolved && { icon: <BookOpen  size={18} className="text-white" />, label: 'CodeChef questions done',  value: stats.codechefSolved,   time: 'Total',       accent: 'bg-[#8B5A2B]' },
    stats.linkedinPosts  && { icon: <Linkedin  size={18} className="text-white" />, label: 'LinkedIn posts shared',    value: stats.linkedinPosts,    time: 'Published',   accent: 'bg-[#0a66c2]' },
    stats.streak         && { icon: <Flame     size={18} className="text-white" />, label: 'Day streak maintained',    value: `${stats.streak}d`,     time: 'Active now',  accent: 'bg-orange-500' },
    stats.score          && { icon: <Star      size={18} className="text-white" />, label: 'Total platform score',     value: stats.score,            time: 'Accumulated', accent: 'bg-violet-600' },
  ].filter(Boolean);

  return (
    <div className="space-y-8 pb-10">

      {/* 🚀 Hero */}
      <div className="relative bg-gradient-to-br from-[var(--color-darkslate)] to-[#1a1d24] rounded-3xl shadow-xl overflow-hidden text-white border border-[var(--color-darkslate)]">
        <div className="absolute -top-24 -right-10 w-96 h-96 bg-[var(--color-softblue)] opacity-10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 left-10 w-72 h-72 bg-[var(--color-steelblue)] opacity-20 rounded-full blur-3xl" />

        <div className="relative z-10 p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex-1 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-sm font-medium mb-6">
              <Clock size={16} className="text-blue-300" />
              <span className="tracking-widest">
                {time.toLocaleTimeString()} | {time.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-3 tracking-tight">
              Welcome back, <span className="text-[var(--color-softblue)]">{user?.name}!</span>
            </h1>
            <p className="text-lg text-gray-400 font-medium mb-4">
              Keep pushing your limits. Your current active session is{' '}
              <span className="text-white font-bold">{formatSessionTime(sessionTime)}</span>
            </p>
            <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-[var(--color-steelblue)]/20 text-blue-200 rounded-xl border border-[var(--color-steelblue)]/30 backdrop-blur-sm">
              <Flame size={20} className="text-orange-400" />
              <span className="font-bold text-lg tracking-wide">
                DevTrack Streak: <span className="text-white">{stats.streak || 0} Days</span>
              </span>
            </div>
          </div>

          <div className={`shrink-0 flex flex-col items-center justify-center p-6 rounded-2xl border-2 ${badge.bg} ${badge.border} shadow-[0_0_30px_rgba(0,0,0,0.3)] min-w-[200px] backdrop-blur-md bg-opacity-90 transform transition hover:scale-105`}>
            <div className="bg-white p-3 rounded-full shadow-inner mb-3">{badge.icon}</div>
            <h2 className={`text-2xl font-black uppercase tracking-widest ${badge.color}`}>{badge.name}</h2>
            <p className="text-sm font-bold text-gray-600 mt-1 uppercase tracking-wide">{badge.title}</p>
            <p className="text-xs font-bold text-gray-400 mt-1">Score: {stats.score || 0}</p>
          </div>
        </div>
      </div>

      {/* 📊 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard title="GitHub Commits"  value={stats.githubCommits    || 0} subtitle="Total Contributions" icon={<Github         size={24} />} color="#24292e" gradient="from-gray-500 to-gray-900"    />
        <StatCard title="GitHub Repos"    value={stats.githubRepos      || 0} subtitle="Public Repositories" icon={<Github         size={24} />} color="#2b3137" gradient="from-gray-600 to-gray-800"    />
        <StatCard title="LeetCode"        value={stats.leetcodeSolved   || 0} subtitle="Problems Solved"     icon={<Code2          size={24} />} color="#f89f1b" gradient="from-yellow-400 to-orange-500" />
        <StatCard title="HackerRank"      value={stats.hackerrankSolved || 0} subtitle="Challenges Won"      icon={<TerminalSquare size={24} />} color="#00ea64" gradient="from-green-400 to-emerald-600" />
        <StatCard title="CodeChef"        value={stats.codechefSolved   || 0} subtitle="Questions Done"      icon={<TerminalSquare size={24} />} color="#8B5A2B" gradient="from-yellow-700 to-red-900"    />
        <StatCard title="LinkedIn"        value={stats.linkedinPosts    || 0} subtitle="Network Posts"       icon={<Linkedin       size={24} />} color="#0a66c2" gradient="from-blue-400 to-blue-700"     />
      </div>

      {/* 📡 Radar + 🏅 Achievements + ✅ Todo */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left col — Radar + Achievements stacked */}
        <div className="lg:col-span-2 space-y-8">

          {/* Platform Radar */}
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-[var(--color-warmbeige)]">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="text-xl font-extrabold text-[var(--color-darkslate)] flex items-center gap-2">
                  <Zap size={20} className="text-[var(--color-steelblue)]" />
                  Platform Strength Radar
                </h3>
                <p className="text-xs text-gray-400 mt-1 font-medium">Normalised score across all connected platforms</p>
              </div>
            </div>

            <div style={{ width: '100%', height: 320 }}>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
                  <PolarGrid stroke="#E9E6DF" />
                  <PolarAngleAxis
                    dataKey="platform"
                    tick={{ fill: '#7AA7C7', fontSize: 13, fontWeight: 600 }}
                  />
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: '1px solid #E9E6DF', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    formatter={(v) => [`${v} pts`, 'Score']}
                  />
                  <Radar
                    name="Score"
                    dataKey="value"
                    stroke="#7AA7C7"
                    fill="#7AA7C7"
                    fillOpacity={0.25}
                    strokeWidth={2}
                    dot={{ r: 4, fill: '#2A2F36', strokeWidth: 0 }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Legend pills */}
            <div className="flex flex-wrap gap-2 mt-2 justify-center">
              {radarData.map(({ platform, value }) => (
                <span key={platform} className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--color-steelblue)] bg-[var(--color-lightsky)]/50 px-3 py-1 rounded-full border border-[var(--color-softblue)]/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-steelblue)] inline-block" />
                  {platform}: {value}
                </span>
              ))}
            </div>
          </div>

          {/* Recent Achievements Feed */}
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-[var(--color-warmbeige)]">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-extrabold text-[var(--color-darkslate)] flex items-center gap-2">
                  <Trophy size={20} className="text-amber-500" />
                  Recent Achievements
                </h3>
                <p className="text-xs text-gray-400 mt-1 font-medium">Your milestones across all platforms</p>
              </div>
              <span className="text-xs font-bold text-[var(--color-steelblue)] bg-[var(--color-lightsky)]/50 px-3 py-1.5 rounded-xl border border-[var(--color-softblue)]/20">
                {achievements.length} unlocked
              </span>
            </div>

            {achievements.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-gray-400 text-sm">No achievements yet — start coding!</p>
              </div>
            ) : (
              <div className="divide-y divide-[var(--color-warmbeige)]">
                {achievements.map((a, i) => (
                  <AchievementItem key={i} {...a} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right col — Todo / Focus Panel */}
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
                      <p className="text-xs text-gray-400 mt-1 font-medium">Goal #{idx + 1}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <Link to="/todo" className="mt-8 w-full bg-gradient-to-r from-[var(--color-steelblue)] to-[var(--color-darkslate)] hover:from-[var(--color-softblue)] hover:to-[var(--color-steelblue)] text-white font-bold py-4 px-4 rounded-xl transition-all shadow-md text-center text-sm tracking-wide uppercase relative z-10 flex items-center justify-center gap-2">
              <span>Manage Your Goals</span>
              <ChevronRight size={18} />
            </Link>

            <div className="absolute -bottom-10 -right-10 text-[var(--color-warmbeige)] opacity-50 z-0">
              <CheckSquare size={200} strokeWidth={1} />
            </div>
          </div>
        </div>
      </div>

      {/* 🗺️ Platform Roadmap */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-extrabold text-[var(--color-darkslate)]">Platform Roadmap</h2>
          <span className="text-xs font-semibold text-gray-500 bg-[var(--color-warmbeige)] border border-[var(--color-warmbeige)] rounded-full px-3 py-1 tracking-wide uppercase">
            Phase 1 → Phase 2
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Phase 1 */}
          <div className="bg-white rounded-3xl border border-emerald-200 p-6 shadow-sm">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 inline-block" />
              Phase 1 · Live Now
            </span>
            <h3 className="text-base font-extrabold text-[var(--color-darkslate)] mb-1">Core Tracking & Dashboard</h3>
            <p className="text-sm text-gray-400 mb-5 leading-relaxed">
              Everything you see today — built to help developers track progress across platforms in one unified view.
            </p>
            <ul className="space-y-2.5">
              {PHASE1_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-gray-600">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          </div>

          {/* Phase 2 */}
          <div className="bg-white rounded-3xl border border-[var(--color-warmbeige)] p-6 shadow-sm relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-50/40 to-transparent pointer-events-none rounded-3xl" />
            <div className="relative z-10">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-violet-700 bg-violet-50 border border-violet-200 rounded-full px-3 py-1 mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse inline-block" />
                Phase 2 · Coming Soon
              </span>
              <h3 className="text-base font-extrabold text-[var(--color-darkslate)] mb-1">AI Features & NGO Integration</h3>
              <p className="text-sm text-gray-400 mb-5 leading-relaxed">
                The next evolution — intelligent guidance for every learner, and outreach to those who need it most.
              </p>
              <ul className="space-y-2.5">
                {PHASE2_FEATURES.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-gray-500">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-violet-400 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <div className="mt-5 pt-4 border-t border-[var(--color-warmbeige)] flex items-center gap-2 text-xs font-semibold text-violet-500">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
                Future implementation — not yet available
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};

export default Dashboard;