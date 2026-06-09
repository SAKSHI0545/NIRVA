import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { BarChart3, Bot, Home, LogOut, Music, PenLine, Settings, User, UsersRound, Waves } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: Home },
  { to: '/journal', label: 'Journal', icon: PenLine },
  { to: '/community', label: 'Community', icon: UsersRound },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/chat', label: 'Chat', icon: Bot },
  { to: '/music', label: 'Music', icon: Music },
  { to: '/profile', label: 'Profile', icon: User },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export default function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen surface">
      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-slate-200 bg-white/98 p-5 shadow-soft backdrop-blur-2xl lg:block">
        <div className="mb-8 rounded-[2rem] bg-gradient-to-br from-sage to-sage/80 p-6 shadow-soft shadow-sage/30 text-white">
          <div className="flex items-center gap-4">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/20 text-white shadow-sm">
              <Waves size={22} />
            </span>
            <div>
              <p className="text-2xl font-semibold tracking-tight">NIRVA</p>
              <p className="mt-1 text-sm font-medium text-white/80">Wellness operating space</p>
            </div>
          </div>
        </div>

        <nav className="space-y-2">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition duration-200 ${
                  isActive
                    ? 'bg-sage text-white shadow-sm shadow-sage/20'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-ink'
                }`
              }
            >
              <Icon size={18} strokeWidth={2.2} />
              {label}
            </NavLink>
          ))}
        </nav>

        <button
          type="button"
          onClick={handleLogout}
          className="absolute bottom-5 left-5 right-5 flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600 shadow-sm transition hover:border-coral/30 hover:text-coral"
        >
          <LogOut size={18} />
          Logout
        </button>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-10 border-b border-white/80 bg-white/78 px-4 py-3 backdrop-blur-2xl sm:px-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Current workspace</p>
              <p className="mt-0.5 font-semibold text-ink">{user?.username}</p>
            </div>
            <div className="flex gap-2 overflow-x-auto lg:hidden">
              {navItems.slice(0, 5).map(({ to, icon: Icon, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  aria-label={label}
                  className={({ isActive }) =>
                    `grid h-10 w-10 shrink-0 place-items-center rounded-xl transition ${
                      isActive ? 'bg-ink text-white shadow-sm' : 'bg-white text-slate-600'
                    }`
                  }
                >
                  <Icon size={18} />
                </NavLink>
              ))}
            </div>
          </div>
        </header>
        <main className="mx-auto max-w-7xl px-4 py-7 sm:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
