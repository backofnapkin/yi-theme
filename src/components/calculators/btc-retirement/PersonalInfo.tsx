import React from 'react';
import { User } from 'lucide-react';
import { Tooltip } from './components/Tooltip';

interface PersonalInfoProps {
  currentAge: number;
  lifeExpectancy: number;
  onChange: (currentAge: number, lifeExpectancy: number) => void;
}

const PersonalInfo: React.FC<PersonalInfoProps> = ({
  currentAge,
  lifeExpectancy,
  onChange,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <User className="h-6 w-6 text-gray-700" />
        <h2 className="text-xl font-semibold">Personal Information</h2>
        <Tooltip content="Enter your age details for retirement planning" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 flex items-center">
            Current Age
            <Tooltip content="Enter your current age (18-100)" />
          </label>
          <input
            type="number"
            min="18"
            max="100"
            value={currentAge}
            onChange={(e) => onChange(parseInt(e.target.value) || 18, lifeExpectancy)}
            className="mt-1 block w-full px-4 py-2 
                     border rounded-lg 
                     focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 
                     outline-none
                     transition-shadow"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 flex items-center">
            Life Expectancy
            <Tooltip content="Enter your expected life span (50-110)" />
          </label>
          <input
            type="number"
            min="50"
            max="110"
            value={lifeExpectancy}
            onChange={(e) => onChange(currentAge, parseInt(e.target.value) || 50)}
            className="mt-1 block w-full px-4 py-2 
                     border rounded-lg 
                     focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 
                     outline-none
                     transition-shadow"
          />
        </div>
      </div>
    </div>
  );
};

export default PersonalInfo;