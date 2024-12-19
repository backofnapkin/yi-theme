import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';

type Employee = {
  id: number;
  title: string;
  salary: number;
};

export const EmployeeSection = () => {
  const [employees, setEmployees] = useState<Employee[]>([
    { id: 1, title: 'Dentist', salary: 150000 },
    { id: 2, title: 'Dental Hygienist', salary: 75000 },
    { id: 3, title: 'Dental Assistant', salary: 45000 }
  ]);

  const addEmployee = () => {
    const newId = Math.max(0, ...employees.map(e => e.id)) + 1;
    setEmployees([...employees, { id: newId, title: '', salary: 0 }]);
  };

  const removeEmployee = (id: number) => {
    setEmployees(employees.filter(emp => emp.id !== id));
  };

  const updateEmployee = (id: number, field: 'title' | 'salary', value: string | number) => {
    setEmployees(employees.map(emp => 
      emp.id === id ? { ...emp, [field]: value } : emp
    ));
  };

  return (
    <div className="bg-skin-card p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-skin-base">Employee Wages</h2>
        <button
          onClick={addEmployee}
          className="flex items-center gap-2 px-4 py-2 bg-custom-active text-white rounded-md hover:bg-custom-hover transition-colors"
        >
          <PlusCircle size={20} />
          Add Employee
        </button>
      </div>
      
      <div className="space-y-4">
        {employees.map(employee => (
          <div key={employee.id} className="grid grid-cols-3 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-skin-base">Title</label>
              <input
                type="text"
                value={employee.title}
                onChange={(e) => updateEmployee(employee.id, 'title', e.target.value)}
                className="mt-1 block w-full rounded-md border-skin-base shadow-sm focus:border-custom-active focus:ring-custom-active"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-skin-base">Monthly Salary ($)</label>
              <input
                type="number"
                value={employee.salary}
                onChange={(e) => updateEmployee(employee.id, 'salary', Number(e.target.value))}
                min="0"
                className="mt-1 block w-full rounded-md border-skin-base shadow-sm focus:border-custom-active focus:ring-custom-active"
              />
            </div>
            <button
              onClick={() => removeEmployee(employee.id)}
              className="p-2 text-red-500 hover:text-red-700"
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
