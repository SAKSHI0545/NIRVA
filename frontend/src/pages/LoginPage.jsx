import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import AuthShell from '../components/AuthShell';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      await login(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Unable to sign in');
    }
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to continue your private mood, journal, and insight workspace."
      footer={
        <>
          New here?{' '}
          <Link className="font-bold text-ink transition hover:text-sage" to="/register">
            Create account
          </Link>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-4">
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
            value={form.password}
            onChange={(event) => setForm({ ...form, password: event.target.value })}
            required
          />
        </label>
        {error ? <p className="rounded-lg bg-coral/20 px-3 py-2 text-sm font-medium text-coral">{error}</p> : null}
        <Button type="submit" className="w-full">
          <LogIn size={18} />
          Sign in
        </Button>
      </form>
    </AuthShell>
  );
}
