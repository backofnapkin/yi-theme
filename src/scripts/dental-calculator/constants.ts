export const defaultEmployees = [
  { title: 'Dentist', monthlySalary: 19141 },
  { title: 'Hygienist', monthlySalary: 8164.80 },
  { title: 'Certified Dental Assistant', monthlySalary: 4160 },
  { title: 'Administrative Staff', monthlySalary: 3360 }
];

export const defaultOverhead = [
  { name: 'Monthly Lease/Mortgage', monthlyAmount: 5000 },
  { name: 'Utilities', monthlyAmount: 800 },
  { name: 'Supplies', monthlyAmount: 2000 },
  { name: 'Marketing Budget', monthlyAmount: 3500 },
  { name: 'Monthly Loan Repayment', monthlyAmount: 5000 }
];

export const scenarioDetails = {
  current: [
    'Based on current inputs and operational parameters',
    'Standard market conditions',
    'Current patient volume levels'
  ],
  best: [
    'Additional 2 patients per chair per day',
    'Operating 6 days per week (if possible)',
    'Maximum capacity utilization'
  ],
  worst: [
    '25% reduction in patient volume',
    '25% reduction in revenue per patient',
    'Conservative market estimates'
  ]
};
