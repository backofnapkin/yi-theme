import React, { createContext, useContext, useState } from 'react';

// Define our types
type BasicInfo = {
  practiceName: string;
  dentalChairs: number;
  patientsPerChair: number;
  revenuePerPatient: number;
  daysPerWeek: number;
  startupCosts: number;
};

type Employee = {
  id: number;
  title: string;
  salary: number;
};

type OverheadCost = {
  id: number;
  name: string;
  amount: number;
};

type CalculatorState = {
  basicInfo: BasicInfo;
  employees: Employee[];
  overhead: OverheadCost[];
};

// Create the context with default values
type DentalContextType = {
  state: CalculatorState;
  updateBasicInfo: (field: keyof BasicInfo, value: string | number) => void;
  addEmployee: () => void;
  updateEmployee: (id: number, field: keyof Employee, value: string | number) => void;
  removeEmployee: (id: number) => void;
  addOverheadCost: () => void;
  updateOverheadCost: (id: number, field: keyof OverheadCost, value: string | number) => void;
  removeOverheadCost: (id: number) => void;
};

const DentalContext = createContext<DentalContextType | undefined>(undefined);

// Create the provider component
export const DentalProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<CalculatorState>({
    basicInfo: {
      practiceName: "Dave's Dental Office",
      dentalChairs: 2,
      patientsPerChair: 10,
      revenuePerPatient: 432,
      daysPerWeek: 5,
      startupCosts: 500000,
    },
    employees: [
      { id: 1, title: 'Dentist', salary: 150000 },
      { id: 2, title: 'Dental Hygienist', salary: 75000 },
      { id: 3, title: 'Dental Assistant', salary: 45000 }
    ],
    overhead: [
      { id: 1, name: 'Rent', amount: 5000 },
      { id: 2, name: 'Utilities', amount: 1000 }
    ]
  });

  const updateBasicInfo = (field: keyof BasicInfo, value: string | number) => {
    setState(prev => ({
      ...prev,
      basicInfo: {
        ...prev.basicInfo,
        [field]: value
      }
    }));
  };

  const addEmployee = () => {
    const newId = Math.max(0, ...state.employees.map(e => e.id)) + 1;
    setState(prev => ({
      ...prev,
      employees: [...prev.employees, { id: newId, title: '', salary: 0 }]
    }));
  };

  const updateEmployee = (id: number, field: keyof Employee, value: string | number) => {
    setState(prev => ({
      ...prev,
      employees: prev.employees.map(emp =>
        emp.id === id ? { ...emp, [field]: value } : emp
      )
    }));
  };

  const removeEmployee = (id: number) => {
    setState(prev => ({
      ...prev,
      employees: prev.employees.filter(emp => emp.id !== id)
    }));
  };

  const addOverheadCost = () => {
    const newId = Math.max(0, ...state.overhead.map(o => o.id)) + 1;
    setState(prev => ({
      ...prev,
      overhead: [...prev.overhead, { id: newId, name: '', amount: 0 }]
    }));
  };

  const updateOverheadCost = (id: number, field: keyof OverheadCost, value: string | number) => {
    setState(prev => ({
      ...prev,
      overhead: prev.overhead.map(cost =>
        cost.id === id ? { ...cost, [field]: value } : cost
      )
    }));
  };

  const removeOverheadCost = (id: number) => {
    setState(prev => ({
      ...prev,
      overhead: prev.overhead.filter(cost => cost.id !== id)
    }));
  };

  return (
    <DentalContext.Provider value={{
      state,
      updateBasicInfo,
      addEmployee,
      updateEmployee,
      removeEmployee,
      addOverheadCost,
      updateOverheadCost,
      removeOverheadCost
    }}>
      {children}
    </DentalContext.Provider>
  );
};

// Create a custom hook for using the context
export const useDentalContext = () => {
  const context = useContext(DentalContext);
  if (context === undefined) {
    throw new Error('useDentalContext must be used within a DentalProvider');
  }
  return context;
};
