import React, { useState } from 'react';
import { Info } from 'lucide-react';
import { useDentalContext } from './DentalContext';
import { formatNumber, parseFormattedNumber } from '../../../scripts/dental-calculator/formatters';

export const BasicInfo = () => {
  const { state, updateBasicInfo } = useDentalContext();
  const { basicInfo } = state;
  const [showInfo, setShowInfo] = useState(false);

  const handleNumberInput = (field: keyof typeof basicInfo, value: string) => {
    const numberValue = parseFormattedNumber(value);
    updateBasicInfo(field, numberValue);
  };

  return (
    <div className="bg-skin-card p-6 rounded-lg shadow-md">
      <div className="flex items-center gap-2 mb-6">
        <h2 className="text-2xl font-bold text-skin-base">Basic Information</h2>
        <button
          onClick={() => setShowInfo(!showInfo)}
          className="p-1 text-skin-base hover:text-skin-active transition-colors"
          aria-label="Information about basic practice information"
        >
          <Info size={20} />
        </button>
      </div>

      {showInfo && (
        <div className="mb-6 p-4 rounded-lg bg-skin-fill border border-skin-border">
          <ul className="space-y-2 text-sm text-skin-base">
            <li><strong>Practice Name:</strong> Enter your dental practice's legal or DBA name.</li>
            <li><strong>Number of Dental Chairs:</strong> Include all operational chairs/operatories planned for patient care (typical range: 4-12 chairs).</li>
            <li><strong>Patients per Chair per Day:</strong> Average number of patients you expect to treat per chair daily (typical range: 6-10 patients).</li>
            <li><strong>Average Revenue per Patient:</strong> Expected average revenue per patient visit per year, including all services and procedures (typical range: $300-800).</li>
            <li><strong>Days Open per Week:</strong> Planned operating days (most practices operate 4-5 days/week).</li>
            <li><strong>Total Startup Costs:</strong> Include all initial expenses: equipment, renovations, licenses, supplies, and working capital (typical range: $500,000-$800,000).</li>
          </ul>
        </div>
      )}
      
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-skin-base">Practice Name</label>
          <input
            type="text"
            value={basicInfo.practiceName}
            onChange={(e) => updateBasicInfo('practiceName', e.target.value)}
            className="mt-1 block w-full rounded-md border-skin-base shadow-sm focus:border-custom-active focus:ring-custom-active"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-skin-base">Number of Dental Chairs</label>
          <input
            type="number"
            value={basicInfo.dentalChairs}
            onChange={(e) => updateBasicInfo('dentalChairs', Number(e.target.value))}
            className="mt-1 block w-full rounded-md border-skin-base shadow-sm focus:border-custom-active focus:ring-custom-active"
            min={1}
            max={99}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-skin-base">Patients per Chair per Day</label>
          <input
            type="number"
            value={basicInfo.patientsPerChair}
            onChange={(e) => updateBasicInfo('patientsPerChair', Number(e.target.value))}
            className="mt-1 block w-full rounded-md border-skin-base shadow-sm focus:border-custom-active focus:ring-custom-active"
            min={1}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-skin-base">Revenue per Patient ($)</label>
          <input
            type="text"
            value={formatNumber(basicInfo.revenuePerPatient)}
            onChange={(e) => handleNumberInput('revenuePerPatient', e.target.value)}
            className="mt-1 block w-full rounded-md border-skin-base shadow-sm focus:border-custom-active focus:ring-custom-active"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-skin-base">Days Open per Week</label>
          <input
            type="number"
            value={basicInfo.daysPerWeek}
            onChange={(e) => updateBasicInfo('daysPerWeek', Number(e.target.value))}
            className="mt-1 block w-full rounded-md border-skin-base shadow-sm focus:border-custom-active focus:ring-custom-active"
            min={1}
            max={7}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-skin-base">Total Startup Costs ($)</label>
          <input
            type="text"
            value={formatNumber(basicInfo.startupCosts)}
            onChange={(e) => handleNumberInput('startupCosts', e.target.value)}
            className="mt-1 block w-full rounded-md border-skin-base shadow-sm focus:border-custom-active focus:ring-custom-active"
          />
        </div>
      </div>
    </div>
  );
};

export default BasicInfo;
