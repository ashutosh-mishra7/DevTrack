import { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔄 Load user from localStorage
  useEffect(() => {
    try {
      const userInfo = localStorage.getItem('userInfo');
      if (userInfo) {
        setUser(JSON.parse(userInfo));
      }
    } catch (error) {
      console.error('Error parsing userInfo:', error);
      localStorage.removeItem('userInfo');
    } finally {
      setLoading(false);
    }
  }, []);

  // 🔐 Login
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('userInfo', JSON.stringify(userData));
  };

  // 🚪 Logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem('userInfo');
  };

  // 🔄 Update user (profile/settings change)
  const updateContextUser = (updatedData) => {
    if (!user) return;

    const newData = { ...user, ...updatedData };
    setUser(newData);
    localStorage.setItem('userInfo', JSON.stringify(newData));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateContextUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);