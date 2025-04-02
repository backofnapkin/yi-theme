import React from 'react';
import ProgressIndicator from './ProgressIndicator';

const CalculatorForm = ({ inputs, handleInputChange, handleSubmit }) => {
  return (
    <form onSubmit={handleSubmit} className="grid gap-6 mb-6">
      <div>
        <label htmlFor="dailyCigarettes" className="block mb-2 font-medium">
          Daily Cigarette Consumption
        </label>
        <div className="space-y-2">
          <div className="flex items-center justify-center mb-1">
            <div className="bg-gray-100 rounded-lg px-4 py-2 font-bold text-2xl text-center">
              {inputs.dailyCigarettes}
            </div>
          </div>
          <input
            type="range"
            id="dailyCigarettes"
            name="dailyCigarettes"
            min="1"
            max="60"
            value={inputs.dailyCigarettes}
            onChange={handleInputChange}
            className="w-full"
          />
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">1</span>
            <span className="text-sm text-gray-500">60</span>
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          How many cigarettes do you smoke per day?
        </p>
      </div>

      <div>
        <label htmlFor="costPerPack" className="block mb-2 font-medium">
          Cost Per Pack
        </label>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">$</span>
          <input
            type="number"
            id="costPerPack"
            name="costPerPack"
            min="1"
            max="30"
            step="0.01"
            value={inputs.costPerPack}
            onChange={handleInputChange}
            className="w-full p-2 pl-7 border rounded"
          />
        </div>
        <p className="text-sm text-gray-500 mt-1">
          How much do you pay for a pack of cigarettes?
        </p>
      </div>

      <div>
        <label htmlFor="cigarettesPerPack" className="block mb-2 font-medium">
          Cigarettes Per Pack
        </label>
        <select
          id="cigarettesPerPack"
          name="cigarettesPerPack"
          value={inputs.cigarettesPerPack}
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
        >
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="25">25</option>
          <option value="30">30</option>
        </select>
        <p className="text-sm text-gray-500 mt-1">
          How many cigarettes are in a pack?
        </p>
      </div>

      <div>
        <label htmlFor="annualReturn" className="block mb-2 font-medium">
          Annual Investment Return Rate
        </label>
        <div className="space-y-2">
          <div className="flex items-center justify-center mb-1">
            <div className="bg-gray-100 rounded-lg px-4 py-2 font-bold text-2xl text-center">
              {inputs.annualReturn}%
            </div>
          </div>
          <input
            type="range"
            id="annualReturn"
            name="annualReturn"
            min="0"
            max="15"
            value={inputs.annualReturn}
            onChange={handleInputChange}
            className="w-full"
          />
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">0%</span>
            <span className="text-sm text-gray-500">15%</span>
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          What annual return rate do you expect on money saved?
        </p>
      </div>

      <div>
        <button
          type="submit"
          className="inline-flex items-center bg-gradient-to-br from-green-50 to-emerald-50 text-gray-700 font-bold py-2 px-6 rounded transition-colors border border-emerald-200 hover:border-emerald-300"
        >
          Calculate Savings Going Up in Smoke
        </button>
      </div>
    </form>
  );
};

export default CalculatorForm;