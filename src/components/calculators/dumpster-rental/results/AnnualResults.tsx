import React from 'react';
import { CalendarDays } from 'lucide-react';
import type { CalculationResults } from '../types';
import { formatCurrency } from '../utils';
import { Tooltip } from '../../../ui/Tooltip';

interface AnnualResultsProps {
  results: CalculationResults;
}

export function AnnualResults({ results }: AnnualResultsProps) {
  const { annual } = results;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <CalendarDays className="w-6 h-6 text-blue-600" />
        Annual Overview
        <Tooltip content="Yearly financial projections including all revenue streams and expenses">
          <button className="text-gray-400 hover:text-gray-600">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4M12 8h.01" />
            </svg>
          </button>
        </Tooltip>
      </h2>
      
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-2 flex items-center gap-2">
            Revenue
            <Tooltip content="Total annual income from all revenue streams">
              <button className="text-gray-400 hover:text-gray-600">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 16v-4M12 8h.01" />
                </svg>
              </button>
            </Tooltip>
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Dumpster Rentals</span>
              <span className="font-medium">{formatCurrency(annual.revenue.dumpsterRentals)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Junk Removal</span>
              <span className="font-medium">{formatCurrency(annual.revenue.junkRemoval)}</span>
            </div>
            {annual.revenue.additionalServices.map((service, index) => (
              <div key={index} className="flex justify-between">
                <span className="text-gray-600">{service.name}</span>
                <span className="font-medium">{formatCurrency(service.amount)}</span>
              </div>
            ))}
            <div className="flex justify-between pt-2 border-t border-gray-200">
              <span className="font-medium text-gray-900">Total Revenue</span>
              <span className="font-semibold text-skin-emerald-text">{formatCurrency(annual.revenue.total)}</span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-2 flex items-center gap-2">
            Expenses
            <Tooltip content="Total yearly operating costs including maintenance, wages, fuel, marketing, insurance, loan payments, and software">
              <button className="text-gray-400 hover:text-gray-600">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 16v-4M12 8h.01" />
                </svg>
              </button>
            </Tooltip>
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Maintenance</span>
              <span className="font-medium">{formatCurrency(annual.expenses.maintenance)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Wages</span>
              <span className="font-medium">{formatCurrency(annual.expenses.wages)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Fuel</span>
              <span className="font-medium">{formatCurrency(annual.expenses.fuel)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Marketing</span>
              <span className="font-medium">{formatCurrency(annual.expenses.marketing)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Insurance</span>
              <span className="font-medium">{formatCurrency(annual.expenses.insurance)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Loan Payment</span>
              <span className="font-medium">{formatCurrency(annual.expenses.loanPayment)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Software</span>
              <span className="font-medium">{formatCurrency(annual.expenses.software)}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-gray-200">
              <span className="font-medium text-gray-900 flex items-center gap-2">
                Total Expenses
                <Tooltip content="Sum of all yearly operating expenses">
                  <button className="text-gray-400 hover:text-gray-600">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 16v-4M12 8h.01" />
                    </svg>
                  </button>
                </Tooltip>
              </span>
              <span className="font-semibold text-skin-red-text">{formatCurrency(annual.expenses.total)}</span>
            </div>
          </div>
        </div>

        <div className="pt-2 border-t-2 border-gray-200">
          <div className="flex justify-between">
            <span className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              Net Annual Profit
              <Tooltip content="Total yearly revenue minus total yearly expenses">
                <button className="text-gray-400 hover:text-gray-600">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 16v-4M12 8h.01" />
                  </svg>
                </button>
              </Tooltip>
            </span>
            <span className={`text-lg font-bold ${annual.profit >= 0 ? 'text-skin-emerald-text' : 'text-skin-emerald-text'}`}>
              {formatCurrency(annual.profit)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}