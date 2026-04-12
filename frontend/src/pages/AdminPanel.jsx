import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ShieldAlert, Key, Users, Loader2, LogOut } from 'lucide-react';

const AdminPanel = () => {
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const adminToken = localStorage.getItem('adminToken');
  const adminUser = JSON.parse(localStorage.getItem('adminUser') || '{}');

  useEffect(() => {
    if (!adminToken) {
      navigate('/admin');
      return;
    }

    const fetchUsers = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL || 'https://devtrack-nd76.onrender.com/api'}/admin/users`, {
          headers: {
            Authorization: `Bearer ${adminToken}`,
            'Cache-Control': 'no-cache',
          }
        });
        setUsersList(data);
      } catch (err) {
        setError('Failed to fetch users. Token may be expired or invalid.');
        if (err.response?.status === 401) {
          handleLogout();
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, [adminToken, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin');
  };

  const handleResetPassword = async (id, username) => {
    const newPassword = prompt(`Enter new password for ${username}:`);
    if (!newPassword) return;

    if (newPassword.length < 6) {
      alert("Password must be at least 6 characters long.");
      return;
    }

    try {
      const { data } = await axios.put(
        `${import.meta.env.VITE_API_URL || 'https://devtrack-nd76.onrender.com/api'}/admin/users/${id}/reset-password`,
        { newPassword },
        { headers: { Authorization: `Bearer ${adminToken}` } }
      );
      setSuccess(data.message);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to reset password');
      if (err.response?.status === 401) handleLogout();
    }
  };

  if (!adminToken) return null;

  return (
    <div className="min-h-screen bg-gray-50 text-[var(--color-darkslate)]">
      {/* Admin Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ShieldAlert size={28} className="text-red-500" />
          <h1 className="text-xl md:text-2xl font-bold tracking-tight">Admin Dashboard</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden md:block font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full text-sm">
            @{adminUser.username}
          </span>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-sm font-bold transition-colors"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </header>

      <main className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center gap-4">
            <div className="p-3 bg-red-50 text-red-600 rounded-lg">
              <Users size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Registered Users</p>
              <h3 className="text-2xl font-bold text-gray-900">{usersList.length}</h3>
            </div>
          </div>
        </div>

        {success && (
          <div className="p-4 bg-green-50 text-green-700 border border-green-200 rounded-lg text-sm font-medium">
            {success}
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm font-medium flex justify-between">
            {error}
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/50 flex flex-col md:flex-row items-center justify-between gap-4">
            <h2 className="text-lg font-bold">User Management</h2>
            
            {/* Search Input */}
            <div className="w-full md:w-auto relative">
              <input
                type="text"
                placeholder="Search by name, username, or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full md:w-80 pl-4 pr-10 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm transition-shadow"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
          
          {loading ? (
            <div className="p-8 flex justify-center">
              <Loader2 className="animate-spin text-gray-400" size={32} />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="bg-gray-50/50 text-gray-500 text-sm uppercase tracking-wider">
                    <th className="px-6 py-4 font-semibold">User Content</th>
                    <th className="px-6 py-4 font-semibold">Username</th>
                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {usersList
                    .filter(u => 
                      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      u.email.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map((u) => (
                    <tr key={u._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img 
                            src={`/avatars/${u.avatar || 1}.png`} 
                            alt="avatar" 
                            className="w-10 h-10 rounded-full bg-gray-100"
                            onError={(e) => {
                              e.target.onerror = null; 
                              e.target.src = `https://api.dicebear.com/7.x/bottts/svg?seed=Avatar${u.avatar || 1}`;
                            }}
                          />
                          <div>
                            <p className="font-bold text-gray-900">{u.name}</p>
                            <p className="text-sm text-gray-500">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-700">@{u.username}</td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleResetPassword(u._id, u.username)}
                          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 rounded-lg text-sm font-bold transition-colors shadow-sm"
                        >
                          <Key size={16} />
                          Force Reset
                        </button>
                      </td>
                    </tr>
                  ))}
                  {usersList.filter(u => 
                      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      u.email.toLowerCase().includes(searchQuery.toLowerCase())
                    ).length === 0 && (
                    <tr>
                      <td colSpan="3" className="px-6 py-8 text-center text-gray-500">
                        {searchQuery ? "No matching users found." : "No users found in standard directory."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminPanel;
