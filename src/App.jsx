import { FinanceProvider, useFinance } from "./context/FinanceContext";
import Dashboard from "./components/Dashboard";
import Transactions from "./components/Transactions";
import Insights from "./components/Insights";

function MainApp(){
  const { role, setRole } = useFinance();

  return (
    <div className="md:p-3 p-2 pt-5 bg-gray-100 min-h-screen space-y-6 tracking-tighter">
      <div className="flex justify-between">
        <h1 className="text-2xl">Finance Dashboard</h1>
        <select value={role} onChange={(e)=>setRole(e.target.value)}>
          <option value="viewer">Viewer</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      <Dashboard/>
      <Transactions/>
      <Insights/>
    </div>
  );
}

export default function App(){
  return (
    <FinanceProvider>
      <MainApp/>
    </FinanceProvider>
  );
}
