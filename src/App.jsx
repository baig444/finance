import React, { useState, useMemo, createContext, useContext, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

// ================= CONTEXT =================
const FinanceContext = createContext();

const mockData = [
  { id: 1, amount: 2000, category: "Food", type: "expense", date: "2026-04-01" },
  { id: 2, amount: 5000, category: "Salary", type: "income", date: "2026-04-02" },
];

const FinanceProvider = ({ children }) => {
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

const useFinance = () => useContext(FinanceContext);

// ================= COMPONENTS =================

const SummaryCard = ({ title, amount }) => (
  <div className="p-4 bg-white shadow rounded-2xl">
    <h3 className="text-gray-500">{title}</h3>
    <p className="text-2xl font-bold">₹{amount}</p>
  </div>
);

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

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-2xl shadow">
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

<div className="bg-white p-4 rounded-2xl shadow">
  <h2 className="mb-2 font-semibold">Spending Breakdown</h2>

  <ResponsiveContainer width="100%" height={250}>
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
              "#6366F1", // indigo
              "#22C55E", // green
              "#F59E0B", // yellow
              "#EF4444", // red
              "#3B82F6", // blue
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

// ================= TRANSACTIONS =================

const Transactions = () => {
  const { transactions, setTransactions, role, search, setSearch } = useFinance();

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({ amount: "", category: "", type: "expense", date: "" });

  const filtered = useMemo(() => {
    return transactions.filter(t => t.category.toLowerCase().includes(search.toLowerCase()));
  }, [transactions, search]);

  const handleAdd = () => {
    if (!formData.amount || !formData.category) return;

    if (editId) {
      setTransactions(prev => prev.map(t => t.id === editId ? { ...t, ...formData, amount: Number(formData.amount) } : t));
    } else {
      const newTx = { id: Date.now(), ...formData, amount: Number(formData.amount) };
      setTransactions(prev => [newTx, ...prev]);
    }

    setShowForm(false);
    setEditId(null);
    setFormData({ amount: "", category: "", type: "expense", date: "" });
  };

  const handleEdit = (t) => {
    setEditId(t.id);
    setFormData(t);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div className="bg-white p-4 rounded-2xl shadow">
      <div className="flex justify-between mb-3">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search" className="border px-2 py-1" />
        {role === "admin" && <button onClick={() => setShowForm(true)}>+ Add</button>}
      </div>

<div className="bg-white p-4 rounded-2xl shadow">
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Date</TableHead>
        <TableHead>Category</TableHead>
        <TableHead>Type</TableHead>
        <TableHead>Amount</TableHead>
        {role === "admin" && <TableHead className="text-right">Actions</TableHead>}
      </TableRow>
    </TableHeader>

    <TableBody>
      {filtered.length === 0 ? (
        <TableRow>
          <TableCell colSpan={5} className="text-center py-6 text-gray-500">
            No transactions found
          </TableCell>
        </TableRow>
      ) : (
        filtered.map((t) => (
          <TableRow key={t.id} className="hover:bg-gray-50 transition">
            <TableCell>{t.date}</TableCell>

            <TableCell className="font-medium">
              {t.category}
            </TableCell>

            <TableCell>
              <span
                className={`px-2 py-1 rounded text-xs font-semibold ${
                  t.type === "income"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {t.type}
              </span>
            </TableCell>

            <TableCell className="font-semibold">
              ₹{t.amount}
            </TableCell>

            {role === "admin" && (
              <TableCell className="text-right space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(t)}
                >
                  Edit
                </Button>

                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(t.id)}
                >
                  Delete
                </Button>
              </TableCell>
            )}
          </TableRow>
        ))
      )}
    </TableBody>
  </Table>
</div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-4 rounded">
            <input placeholder="Amount" value={formData.amount} onChange={(e)=>setFormData({...formData, amount:e.target.value})} />
            <input placeholder="Category" value={formData.category} onChange={(e)=>setFormData({...formData, category:e.target.value})} />
            <select value={formData.type} onChange={(e)=>setFormData({...formData, type:e.target.value})}>
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
            <input type="date" value={formData.date} onChange={(e)=>setFormData({...formData, date:e.target.value})} />
            <button onClick={handleAdd}>{editId ? "Update" : "Add"}</button>
          </div>
        </div>
      )}
    </div>
  );
};

const Insights = () => {
  const { transactions } = useFinance();

  const highest = Object.entries(transactions.reduce((acc, t)=>{
    acc[t.category] = (acc[t.category]||0)+t.amount;
    return acc;
  },{})).sort((a,b)=>b[1]-a[1])[0];

  return (
    <div className="bg-white p-4 rounded-2xl shadow">
      <h2>Insights</h2>
      {highest && <p>Top: {highest[0]} ₹{highest[1]}</p>}
    </div>
  );
};

function MainApp(){
  const { role, setRole } = useFinance();

  return (
    <div className="p-6 bg-gray-100 min-h-screen space-y-6">
      <div className="flex justify-between">
        <h1>Finance Dashboard</h1>
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
