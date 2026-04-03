import { createContext, useContext, useEffect, useState } from "react";

const FinanceContext = createContext();

const mockData = [
  { id: 1, amount: 2000, category: "Food", type: "expense", date: "2026-04-01" },
  { id: 2, amount: 5000, category: "Salary", type: "income", date: "2026-04-02" },
];

export const FinanceProvider = ({ children }) => {
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem("tx");
    return saved ? JSON.parse(saved) : mockData;
  });

  const [role, setRole] = useState("viewer");
  const [search, setSearch] = useState("");

  useEffect(() => {
    localStorage.setItem("tx", JSON.stringify(transactions));
  }, [transactions]);

  return (
    <FinanceContext.Provider value={{ transactions, setTransactions, role, setRole, search, setSearch }}>
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => useContext(FinanceContext);