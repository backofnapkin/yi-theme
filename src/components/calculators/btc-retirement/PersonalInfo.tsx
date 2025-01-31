import React from 'react';
import { User } from 'lucide-react';
import { Tooltip } from './components/Tooltip';

interface PersonalInfoProps {
  currentAge: number;
  lifeExpectancy: number;
  onChange: (currentAge: number, lifeExpectancy: number) => void;
}

// Enhanced age input with improved interaction
const AgeInput: React.FC<{
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  className?: string;
}> = ({ value, onChange, min, max, className = '' }) => {
  const [localValue, setLocalValue] = React.useState(value.toString());

  const handleFocus = () => {
    setLocalValue(''); // Clear the input when focused
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;

    // Allow empty input during typing
    if (input === '') {
      setLocalValue(input);
      return;
    }

    // Only allow whole numbers
    if (!/^\d*$/.test(input)) {
      return;
    }

    // Update local value without enforcing boundaries during typing
    setLocalValue(input);
    const numValue = parseInt(input, 10);
    if (!isNaN(numValue)) {
      onChange(numValue);
    }
  };

  const handleBlur = () => {
    if (localValue === '') {
      // Default to minimum age if empty
      onChange(min);
      setLocalValue(min.toString());
      return;
    }

    const numValue = parseInt(localValue, 10);
    if (!isNaN(numValue)) {
      // Apply boundaries only on blur
      if (numValue < min) {
        onChange(min);
        setLocalValue(min.toString());
      } else if (numValue > max) {
        onChange(max);
        setLocalValue(max.toString());
      } else {
        // Keep the valid number
        setLocalValue(numValue.toString());
        onChange(numValue);
      }
    }
  };

  return (
    <input
      type="text"
      value={localValue}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      className={`mt-1 block w-full px-4 py-2 
        border rounded-lg 
        focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 
        outline-none
        transition-shadow
        ${className}`}
    />
  );
};

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
          <AgeInput
            value={currentAge}
            onChange={(value) => onChange(value, lifeExpectancy)}
            min={18}
            max={100}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 flex items-center">
            Life Expectancy
            <Tooltip content="Enter your expected life span (50-110)" />
          </label>
          <AgeInput
            value={lifeExpectancy}
            onChange={(value) => onChange(currentAge, value)}
            min={50}
            max={110}
          />
        </div>
      </div>
    </div>
  );
};

export default PersonalInfo;