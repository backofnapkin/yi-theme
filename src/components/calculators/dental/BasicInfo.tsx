import React from 'react';

export const BasicInfo = () => {
  return (
    <div className="bg-skin-card p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-skin-base mb-6">Basic Information</h2>
      
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-skin-base">Practice Name</label>
          <input
            type="text"
            id="practice-name"
            className="mt-1 block w-full rounded-md border-skin-base shadow-sm focus:border-custom-active focus:ring-custom-active"
            defaultValue="Dave's Dental Office"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-skin-base">Number of Dental Chairs</label>
          <input
            type="number"
            id="dental-chairs"
            className="mt-1 block w-full rounded-md border-skin-base shadow-sm focus:border-custom-active focus:ring-custom-active"
            defaultValue={2}
            min={1}
            max={99}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-skin-base">Patients per Chair per Day</label>
          <input
            type="number"
            id="patients-per-chair"
            className="mt-1 block w-full rounded-md border-skin-base shadow-sm focus:border-custom-active focus:ring-custom-active"
            defaultValue={10}
            min={1}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-skin-base">Revenue per Patient ($)</label>
          <input
            type="number"
            id="revenue-per-patient"
            className="mt-1 block w-full rounded-md border-skin-base shadow-sm focus:border-custom-active focus:ring-custom-active"
            defaultValue={432}
            min={0}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-skin-base">Days Open per Week</label>
          <input
            type="number"
            id="days-per-week"
            className="mt-1 block w-full rounded-md border-skin-base shadow-sm focus:border-custom-active focus:ring-custom-active"
            defaultValue={5}
            min={1}
            max={7}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-skin-base">Total Startup Costs ($)</label>
          <input
            type="number"
            id="startup-costs"
            className="mt-1 block w-full rounded-md border-skin-base shadow-sm focus:border-custom-active focus:ring-custom-active"
            defaultValue={500000}
            min={0}
          />
        </div>
      </div>
    </div>
  );
};
