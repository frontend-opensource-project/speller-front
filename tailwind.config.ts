/* eslint-disable @typescript-eslint/no-require-imports */
import type { Config } from 'tailwindcss'

export const TABLET = 726
export const DESKTOP = 1024
export const LARGE_DESKTOP = 1377

export default {
  darkMode: ['class'],
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    screens: {
      tab: `${TABLET}px`,
      pc: `${DESKTOP}px`,
      ['pc-lg']: `${LARGE_DESKTOP}px`,
    },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      white: '#ffffff',
      black: '#000000',
      slate: {
        100: '#F3F4F9',
        200: '#E9EAF2',
        300: '#B8B8BE',
        400: '#8C8B94',
        500: '#646468',
        600: '#292933',
      },
      blue: {
        100: '#C3CAFF',
        200: '#A4AEFF',
        300: '#6A7DFF',
        400: '#495EFF',
        500: '#3046EC',
      },
      red: {
        100: '#EE335C',
      },
      purple: {
        100: '#A02BEE',
      },
      green: {
        100: '#009666',
      },
    },
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      backgroundImage: {
        'chevron-down': "url('/icon/chevron-down.svg')",
        'icon-circle-arrow': "url('/icon/icon-circle-arrow.svg')",
        'icon-history-back': "url('/icon/icon-history-back.svg')",
        'icon-history-back-white': "url('/icon/icon-history-back-w.svg')",
        'icon-info': "url('/icon/icon-info.svg')",
        'icon-info-white': "url('/icon/icon-info-w.svg')",
        'icon-menu': "url('/icon/icon-menu.svg')",
        'icon-pencil': "url('/icon/icon-pencil.svg')",
        'icon-question': "url('/icon/icon-question.svg')",
        'icon-question-white': "url('/icon/icon-question-w.svg')",
        'icon-send': "url('/icon/icon-send.svg')",
        close: "url('/close.svg')",
      },
      fontFamily: {
        pretendard: ['var(--font-pretendard)'],
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    require('@tailwindcss/container-queries'),
  ],
} satisfies Config
