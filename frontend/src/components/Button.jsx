export default function Button({ children, variant = 'primary', className = '', ...props }) {
  const variants = {
    primary: 'bg-sage text-white shadow-sm shadow-sage/20 hover:bg-sage/95 focus-visible:ring-4 focus-visible:ring-sage/20',
    secondary:
      'border border-slate-200 bg-white text-ink shadow-sm hover:border-sage/50 hover:bg-slate-50 focus-visible:ring-4 focus-visible:ring-sage/15',
    ghost: 'text-slate-700 hover:bg-slate-100 hover:text-ink focus-visible:ring-4 focus-visible:ring-sage/15',
    danger: 'bg-coral text-white shadow-sm shadow-coral/20 hover:bg-coral/95 focus-visible:ring-4 focus-visible:ring-coral/20',
  };

  return (
    <button
      type="button"
      className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold leading-none transition duration-200 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
