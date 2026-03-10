/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: '#FFF8F2',
          dark: '#FFF0E6',
        },
        yellow: {
          DEFAULT: '#F4C25A',
          dark: '#E5B34C',
          light: '#F9D78A',
        },
        blue: {
          DEFAULT: '#2F79A0',
          dark: '#25668A',
          light: '#4A9BC4',
        },
        text: {
          DEFAULT: '#1C1C1C',
          light: '#6A6A6A',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Baloo 2', 'cursive'],
        serif: ['Playfair Display', 'serif'],
      },
      boxShadow: {
        'soft': '0 8px 30px rgba(45, 44, 50, 0.06)',
        'card': '0 4px 20px rgba(45, 44, 50, 0.08)',
        'hover': '0 12px 40px rgba(45, 44, 50, 0.12)',
      },
      borderRadius: {
        'xl': '14px',
        '2xl': '18px',
        '3xl': '24px',
      },
    },
  },
  plugins: [],
}
