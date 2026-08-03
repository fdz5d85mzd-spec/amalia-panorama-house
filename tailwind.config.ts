import type { Config } from 'tailwindcss';

/**
 * AMALIA PANORAMA HOUSE — design tokens
 *
 * Palette is drawn from the property itself, not a generic template:
 * the stone of a 150-year-old Cypriot house, the Troodos wine country
 * it overlooks, the olive terraces on the hillside, and the dusk sky
 * seen from the veranda.
 */
const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        limestone: {
          DEFAULT: '#EDE6D6',
          50: '#F8F5EE',
          100: '#EDE6D6',
          200: '#DCD1B8',
          300: '#C7B999',
        },
        ink: {
          DEFAULT: '#2A241E',
          soft: '#4A4238',
        },
        copper: {
          DEFAULT: '#A85A2E',
          dark: '#7E4322',
          light: '#C97A46',
        },
        wine: {
          DEFAULT: '#5C1F2E',
          deep: '#3D1420',
        },
        olive: {
          DEFAULT: '#6B7353',
          light: '#8B916E',
        },
        dusk: {
          DEFAULT: '#8CA3B8',
          deep: '#3B4B5C',
        },
        felt: {
          900: '#0B2E1F',
          800: '#123D29',
          700: '#194C33',
          600: '#215B3D',
          line: '#2E6B47',
        },
      },
      fontFamily: {
        display: ['var(--font-fraunces)', 'serif'],
        body: ['var(--font-karla)', 'sans-serif'],
        mono: ['var(--font-space-mono)', 'monospace'],
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1.5rem',
          sm: '2rem',
          lg: '4rem',
          xl: '5rem',
        },
      },
      letterSpacing: {
        widest2: '0.25em',
      },
    },
  },
  plugins: [],
};

export default config;
