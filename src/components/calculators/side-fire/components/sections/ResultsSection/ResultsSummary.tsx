import React from 'react';
import { Card } from '../../ui/Card';
import { formatCurrency } from '../../../utils/calculations';
import type { CalculationResults, CalculatorInputs } from '../../../types';

interface ResultsSummaryProps {
  results: CalculationResults;
  inputs: CalculatorInputs;
}

export function ResultsSummary({ results, inputs }: ResultsSummaryProps) {
  return (
    <Card className="bg-gradient-to-br from-green-50 to-emerald-50">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        Your FIRE Journey Summary
      </h2>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-500">FIRE Goal</h3>
          <p className="text-2xl font-bold text-gray-900">
            {formatCurrency(inputs.totalInvestedAssetsGoal)}
          </p>
          <p className="text-sm text-gray-600">
            Target investment portfolio
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-500">FIRE Age</h3>
          <p className="text-2xl font-bold text-green-600">
            {results.fireAge} years old
          </p>
          <p className="text-sm text-gray-600">
            When you'll reach your goal
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-500">Without Side Hustle</h3>
          <p className="text-2xl font-bold text-gray-900">
            {results.fireAgeWithoutSideHustle} years old
          </p>
          <p className="text-sm text-gray-600">
            FIRE age with main job only
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-500">Time Saved</h3>
          <p className="text-2xl font-bold text-green-600">
            {results.yearsSaved}y {results.monthsSaved}m
          </p>
          <p className="text-sm text-gray-600">
            Years and months accelerated
          </p>
        </div>
      </div>

      <div className="mt-6 p-4 bg-white rounded-lg border border-green-100">
        <p className="text-sm text-gray-600">
          Your side hustle income will help you reach financial independence{' '}
          <span className="font-medium text-green-600">
            {results.yearsSaved} years and {results.monthsSaved} months sooner
          </span>{' '}
          than with your main job alone.
        </p>
      </div>
    </Card>
  );
}