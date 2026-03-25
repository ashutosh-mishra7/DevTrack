import { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const userInfo = localStorage.getItem('userInfo');
      if (userInfo) {
        const parsedUser = JSON.parse(userInfo);
        
        // Token expiration check
        if (parsedUser?.token) {
          const payload = JSON.parse(atob(parsedUser.token.split('.')[1]));
          // exp is in seconds, Date.now() is in ms
          if (payload.exp * 1000 < Date.now()) {
            console.warn('Authentication token expired, logging out.');
            localStorage.removeItem('userInfo');
            setUser(null);
          } else {
            setUser(parsedUser);
          }
        } else {
          // Fallback if token is somehow missing but userInfo exists
          setUser(parsedUser);
        }
      }
    } catch (error) {
      console.error('Error parsing userInfo or token:', error);
      localStorage.removeItem('userInfo');
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('userInfo', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('userInfo');
  };

  // ✅ Fixed: ab callback aur direct object dono support karta hai
  const updateContextUser = (updatedData) => {
    if (!user) return;

    const newData = typeof updatedData === 'function'
      ? { ...user, ...updatedData(user) }
      : { ...user, ...updatedData };

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