/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Rwandan ground and altitude, not screen neon.
        basalt: '#0B0F0E', // volcanic near-black, faint green cast
        soil: '#15100C', // warm panel dark
        laterite: '#C05B36', // red earth
        amber: '#E0A34B', // high sun
        mist: '#9FB3AD', // altitude haze — the one cool tone
        ceramic: '#E8E3D4', // the logo's own material, primary text
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'system-ui', 'sans-serif'],
        sans: ['"Instrument Sans"', 'system-ui', 'sans-serif'],
        mono: ['"Spline Sans Mono"', 'ui-monospace', 'monospace'],
      },
      letterSpacing: {
        survey: '0.22em',
      },
    },
  },
  plugins: [],
}
