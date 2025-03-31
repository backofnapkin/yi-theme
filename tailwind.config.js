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
    './src/pages/**/*.{js,ts,jsx,tsx,astro}',
    './src/styles/index.css' // Added to ensure Tailwind scans index.css
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
    'to-purple-50',
    'to-purple-100',
    'border-emerald-100',
    'border-emerald-200',
    'border-emerald-600', // Made for radio button
    'border-amber-100',
    'border-amber-200',
    // Data visualization colors
    'from-purple-50', // Used for panels
    'from-purple-100', // Used for panels
    'from-slate-200',  // Soft blue-grey for charts
    'from-stone-200',  // Warm grey for charts
    'from-zinc-200',   // Cool grey for charts
    'from-slate-300',  // Deeper blue-grey for charts
    'from-emerald-600', // For line charts - positive trends + radio button
    'from-red-600',     // For line charts - negative trends
    // Theme red colors
    'bg-red-600',      // For button background
    'bg-red-700',      // For hover background
    'border-red-700',  // For button border
    'border-red-800',  // For hover border
    'text-white',      // For X icon color
    'bg-skin-red-light',
    'bg-skin-red-bg',
    'bg-emerald-600', // Made for radio button
    'ring-emerald-600', // Made for radio button
    'border-skin-red-border',
    'border-purple-100', // Border panel color
    'border-purple-200', // Border panel color
    'text-emerald-600', // For 75th
    'text-amber-600',   // For 25th
    'text-orange-600',  // For 5th
    'text-skin-red-text',
    'text-skin-emerald-text', 
    // NEW: Focus ring classes added for InputField component
    'focus:ring-emerald-500',
    'focus:ring-emerald-500/20',
    'focus:ring-emerald-600',
    'focus:ring-emerald-600/20', 
    'focus:border-emerald-500',
    'focus:border-emerald-600',
    'focus:ring-3',
    'focus:outline-none',
    // Patterns for dynamic classes
    {
      pattern: /(border|bg|from|to|text)-(emerald|amber|green|orange|slate|stone|zinc|purple|red|blue)-(50|100|200|300|400|500|600|700|800)/,
      variants: ['hover', 'focus']
    },
    // NEW: Pattern for ring utilities added for focus styles
    {
      pattern: /ring-(emerald|amber|green|orange)-(50|100|200|300|400|500|600|700|800)(\/[0-9]+)?/,
      variants: ['focus']
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
        active: withOpacity("--color-text-active"),
        'red-text': withOpacity("--color-red-text"),  // Added theme red
        'emerald-text': withOpacity("--color-emerald-text")
      },
    },
    backgroundColor: {
      skin: {
        fill: withOpacity("--color-fill"),
        secondary: withOpacity("--color-fill-secondary"),
        card: withOpacity("--color-card"),
        modal: withOpacity("--color-modal"),
        'red-light': withOpacity("--color-red-light"), // Added theme red
        'red-bg': withOpacity("--color-red-bg"),       // Added theme red
        'progress-expense': withOpacity("--color-progress-bar-expense"), // Added for progress bar
        'progress-profit': withOpacity("--color-progress-bar-profit"), // Added for progress bar
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
        'red-border': withOpacity('--color-red-border'), // Added theme red
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
        },
        // NEW: Explicitly defined emerald colors to ensure consistency
        emerald: {
          500: '#10b981', // The exact emerald-500 color
          600: '#059669', // The exact emerald-600 color for focus states
        }
      },
      // NEW: Custom ring opacity for focus states
      ringOpacity: {
        '20': '0.2', // 20% opacity for focus ring
      },
      // NEW: Custom ring width for focus states
      ringWidth: {
        '3': '3px', // 3px ring width to match your original inline styles
      },
    },
  },
  // NEW: Consider adding the forms plugin if you want more consistent form styling
  plugins: [
    // require('@tailwindcss/forms'), // Uncomment if you install this plugin
  ],
}