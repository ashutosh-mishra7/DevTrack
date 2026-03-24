import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import AvatarSelector from '../components/AvatarSelector';
import { UserPlus, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    email: '',
    password: '',
  });

  const [avatar, setAvatar] = useState(1);
  const [error, setError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth(); // ✅ ADD THIS

  useEffect(() => {
    if (formData.username.length > 0) {
      if (!/^[A-Za-z0-9_-]+$/.test(formData.username)) {
        setUsernameError('Only letters, numbers, underscores, and hyphens allowed.');
      } else {
        setUsernameError('');
      }
    } else {
      setUsernameError('');
    }
  }, [formData.username]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (usernameError) return;

    setError('');
    setLoading(true);

    try {
      const { data } = await api.post('/auth/register', {
        ...formData,
        email: formData.email.trim(),
        avatar,
      });

      
      login(data);
      navigate('/');

    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 py-12">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-8 border border-[var(--color-warmbeige)]">

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--color-lightsky)] text-[var(--color-steelblue)] mb-4">
            <UserPlus size={32} />
          </div>
          <h1 className="text-3xl font-bold text-[var(--color-darkslate)]">Join DevTrack</h1>
          <p className="text-[var(--color-steelblue)] mt-2">Start tracking your productivity today</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm mb-6 flex gap-3 border border-red-100">
            <AlertCircle size={20} />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div className="space-y-5">

              <input
                type="text"
                name="name"
                required
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border"
              />

              <input
                type="text"
                name="username"
                required
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border"
              />

              {usernameError && (
                <p className="text-red-500 text-sm">{usernameError}</p>
              )}

              <input
                type="email"
                name="email"
                required
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border"
              />

              <input
                type="password"
                name="password"
                required
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border"
              />

            </div>

            <div className="bg-[var(--color-lightsky)]/50 p-6 rounded-xl">
              <AvatarSelector selected={avatar} onSelect={setAvatar} />
            </div>

          </div>

          <button
            type="submit"
            disabled={loading || !!usernameError}
            className="w-full bg-[var(--color-steelblue)] text-white py-3 rounded-xl flex justify-center"
          >
            {loading ? <Loader2 className="animate-spin" /> : 'Create Account'}
          </button>

        </form>

        <p className="text-center mt-6">
          Already have an account? <Link to="/login">Login</Link>
        </p>

      </div>
    </div>
  );
};

export default Register;