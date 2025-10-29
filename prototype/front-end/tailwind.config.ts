import type { Config } from 'tailwindcss'

export default {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          500: '#6aa6ff',
          600: '#4d8fff'
        }
      },
      borderRadius: {
        xl: '12px'
      }
    },
  },
  plugins: [],
} satisfies Config


