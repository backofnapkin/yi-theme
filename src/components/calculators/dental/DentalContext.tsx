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
   employees: [
     { id: 1, title: "Dentist", salary: 19141 },
     { id: 2, title: "Certified Dental Assistant", salary: 4160 },
     { id: 3, title: "Hygienist", salary: 8164 },
     { id: 4, title: "Receptionist", salary: 3360 }
   ],
   overhead: [
     { id: 1, name: "Lease", amount: 6000 },
     { id: 2, name: "Utilities", amount: 800 },
     { id: 3, name: "Supplies", amount: 2000 },
     { id: 4, name: "Marketing Budget", amount: 3500 },
     { id: 5, name: "Loan Repayment", amount: 5000 }
   ],
   results: null,
 });

 const updateBasicInfo = (field: keyof BasicInfo, value: string | number) => {
   setState((prev) => ({
     ...prev,
     basicInfo: { ...prev.basicInfo, [field]: value },
   }));
 };

 const addEmployee = () => {
   const newId = Math.max(0, ...state.employees.map(emp => emp.id)) + 1;
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
   const newId = Math.max(0, ...state.overhead.map(cost => cost.id)) + 1;
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
     employees.reduce((total, emp) => total + emp.salary, 0);

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
