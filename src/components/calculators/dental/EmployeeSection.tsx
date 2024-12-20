import React, { useState } from 'react';
import { useDentalContext } from './DentalContext';
import { PlusCircle, ListPlus, Info } from 'lucide-react';

export const EmployeeSection = () => {
  const { state, addEmployee, updateEmployee, removeEmployee } = useDentalContext();
  const { employees } = state;
  const [showInfo, setShowInfo] = useState(false);

  const commonEmployees = [
    { title: "Dentist", salary: 19141 },
    { title: "Certified Dental Assistant", salary: 4160 },
    { title: "Hygienist", salary: 8164 },
    { title: "Receptionist", salary: 3360 }
  ];

  const addCommonEmployees = () => {
    commonEmployees.forEach(emp => {
      addEmployee();
      const newEmployeeId = state.employees[state.employees.length - 1].id;
      updateEmployee(newEmployeeId, 'title', emp.title);
      updateEmployee(newEmployeeId, 'salary', emp.salary);
    });
  };

  return (
    <div className="bg-skin-card p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold text-skin-base">Employee Wages</h2>
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="p-1 text-skin-base hover:text-skin-active transition-colors"
            aria-label="Information about employee wages section"
          >
            <Info size={20} />
          </button>
        </div>
        <div className="flex gap-2">
          <button
            onClick={addCommonEmployees}
            className="flex items-center gap-2 px-4 py-2 bg-custom-active text-white rounded-md hover:bg-custom-hover transition-colors"
          >
            <ListPlus size={20} />
            Add Common Roles
          </button>
          <button
            onClick={addEmployee}
            className="flex items-center gap-2 px-4 py-2 bg-custom-active text-white rounded-md hover:bg-custom-hover transition-colors"
          >
            <PlusCircle size={20} />
            Add Employee
          </button>
        </div>
      </div>

      {showInfo && (
        <div className="mb-4 p-4 rounded-lg bg-skin-fill border border-skin-border">
          <p className="text-sm text-skin-base">
            Enter each employee role you plan to hire and monthly salary.
          </p>
        </div>
      )}
      
      <div className="space-y-4">
        {employees.map(employee => (
          <div key={employee.id} className="grid grid-cols-3 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-skin-base">Title</label>
              <input
                type="text"
                value={employee.title}
                onChange={(e) => updateEmployee(employee.id, 'title', e.target.value)}
                className={`mt-1 block w-full rounded-md border-skin-base shadow-sm focus:border-custom-active focus:ring-custom-active 
                  ${commonEmployees.some(e => e.title === employee.title) ? 'bg-skin-card/50' : ''}`}
                placeholder="Enter title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-skin-base">Monthly Salary ($)</label>
              <input
                type="number"
                value={employee.salary}
                onChange={(e) => updateEmployee(employee.id, 'salary', Number(e.target.value))}
                min="0"
                step="100"
                className={`mt-1 block w-full rounded-md border-skin-base shadow-sm focus:border-custom-active focus:ring-custom-active
                  ${commonEmployees.some(e => e.salary === employee.salary) ? 'bg-skin-card/50' : ''}`}
              />
            </div>
            <button
              onClick={() => removeEmployee(employee.id)}
              className="p-2 text-red-500 hover:text-red-700"
              aria-label="Remove employee"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
