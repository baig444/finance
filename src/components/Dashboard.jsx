import { useFinance } from "../context/FinanceContext";
import SummaryCard from "./SummaryCard";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";


const Dashboard = () => {
  const { transactions } = useFinance();

  const income = transactions.filter(t => t.type === "income").reduce((a, b) => a + b.amount, 0);
  const expense = transactions.filter(t => t.type === "expense").reduce((a, b) => a + b.amount, 0);
  const balance = income - expense;

  const chartData = transactions.map(t => ({ date: t.date, amount: t.amount }));

  const categoryData = Object.values(
    transactions.reduce((acc, curr) => {
      if (!acc[curr.category]) acc[curr.category] = { name: curr.category, value: 0 };
      acc[curr.category].value += curr.amount;
      return acc;
    }, {})
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SummaryCard title="Balance" amount={balance} />
        <SummaryCard title="Income" amount={income} />
        <SummaryCard title="Expense" amount={expense} />
      </div>

      <div className="grid md:grid-cols-2 gap-4 tracking-tighter">
        <div className="bg-white p-4 rounded-md">
          <h2>Balance Trend</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="amount" />
            </LineChart>
          </ResponsiveContainer>
        </div>

<div className="bg-white p-4 rounded-md tracking-tighter">
  <h2 className="mb-2 font-semibold">Spending Breakdown</h2>

  <ResponsiveContainer width="100%" height={250} className={'tracking-tighter'}>
    <PieChart>
      <Pie
        data={categoryData}
        dataKey="value"
        nameKey="name"
        legendType="circle"
        cx="50%"
        cy="50%"
        outerRadius={80}
        label={({ name, percent }) =>
          `${name} (${(percent * 100).toFixed(0)}%)`
        }
      >
        {categoryData.map((_, i) => (
          <Cell
            key={i}
            fill={[
              "#6366F1", 
              "#22C55E", 
              "#F59E0B", 
              "#EF4444",
              "#3B82F6",
            ][i % 5]}
          />
        ))}
      </Pie>

      <Tooltip />
    </PieChart>
  </ResponsiveContainer>
</div>
      </div>
    </div>
  );
};


export default Dashboard