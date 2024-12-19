import React from 'react';
import { useDentalContext } from './DentalContext';

export const BasicInfo = () => {
  const { state, updateBasicInfo } = useDentalContext();
  const { basicInfo } = state;

  return (
    <div className="bg-skin-card p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-skin-base mb-6">Basic Information</h2>
      
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
            type="number"
            value={basicInfo.revenuePerPatient}
            onChange={(e) => updateBasicInfo('revenuePerPatient', Number(e.target.value))}
            className="mt-1 block w-full rounded-md border-skin-base shadow-sm focus:border-custom-active focus:ring-custom-active"
            min={0}
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
            type="number"
            value={basicInfo.startupCosts}
            onChange={(e) => updateBasicInfo('startupCosts', Number(e.target.value))}
            className="mt-1 block w-full rounded-md border-skin-base shadow-sm focus:border-custom-active focus:ring-custom-active"
            min={0}
          />
        </div>
      </div>
    </div>
  );
};
