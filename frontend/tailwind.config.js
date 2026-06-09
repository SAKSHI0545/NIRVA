/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        display: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
      colors: {
        ink: '#182524',
        mist: '#eef6f1',
        sage: '#4f8f80',
        coral: '#df7962',
        amber: '#efb34f',
        plum: '#7b6695',
        oat: '#fffaf3',
        graphite: '#2f3b3a',
        slate: {
          950: '#0f172a',
          900: '#111827',
        },
      },
      boxShadow: {
        soft: '0 24px 80px rgba(35, 49, 48, 0.12)',
        card: '0 18px 40px rgba(15, 23, 42, 0.08)',
      },
      backgroundImage: {
        'hero-gradient': 'radial-gradient(circle at top left, rgba(79, 143, 128, 0.12), transparent 30%), radial-gradient(circle at bottom right, rgba(223, 121, 98, 0.10), transparent 28%)',
      },
    },
  },
  plugins: [],
};
