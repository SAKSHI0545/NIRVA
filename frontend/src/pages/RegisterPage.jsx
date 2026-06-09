import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import AuthShell from '../components/AuthShell';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      await register(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Unable to create account');
    }
  };

  return (
    <AuthShell
      title="Create your account"
      subtitle="Start a secure local wellness profile for journaling, reflection, and emotional trends."
      footer={
        <>
          Already registered?{' '}
          <Link className="font-bold text-ink transition hover:text-sage" to="/login">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-4">
        <label className="block">
          <span className="label">Username</span>
          <input
            className="field mt-1"
            value={form.username}
            onChange={(event) => setForm({ ...form, username: event.target.value })}
            required
          />
        </label>
        <label className="block">
          <span className="label">Email</span>
          <input
            className="field mt-1"
            type="email"
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
            required
          />
        </label>
        <label className="block">
          <span className="label">Password</span>
          <input
            className="field mt-1"
            type="password"
            minLength={8}
            value={form.password}
            onChange={(event) => setForm({ ...form, password: event.target.value })}
            required
          />
        </label>
        {error ? <p className="rounded-lg bg-coral/20 px-3 py-2 text-sm font-medium text-coral">{error}</p> : null}
        <Button type="submit" className="w-full">
          <UserPlus size={18} />
          Create account
        </Button>
      </form>
    </AuthShell>
  );
}
