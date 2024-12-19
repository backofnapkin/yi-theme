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

type Results = {
  monthlyRevenue: number;
  annualRevenue: number;
  monthlyOverhead: number;
  annualOverhead: number;
  netIncome: number;
  profitMargin: number;
};

type CalculatorState = {
  basicInfo: BasicInfo;
  employees: Employee[];
  overhead: OverheadCost[];
  results: Results | null;
};

// Context and Provider Type
type DentalContextType = {
  state: CalculatorState;
  updateBasicInfo: (field: keyof BasicInfo, value: string | number) => void;
  addEmployee: () => void;
  updateEmployee: (id: number, field: keyof Employee, value: string | number) => void;
  removeEmployee: (id: number) => void;
  addOverheadCost: () => void;
  updateOverheadCost: (id: number, field: keyof OverheadCost, value: string | number) => void;
  removeOverheadCost: (id: number) => void;
  calculateResults: () => void;
};

const DentalContext = createContext<DentalContextType | undefined>(undefined);

export const DentalProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<CalculatorState>({
    basicInfo: {
      practiceName: "Default Practice",
      dentalChairs: 2,
      patientsPerChair: 10,
      revenuePerPatient: 500,
      daysPerWeek: 5,
      startupCosts: 500000,
    },
    employees: [],
    overhead: [],
    results: null,
  });

  const updateBasicInfo = (field: keyof BasicInfo, value: string | number) => {
    setState((prev) => ({
      ...prev,
      basicInfo: { ...prev.basicInfo, [field]: value },
    }));
  };

  const addEmployee = () => {
    const newId = state.employees.length + 1;
    setState((prev) => ({
      ...prev,
      employees: [...prev.employees, { id: newId, title: '', salary: 0 }],
    }));
  };

  const updateEmployee = (id: number, field: keyof Employee, value: string | number) => {
    setState((prev) => ({
      ...prev,
      employees: prev.employees.map((emp) =>
        emp.id === id ? { ...emp, [field]: value } : emp
      ),
    }));
  };

  const removeEmployee = (id: number) => {
    setState((prev) => ({
      ...prev,
      employees: prev.employees.filter((emp) => emp.id !== id),
    }));
  };

  const addOverheadCost = () => {
    const newId = state.overhead.length + 1;
    setState((prev) => ({
      ...prev,
      overhead: [...prev.overhead, { id: newId, name: '', amount: 0 }],
    }));
  };

  const updateOverheadCost = (id: number, field: keyof OverheadCost, value: string | number) => {
    setState((prev) => ({
      ...prev,
      overhead: prev.overhead.map((cost) =>
        cost.id === id ? { ...cost, [field]: value } : cost
      ),
    }));
  };

  const removeOverheadCost = (id: number) => {
    setState((prev) => ({
      ...prev,
      overhead: prev.overhead.filter((cost) => cost.id !== id),
    }));
  };

  const calculateResults = () => {
    const { basicInfo, employees, overhead } = state;

    const monthlyRevenue =
      basicInfo.dentalChairs *
      basicInfo.patientsPerChair *
      basicInfo.revenuePerPatient *
      basicInfo.daysPerWeek *
      4.33;

    const monthlyOverhead =
      overhead.reduce((total, cost) => total + cost.amount, 0) +
      employees.reduce((total, emp) => total + emp.salary / 12, 0);

    const netIncome = monthlyRevenue - monthlyOverhead;

    setState((prev) => ({
      ...prev,
      results: {
        monthlyRevenue,
        annualRevenue: monthlyRevenue * 12,
        monthlyOverhead,
        annualOverhead: monthlyOverhead * 12,
        netIncome,
        profitMargin: (netIncome / monthlyRevenue) * 100,
      },
    }));
  };

  return (
    <DentalContext.Provider
      value={{
        state,
        updateBasicInfo,
        addEmployee,
        updateEmployee,
        removeEmployee,
        addOverheadCost,
        updateOverheadCost,
        removeOverheadCost,
        calculateResults,
      }}
    >
      {children}
    </DentalContext.Provider>
  );
};

// Custom hook for consuming the context
export const useDentalContext = () => {
  const context = useContext(DentalContext);
  if (!context) {
    throw new Error('useDentalContext must be used within a DentalProvider');
  }
  return context;
};
