/** @type {import('tailwindcss').Config} */
function withOpacity(variableName) {
  return ({ opacityValue }) => {
    if (opacityValue !== undefined) {
      return `rgba(var(${variableName}), ${opacityValue})`;
    }
    return `rgb(var(${variableName}))`;
  };
}

export default {
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/pages/**/*.{js,ts,jsx,tsx,astro}'
  ],
  safelist: [
    // Base utility classes
    'bg-gradient-to-br',
    'bg-gradient-to-r',
    'border',
    'border-solid',
    // Explicit color classes
    'from-green-50',
    'from-green-100',
    'from-emerald-50',
    'from-emerald-100',
    'from-orange-50',
    'from-orange-100',
    'from-amber-50',
    'from-amber-100',
    'to-emerald-50',
    'to-emerald-100',
    'to-amber-50',
    'to-amber-100',
    'border-emerald-100',
    'border-emerald-200',
    'border-amber-100',
    'border-amber-200',
    // Patterns for dynamic classes
    {
      pattern: /(border|bg|from|to)-(emerald|amber|green|orange)-(50|100|200)/,
      variants: ['hover', 'focus']
    }
  ],
  darkmode: "class",
  theme: {
    screens: {
      'sm': '600px',
      'md': '720px',
      'lg': '840px',
      'xl': '960px',
      '2xl': '1080px',
    },
    container: {
      center: true,
    },
    textColor: {
      skin: {
        base: withOpacity("--color-text"),
        active: withOpacity("--color-text-active")
      },
    },
    backgroundColor: {
      skin: {
        fill: withOpacity("--color-fill"),
        secondary: withOpacity("--color-fill-secondary"),
        card: withOpacity("--color-card"),
        modal: withOpacity("--color-modal"),
      },
    },
    textDecorationColor: {
      skin: {
        base: withOpacity("--color-border"),
        active: withOpacity("--color-text-active")
      }
    },
    borderColor: {
      skin: {
        normal: withOpacity('--color-text'),
        base: withOpacity('--color-border'),
      },
    },
    extend: {
      colors: {
        custom: {
          title: '#555',
          subtitle: "#999",
          hover: "#e0a419",
          active: "#ff7f50",
          grey: "#f6f6f6",
          nav: "#ded6d8",
          primary: "#edede9",
          second: "#d6ccc2",
          third: "#f5ebe0",
          forth: "#e3d5ca",
          fifth: "#d5bdaf"
        }
      }
    },
  },
  plugins: [],
}