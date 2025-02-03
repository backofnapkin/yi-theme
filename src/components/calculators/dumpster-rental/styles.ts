/**
 * Shared styles for calculator components using Tailwind CSS classes
 */
export const styles = {
    input: {
      base: 'w-full px-4 py-2 border rounded-lg focus:ring-2 transition-colors',
      default: 'border-gray-300 focus:border-blue-500 focus:ring-blue-200',
      disabled: 'bg-gray-100 cursor-not-allowed',
      error: 'border-red-300 focus:border-red-500 focus:ring-red-200',
    },
    button: {
      base: 'px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
      primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
      secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-500',
      disabled: 'opacity-50 cursor-not-allowed',
    },
    container: {
      base: 'bg-white rounded-lg shadow-md overflow-hidden',
      border: 'border border-gray-200',
      padding: 'p-6',
    },
    table: {
      base: 'min-w-full divide-y divide-gray-200',
      header: 'px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
      cell: 'px-4 py-3 text-sm text-gray-900',
      row: 'hover:bg-gray-50',
    },
  };