import React from 'react';

interface RadioButtonProps {
  id: string;
  name: string;
  value: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
  showLabel?: boolean;
}

export function RadioButton({
  id,
  name,
  value,
  checked,
  onChange,
  label = '',
  disabled = false,
  className = '',
  showLabel = true
}: RadioButtonProps) {
  return (
    <div className={`mt-1 space-y-2 ${className}`}>
      <style>
        {`
          input[type="radio"] {
            -webkit-appearance: none;
            appearance: none;
            width: 20px;
            height: 20px;
            border: 2px solid rgb(229, 231, 235); /* gray-200 */
            border-radius: 50%;
            outline: none;
            cursor: pointer;
            position: relative;
            margin-right: 8px;
          }

          input[type="radio"]:checked {
            border-color: rgb(5, 150, 105); /* emerald-600 */
            background-color: rgb(5, 150, 105); /* emerald-600 */
            box-shadow: inset 0 0 0 4px white;
          }

          input[type="radio"]:focus {
            outline: none;
            border-color: rgb(5, 150, 105); /* emerald-600 */
          }

          input[type="radio"]:disabled {
            cursor: not-allowed;
            opacity: 0.6;
            border-color: rgb(229, 231, 235); /* gray-200 */
          }

          input[type="radio"]:disabled:checked {
            background-color: rgb(229, 231, 235); /* gray-200 */
            box-shadow: inset 0 0 0 4px white;
          }
        `}
      </style>
      <div className="flex items-center">
        <input
          type="radio"
          id={id}
          name={name}
          value={value}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="cursor-pointer"
        />
        {showLabel && label && (
          <label 
            htmlFor={id} 
            className={`cursor-pointer select-none ${
              disabled ? 'text-gray-400' : 'text-gray-900'
            }`}
          >
            {label}
          </label>
        )}
      </div>
    </div>
  );
}