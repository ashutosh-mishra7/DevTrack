import { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAuth } from '../context/AuthContext';
import { Menu } from 'lucide-react';

const Layout = () => {
  const { user, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[var(--color-lightsky)]">Loading...</div>;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--color-lightsky)]">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden bg-white shadow-sm h-16 flex items-center px-4">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="text-[var(--color-darkslate)] p-2 -ml-2 rounded-lg hover:bg-[var(--color-warmbeige)]"
          >
            <Menu size={24} />
          </button>
          <h1 className="text-xl font-bold ml-2 text-[var(--color-darkslate)]">DevTrack</h1>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
