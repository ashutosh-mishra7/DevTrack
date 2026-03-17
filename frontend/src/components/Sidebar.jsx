import { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Menu, X, LayoutDashboard, CheckSquare, 
  Trophy, UserCircle, Settings, LogOut 
} from 'lucide-react';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Todo', path: '/todo', icon: <CheckSquare size={20} /> },
    { name: 'Leaderboard', path: '/leaderboard', icon: <Trophy size={20} /> },
    { name: 'Profile', path: '/profile', icon: <UserCircle size={20} /> },
    { name: 'Settings', path: '/settings', icon: <Settings size={20} /> },
  ];

  const getLinkClasses = (path) => `
    flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
    ${location.pathname === path 
      ? 'bg-[var(--color-steelblue)] text-white' 
      : 'text-[var(--color-darkslate)] hover:bg-[var(--color-softblue)] hover:text-white'}
  `;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar Component */}
      <aside 
        className={`fixed md:static inset-y-0 left-0 w-64 bg-[var(--color-warmbeige)] shadow-lg 
        transform transition-transform duration-300 ease-in-out z-30 flex flex-col
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        <div className="flex items-center justify-between p-6 border-b border-[var(--color-softblue)]">
          <h1 className="text-2xl font-bold text-[var(--color-darkslate)] tracking-tight">DevTrack</h1>
          <button onClick={toggleSidebar} className="md:hidden text-[var(--color-darkslate)]">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 pb-2">
          {user && (
            <div className="flex items-center gap-3 mb-6 p-3 bg-white/50 rounded-xl">
              <img 
                src={`/avatars/${user.avatar || 1}.png`} 
                alt="avatar" 
                className="w-10 h-10 rounded-full bg-[var(--color-lightsky)] object-cover"
                onError={(e) => {
                  e.target.onerror = null; 
                  e.target.src = 'https://api.dicebear.com/7.x/bottts/svg?seed=' + user.username;
                }}
              />
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-[var(--color-darkslate)] truncate">{user.name}</p>
                <p className="text-xs text-[var(--color-steelblue)] truncate">@{user.username}</p>
              </div>
            </div>
          )}
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {navItems.map((item) => (
            <NavLink 
              key={item.name}
              to={item.path}
              className={getLinkClasses(item.path)}
              onClick={() => { if(window.innerWidth < 768) toggleSidebar() }}
            >
              {item.icon}
              <span className="font-medium">{item.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-[var(--color-softblue)]">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors font-medium"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
