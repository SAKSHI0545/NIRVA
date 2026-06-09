import { Link } from 'react-router-dom';
import Button from '../components/Button';

export default function NotFoundPage() {
  return (
    <main className="grid min-h-screen place-items-center surface px-4">
      <section className="panel max-w-md rounded-2xl p-7 text-center">
        <p className="text-5xl font-bold text-ink">404</p>
        <p className="mt-3 text-sm leading-6 text-slate-500">This page does not exist in the NIRVA workspace.</p>
        <Link className="mt-5 inline-block" to="/dashboard">
          <Button>Back to dashboard</Button>
        </Link>
      </section>
    </main>
  );
}
