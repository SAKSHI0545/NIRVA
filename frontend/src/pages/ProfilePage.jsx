import PageHeader from '../components/PageHeader';
import { useAuth } from '../context/AuthContext';

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <>
      <PageHeader title="Profile" subtitle="Account identity and platform details." />
      <section className="panel max-w-2xl rounded-2xl p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-slate-200/80 bg-white/78 p-4">
            <p className="label">Username</p>
            <p className="mt-1 font-semibold text-ink">{user?.username}</p>
          </div>
          <div className="rounded-xl border border-slate-200/80 bg-white/78 p-4">
            <p className="label">Email</p>
            <p className="mt-1 font-semibold text-ink">{user?.email}</p>
          </div>
          <div className="rounded-xl border border-slate-200/80 bg-white/78 p-4">
            <p className="label">Created</p>
            <p className="mt-1 font-semibold text-ink">{user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Local account'}</p>
          </div>
        </div>
      </section>
    </>
  );
}
