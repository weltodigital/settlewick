import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Forest & Brass theme - premium British feel
        primary: {
          DEFAULT: '#1B3A2D', // Deep forest green
          light: '#2D5E4A',   // Muted forest (hover states)
        },
        accent: {
          DEFAULT: '#B5985A', // Aged brass/gold (CTAs, highlights)
          light: '#D4C5A0',   // Soft gold (subtle highlights)
        },
        secondary: '#EDE8E0',  // Warm linen (cards, panels)
        background: '#FAFAF6', // Soft cream (main background)
        surface: '#FFFFFF',    // White (cards, modals, inputs)
        text: {
          primary: '#2A2A28',   // Deep charcoal
          secondary: '#6B6560', // Warm grey
          muted: '#9B9590',     // Text muted
        },
        border: '#DDD6CE',
        success: '#27AE60',
        warning: '#D4A03C',
        error: '#C0392B',
        // EPC rating colors
        epc: {
          a: '#00A651',
          b: '#19B459',
          c: '#8FDA04',
          d: '#FFF100',
          e: '#FFC72C',
          f: '#F39200',
          g: '#E60000',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      maxWidth: {
        '8xl': '88rem',
      },
    },
  },
  plugins: [],
}
export default config