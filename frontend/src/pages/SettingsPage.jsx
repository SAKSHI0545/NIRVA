import { useState } from 'react';
import Button from '../components/Button';
import PageHeader from '../components/PageHeader';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { authService } from '../services/authService';

export default function SettingsPage() {
  const { user, updateUser } = useAuth();
  const { theme, setTheme } = useTheme();
  const [profile, setProfile] = useState({ username: user?.username || '', email: user?.email || '' });
  const [passwords, setPasswords] = useState({ current_password: '', new_password: '' });
  const [message, setMessage] = useState('');

  const saveProfile = async (event) => {
    event.preventDefault();
    const updated = await authService.updateProfile(profile);
    updateUser(updated);
    setMessage('Profile updated');
  };

  const changePassword = async (event) => {
    event.preventDefault();
    await authService.changePassword(passwords);
    setPasswords({ current_password: '', new_password: '' });
    setMessage('Password updated');
  };

  return (
    <>
      <PageHeader title="Settings" subtitle="Manage profile, password, theme, and local account preferences." />
      {message ? <p className="mb-4 rounded-lg bg-sage/20 p-3 text-sm font-medium text-sage">{message}</p> : null}

      <div className="grid gap-5 lg:grid-cols-2">
        <section className="panel rounded-2xl p-5">
          <h2 className="text-lg font-bold text-ink">Profile</h2>
          <form onSubmit={saveProfile} className="mt-4 space-y-4">
            <label className="block">
              <span className="label">Username</span>
              <input className="field mt-1" value={profile.username} onChange={(e) => setProfile({ ...profile, username: e.target.value })} />
            </label>
            <label className="block">
              <span className="label">Email</span>
              <input className="field mt-1" type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} />
            </label>
            <Button type="submit">Save profile</Button>
          </form>
        </section>

        <section className="panel rounded-2xl p-5">
          <h2 className="text-lg font-bold text-ink">Security</h2>
          <form onSubmit={changePassword} className="mt-4 space-y-4">
            <label className="block">
              <span className="label">Current password</span>
              <input
                className="field mt-1"
                type="password"
                value={passwords.current_password}
                onChange={(e) => setPasswords({ ...passwords, current_password: e.target.value })}
              />
            </label>
            <label className="block">
              <span className="label">New password</span>
              <input
                className="field mt-1"
                type="password"
                minLength={8}
                value={passwords.new_password}
                onChange={(e) => setPasswords({ ...passwords, new_password: e.target.value })}
              />
            </label>
            <Button type="submit">Change password</Button>
          </form>
        </section>

        <section className="panel rounded-2xl p-5">
          <h2 className="text-lg font-bold text-ink">Theme preferences</h2>
          <div className="mt-4 flex rounded-xl border border-slate-200/80 bg-white p-1">
            {['light', 'rest', 'focus'].map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setTheme(item)}
                className={`flex-1 rounded-lg px-3 py-2 text-sm font-semibold transition ${
                  theme === item ? 'bg-ink text-white shadow-sm' : 'text-slate-500 hover:text-ink'
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </section>

        <section className="panel rounded-2xl p-5">
          <h2 className="text-lg font-bold text-ink">Account</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            This local-development build keeps account deletion and export as future account workflows.
          </p>
        </section>
      </div>
    </>
  );
}
