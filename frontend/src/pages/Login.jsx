import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { LogIn, Loader2 } from 'lucide-react';

const Login = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data } = await api.post('/auth/login', { identifier, password });
      login(data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 border border-[var(--color-warmbeige)]">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--color-lightsky)] text-[var(--color-steelblue)] mb-4">
            <LogIn size={32} />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--color-darkslate)]">Welcome back</h1>
          <p className="text-[var(--color-steelblue)] mt-2">Enter your credentials to access DevTrack</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-6 text-center border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-[var(--color-darkslate)] mb-1">Username or Email</label>
            <input
              type="text"
              required
              className="w-full px-4 py-3 rounded-lg border border-[var(--color-warmbeige)] focus:ring-2 focus:ring-[var(--color-softblue)] focus:border-transparent outline-none transition-all placeholder:text-gray-400"
              placeholder="username or email"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-darkslate)] mb-1">
  Password
</label>
            <input
              type="password"
              required
              className="w-full px-4 py-3 rounded-lg border border-[var(--color-warmbeige)] focus:ring-2 focus:ring-[var(--color-softblue)] focus:border-transparent outline-none transition-all placeholder:text-gray-400"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[var(--color-steelblue)] hover:bg-[var(--color-softblue)] text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed mt-2"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : 'Sign In'}
          </button>
        </form>

        <p className="text-center mt-8 text-sm text-[var(--color-darkslate)]">
          Don't have an account?{' '}
          <Link to="/register" className="text-[var(--color-steelblue)] hover:text-[var(--color-softblue)] font-semibold transition-colors">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
