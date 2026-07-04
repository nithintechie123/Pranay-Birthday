/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 60px rgba(255, 215, 128, 0.36)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-18px)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        pop: {
          '0%': { transform: 'scale(0.94)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        drift: {
          '0%': { transform: 'translate3d(0, 0, 0) rotate(0deg)' },
          '100%': { transform: 'translate3d(32px, -44px, 0) rotate(12deg)' },
        },
      },
      animation: {
        float: 'float 5s ease-in-out infinite',
        shimmer: 'shimmer 2.7s ease-in-out infinite',
        pop: 'pop 700ms cubic-bezier(.2,.7,.3,1) both',
        drift: 'drift 6s ease-in-out infinite alternate',
      },
    },
  },
  plugins: [],
};
