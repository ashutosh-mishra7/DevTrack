import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Github, Code2, TerminalSquare, Linkedin, Save, Loader2, CheckCircle2 } from 'lucide-react';

const Profile = () => {
  const { user, updateContextUser } = useAuth();
  const [platforms, setPlatforms] = useState({
    github: '',
    leetcode: '',
    hackerrank: '',
    linkedin: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [fetchingProfile, setFetchingProfile] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get('/user/profile');
        setPlatforms(data.platforms || {
          github: '',
          leetcode: '',
          hackerrank: '',
          linkedin: ''
        });
      } catch (error) {
        console.error('Error fetching profile', error);
      } finally {
        setFetchingProfile(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setPlatforms({ ...platforms, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      const { data } = await api.put('/user/profile', { platforms });
      updateContextUser((prev) => ({
  ...prev,
  platforms: data.platforms,
  stats: data.stats
}));
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Error updating profile', error);
    } finally {
      setLoading(false);
    }
  };

  if (fetchingProfile) {
    return <div className="animate-pulse bg-white/50 h-[80vh] rounded-xl flex items-center justify-center text-[var(--color-steelblue)]">Loading profile...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      <div className="bg-white rounded-3xl shadow-sm border border-[var(--color-warmbeige)] overflow-hidden">
        {/* Banner */}
        <div className="h-32 bg-gradient-to-r from-[var(--color-softblue)] to-[var(--color-steelblue)]"></div>
        
        {/* User Info Header */}
        <div className="px-8 pb-8 relative">
           <div className="absolute -top-16 left-8 p-1.5 bg-white rounded-full">
            <img 
                src={`/avatars/${user?.avatar || 1}.png`} 
                alt="avatar" 
                className="w-28 h-28 rounded-full bg-[var(--color-lightsky)] object-cover shadow-sm"
                onError={(e) => { e.target.onerror=null; e.target.src=`https://api.dicebear.com/7.x/bottts/svg?seed=${user?.username}`}}
              />
           </div>
           
           <div className="mt-16 sm:mt-14 sm:ml-40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                 <h1 className="text-3xl font-bold tracking-tight text-[var(--color-darkslate)]">{user?.name}</h1>
                 <p className="text-lg text-[var(--color-steelblue)] font-medium">@{user?.username}</p>
                 <p className="text-sm text-gray-400 mt-1">{user?.email}</p>
              </div>
           </div>
        </div>
      </div>

      {/* Platform Connections Form */}
      <div className="bg-white rounded-3xl shadow-sm border border-[var(--color-warmbeige)] p-8">
        <h2 className="text-2xl font-bold tracking-tight text-[var(--color-darkslate)] mb-2">Connected Platforms</h2>
        <p className="text-[var(--color-steelblue)] mb-8">
           Enter your exact usernames to fetch latest statistics and rank up on the leaderboard automatically.
        </p>

        {success && (
          <div className="bg-green-50 text-green-700 p-4 rounded-xl text-sm mb-8 border border-green-200 flex items-center gap-3">
             <CheckCircle2 size={20} className="shrink-0" />
             <p className="font-semibold">Platforms updated successfully. Dashboard stats have been instantly refreshed!</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-bold text-[var(--color-darkslate)]">
                 <Github size={18} /> GitHub Username
              </label>
              <input
                type="text"
                name="github"
                className="w-full px-4 py-3 rounded-xl border border-[var(--color-warmbeige)] focus:ring-2 focus:ring-[var(--color-softblue)] focus:border-transparent outline-none transition-all placeholder:text-gray-300 bg-gray-50/50"
                placeholder="e.g. torvalds"
                value={platforms.github}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-bold text-[#f89f1b]">
                 <Code2 size={18} /> LeetCode Username
              </label>
              <input
                type="text"
                name="leetcode"
                className="w-full px-4 py-3 rounded-xl border border-[var(--color-warmbeige)] focus:ring-2 focus:ring-[#f89f1b]/50 focus:border-transparent outline-none transition-all placeholder:text-gray-300 bg-gray-50/50"
                placeholder="e.g. neetcode"
                value={platforms.leetcode}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-bold text-[#00ea64]">
                 <TerminalSquare size={18} /> HackerRank Username
              </label>
              <input
                type="text"
                name="hackerrank"
                className="w-full px-4 py-3 rounded-xl border border-[var(--color-warmbeige)] focus:ring-2 focus:ring-[#00ea64]/50 focus:border-transparent outline-none transition-all placeholder:text-gray-300 bg-gray-50/50"
                placeholder="e.g. hackercode"
                value={platforms.hackerrank}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-bold text-[#0a66c2]">
                 <Linkedin size={18} /> LinkedIn Username
              </label>
              <input
                type="text"
                name="linkedin"
                className="w-full px-4 py-3 rounded-xl border border-[var(--color-warmbeige)] focus:ring-2 focus:ring-[#0a66c2]/50 focus:border-transparent outline-none transition-all placeholder:text-gray-300 bg-gray-50/50"
                placeholder="e.g. williamhgates"
                value={platforms.linkedin}
                onChange={handleChange}
              />
            </div>

          </div>

          <div className="pt-6 border-t border-[var(--color-warmbeige)]">
            <button
              type="submit"
              disabled={loading}
              className="ml-auto bg-[var(--color-steelblue)] hover:bg-[var(--color-softblue)] text-white font-bold py-3 px-8 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
              {loading ? 'Fetching Stats...' : 'Save & Sync Platforms'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default Profile;
