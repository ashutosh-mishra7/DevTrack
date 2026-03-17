import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Trophy, TrendingUp, TrendingDown, Minus, Medal } from 'lucide-react';

const Leaderboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user: currentUser } = useAuth();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const { data } = await api.get('/user/leaderboard');
        setUsers(data);
      } catch (error) {
        console.error('Error fetching leaderboard', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  if (loading) {
     return <div className="animate-pulse bg-white/50 h-[80vh] rounded-xl flex items-center justify-center text-[var(--color-steelblue)]">Loading rankings...</div>;
  }

  // To simulate rank changes since we don't store historical rankings, we'll randomize an indicator visually for demo purposes based on username length. 
  // In a real app this would compare current rank to last week's rank.
  const getRankIndicator = (username) => {
    const val = username.length % 3;
    if (val === 0) return <TrendingUp size={16} className="text-green-500" />;
    if (val === 1) return <TrendingDown size={16} className="text-red-500" />;
    return <Minus size={16} className="text-gray-400" />;
  };

  const getRankMedal = (index) => {
    if (index === 0) return <Medal size={28} className="text-yellow-400 drop-shadow-sm" />;
    if (index === 1) return <Medal size={26} className="text-gray-400 drop-shadow-sm" />;
    if (index === 2) return <Medal size={24} className="text-[#cd7f32] drop-shadow-sm" />;
    return <span className="text-lg font-bold text-gray-400 w-7 text-center block">{index + 1}</span>;
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col items-center justify-center py-6 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[var(--color-steelblue)] text-white mb-4 shadow-lg shadow-[var(--color-steelblue)]/30">
          <Trophy size={40} />
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-[var(--color-darkslate)]">Global Leaderboard</h1>
        <p className="text-[var(--color-steelblue)] mt-3 max-w-lg mx-auto font-medium">
          Compete with developers worldwide. Boost your score by committing code, solving problems, and maintaining your streak.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-[var(--color-warmbeige)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[var(--color-lightsky)]/50 border-b border-[var(--color-warmbeige)]">
                <th className="px-6 py-4 text-sm font-semibold text-[var(--color-steelblue)] uppercase tracking-wider w-20 text-center">Rank</th>
                <th className="px-6 py-4 text-sm font-semibold text-[var(--color-steelblue)] uppercase tracking-wider">Developer</th>
                <th className="px-6 py-4 text-sm font-semibold text-[var(--color-steelblue)] uppercase tracking-wider text-center">Trend</th>
                <th className="px-6 py-4 text-sm font-semibold text-[var(--color-steelblue)] uppercase tracking-wider text-right">Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-warmbeige)]/50">
              {users.map((user, index) => {
                const isCurrentUser = user._id === currentUser?._id;
                return (
                  <tr 
                    key={user._id} 
                    className={`transition-colors hover:bg-[var(--color-lightsky)]/30
                      ${isCurrentUser ? 'bg-[var(--color-softblue)]/10 ring-2 ring-inset ring-[var(--color-steelblue)]' : ''}
                    `}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                       <div className="flex justify-center">{getRankMedal(index)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-4">
                        <img 
                          src={`/avatars/${user.avatar || 1}.png`} 
                          alt="avatar" 
                          className="w-12 h-12 rounded-full bg-[var(--color-warmbeige)] object-cover shadow-sm"
                          onError={(e) => { e.target.onerror=null; e.target.src=`https://api.dicebear.com/7.x/bottts/svg?seed=${user.username}`}}
                        />
                        <div>
                          <div className="text-[var(--color-darkslate)] font-bold flex items-center gap-2">
                             {user.name} 
                             {isCurrentUser && <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[var(--color-steelblue)] text-white uppercase tracking-wider">You</span>}
                          </div>
                          <div className="text-[var(--color-steelblue)] text-sm">@{user.username}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex justify-center">{getRankIndicator(user.username)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <span className={`text-xl font-bold ${index < 3 ? 'text-[var(--color-steelblue)]' : 'text-[var(--color-darkslate)]'}`}>
                        {user.stats.score.toLocaleString()}
                      </span>
                    </td>
                  </tr>
                );
              })}
              
              {users.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-[var(--color-steelblue)]">
                    No developers found on the leaderboard.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
