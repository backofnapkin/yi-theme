import React from 'react';

const ActionButtons = ({ copyToClipboard, downloadTxtFile }) => {
  return (
    <div className="action-buttons flex flex-wrap gap-4 mt-6">
      <button
        onClick={copyToClipboard}
        className="inline-flex items-center bg-gradient-to-br from-green-50 to-emerald-50 text-gray-700 font-bold py-2 px-6 rounded transition-colors border border-emerald-200 hover:border-emerald-300"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
          <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
        </svg>
        Copy Results
      </button>
      
      <button
        onClick={downloadTxtFile}
        className="inline-flex items-center bg-gray-100 text-gray-700 font-bold py-2 px-6 rounded transition-colors border border-gray-300 hover:bg-gray-200"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
        Download TXT
      </button>
    </div>
  );
};

export default ActionButtons;