import React from 'react';
import { AlertTriangle, Check } from 'lucide-react';

const Disclaimer = () => {
  return (
    <div className="bg-gradient-to-br from-orange-100 to-amber-100 border border-amber-200 p-6 rounded-lg shadow-md">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="h-5 w-5 text-gray-700" />
        <h2 className="text-xl font-semibold text-gray-900">Important Disclaimer</h2>
      </div>
      
      <div className="space-y-4 text-gray-700">
        <div className="flex items-start gap-3">
          <Check className="h-5 w-5 mt-1 text-blue-600 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-gray-900">Investment Risk</h3>
            <p>
              Bitcoin prices are highly volatile and could fluctuate significantly or lose the majority of value overnight.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Check className="h-5 w-5 mt-1 text-purple-600 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-gray-900">Regulatory Considerations</h3>
            <p>
              Various factors, including government regulations, could impact Bitcoin's legal status and value.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Check className="h-5 w-5 mt-1 text-green-600 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-gray-900">Professional Advice</h3>
            <p>
              These projections are for entertainment purposes only. Always consult a certified financial advisor before making any investment decisions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Disclaimer;