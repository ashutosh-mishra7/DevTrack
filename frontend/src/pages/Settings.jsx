import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import AvatarSelector from '../components/AvatarSelector';
import { UserCog, KeyRound, Mail, Save, Loader2, CheckCircle2 } from 'lucide-react';

const Settings = () => {
  const { user, updateContextUser, logout } = useAuth();
  const navigate = useNavigate();

  // Basic Details State
  const [name, setName] = useState(user?.name || '');
  const [avatar, setAvatar] = useState(user?.avatar || 1);
  const [basicLoading, setBasicLoading] = useState(false);
  const [basicSuccess, setBasicSuccess] = useState(false);

  // Email State
  const [newEmail, setNewEmail] = useState('');
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailError, setEmailError] = useState('');

  // Password State
  const [passwords, setPasswords] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [passLoading, setPassLoading] = useState(false);
  const [passError, setPassError] = useState('');
  const [passSuccess, setPassSuccess] = useState(false);

  const handleBasicUpdate = async (e) => {
    e.preventDefault();
    setBasicLoading(true);
    setBasicSuccess(false);
    try {
      const { data } = await api.put('/user/settings', { name, avatar });
      updateContextUser({ name: data.name, avatar: data.avatar });
      setBasicSuccess(true);
      setTimeout(() => setBasicSuccess(false), 3000);
    } catch (error) {
      console.error(error);
    } finally {
      setBasicLoading(false);
    }
  };

  const handleEmailUpdate = async (e) => {
    e.preventDefault();
    if (!newEmail || newEmail === user.email) return;
    setEmailLoading(true);
    setEmailError('');
    try {
      await api.put('/user/settings', { newEmail });
      // Redirect to verification
      logout();
      navigate('/verify-email', { state: { email: newEmail } });
    } catch (error) {
      setEmailError(error.response?.data?.message || 'Failed to update email');
      setEmailLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      setPassError('New passwords do not match');
      return;
    }
    setPassLoading(true);
    setPassError('');
    setPassSuccess(false);
    try {
      await api.put('/user/settings', { 
        oldPassword: passwords.oldPassword, 
        newPassword: passwords.newPassword 
      });
      setPassSuccess(true);
      setPasswords({ oldPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setPassSuccess(false), 3000);
    } catch (error) {
      setPassError(error.response?.data?.message || 'Failed to change password');
    } finally {
      setPassLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[var(--color-darkslate)] flex items-center gap-3">
           <UserCog size={32} className="text-[var(--color-steelblue)]" /> Account Settings
        </h1>
        <p className="text-[var(--color-steelblue)] mt-2">Update your personal details, email, and password.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Basic Information */}
        <div className="bg-white rounded-2xl shadow-sm border border-[var(--color-warmbeige)] p-6 md:p-8 space-y-6 lg:row-span-2">
          <h2 className="text-xl font-bold tracking-tight text-[var(--color-darkslate)] mb-4">Profile Information</h2>
          
          {basicSuccess && (
            <div className="bg-green-50 text-green-700 p-3 rounded-xl text-sm border border-green-200 flex items-center gap-2">
               <CheckCircle2 size={16} /> Profile updated successfully.
            </div>
          )}

          <form onSubmit={handleBasicUpdate} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-[var(--color-darkslate)] mb-2">Display Name</label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 rounded-xl border border-[var(--color-warmbeige)] focus:ring-2 focus:ring-[var(--color-softblue)] focus:border-transparent outline-none transition-all placeholder:text-gray-400 bg-gray-50/50"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="pt-4 border-t border-[var(--color-warmbeige)]">
              <AvatarSelector selected={avatar} onSelect={setAvatar} />
            </div>

            <button
              type="submit"
              disabled={basicLoading}
              className="w-full bg-[var(--color-steelblue)] hover:bg-[var(--color-softblue)] text-white font-bold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-sm mt-4"
            >
              {basicLoading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
              Save Profile
            </button>
          </form>
        </div>

        {/* Change Email */}
        <div className="bg-white rounded-2xl shadow-sm border border-[var(--color-warmbeige)] p-6 md:p-8">
           <h2 className="text-xl font-bold tracking-tight text-[var(--color-darkslate)] mb-1 flex items-center gap-2">
             <Mail size={20} className="text-[var(--color-steelblue)]" /> Change Email
           </h2>
           <p className="text-sm text-[var(--color-steelblue)] mb-6">Current: <span className="font-semibold">{user?.email}</span></p>

           {emailError && (
             <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm mb-4 border border-red-100">{emailError}</div>
           )}

           <form onSubmit={handleEmailUpdate} className="space-y-4">
             <div>
                <input
                  type="email"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-[var(--color-warmbeige)] focus:ring-2 focus:ring-[var(--color-softblue)] focus:border-transparent outline-none transition-all placeholder:text-gray-400 bg-gray-50/50"
                  placeholder="New Email Address"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                />
             </div>
             <p className="text-xs text-gray-400">You will be logged out and a verification code will be sent to the new email address.</p>
             <button
                type="submit"
                disabled={emailLoading || !newEmail || newEmail === user?.email}
                className="w-full bg-[var(--color-lightsky)] hover:bg-[var(--color-softblue)] hover:text-white text-[var(--color-steelblue)] font-bold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {emailLoading && <Loader2 className="animate-spin" size={20} />}
                Send Verification Code
              </button>
           </form>
        </div>

        {/* Change Password */}
        <div className="bg-white rounded-2xl shadow-sm border border-[var(--color-warmbeige)] p-6 md:p-8">
           <h2 className="text-xl font-bold tracking-tight text-[var(--color-darkslate)] mb-6 flex items-center gap-2">
             <KeyRound size={20} className="text-[var(--color-steelblue)]" /> Change Password
           </h2>
           
           {passError && <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm mb-4 border border-red-100">{passError}</div>}
           {passSuccess && <div className="bg-green-50 text-green-700 p-3 rounded-xl text-sm mb-4 border border-green-200">Password changed successfully.</div>}

           <form onSubmit={handlePasswordUpdate} className="space-y-4">
             <div>
                <input
                  type="password"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-[var(--color-warmbeige)] focus:ring-2 focus:ring-[var(--color-softblue)] focus:border-transparent outline-none transition-all placeholder:text-gray-400 bg-gray-50/50"
                  placeholder="Current Password"
                  value={passwords.oldPassword}
                  onChange={(e) => setPasswords({...passwords, oldPassword: e.target.value})}
                />
             </div>
             <div>
                <input
                  type="password"
                  required
                  minLength={6}
                  className="w-full px-4 py-3 rounded-xl border border-[var(--color-warmbeige)] focus:ring-2 focus:ring-[var(--color-softblue)] focus:border-transparent outline-none transition-all placeholder:text-gray-400 bg-gray-50/50"
                  placeholder="New Password (min 6 chars)"
                  value={passwords.newPassword}
                  onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})}
                />
             </div>
             <div>
                <input
                  type="password"
                  required
                  minLength={6}
                  className="w-full px-4 py-3 rounded-xl border border-[var(--color-warmbeige)] focus:ring-2 focus:ring-[var(--color-softblue)] focus:border-transparent outline-none transition-all placeholder:text-gray-400 bg-gray-50/50"
                  placeholder="Confirm New Password"
                  value={passwords.confirmPassword}
                  onChange={(e) => setPasswords({...passwords, confirmPassword: e.target.value})}
                />
             </div>
             <button
                type="submit"
                disabled={passLoading}
                className="w-full bg-[var(--color-lightsky)] hover:bg-[var(--color-softblue)] hover:text-white text-[var(--color-steelblue)] font-bold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {passLoading && <Loader2 className="animate-spin" size={20} />}
                Update Password
              </button>
           </form>
        </div>

      </div>
    </div>
  );
};

export default Settings;
