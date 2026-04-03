import { useFinance } from "../context/FinanceContext";
import { useEffect, useMemo, useState } from "react";
import { Button } from "./ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { X } from "lucide-react";


const Transactions = () => {
  const { transactions, setTransactions, role, search, setSearch } = useFinance();

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [sortBy, setSortBy] = useState("latest");
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ amount: "", category: "", type: "expense", date: "" });

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


  const [filterType, setFilterType] = useState("all");

  const filtered = useMemo(() => {
  return transactions
    .filter(t =>
      t.category.toLowerCase().includes(search.toLowerCase())
    )
    .filter(t =>
      filterType === "all" ? true : t.type === filterType
    );
}, [transactions, search, filterType]);


const sorted = useMemo(() => {
  let data = [...filtered];

  if (sortBy === "amount") {
    return data.sort((a, b) => b.amount - a.amount);
  }

  return data.sort((a, b) => new Date(b.date) - new Date(a.date));
}, [filtered, sortBy]);


const exportCSV = () => {
  const csv = transactions.map(t =>
    `${t.date},${t.category},${t.type},${t.amount}`
  ).join("\\n");

  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "transactions.csv";
  a.click();
};


useEffect(() => {
  setTimeout(() => {
    setTransactions(transactions);
    setLoading(false)
  }, 1000);
  
}, []);

  return (
    <div className="bg-white/50 p-4 rounded-md tracking-tight">
      <div className="flex flex-wrap justify-between mb-3">
        <div className="flex flex-wrap items-center gap-4">
                  <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search" className="border px-2 py-1" />
                  <select
  value={sortBy}
  onChange={(e) => setSortBy(e.target.value)}
  className="border px-2 py-1"
>
  <option value="latest">Latest</option>
  <option value="amount">Amount</option>
</select>
          <div className="flex gap-2">
  {["all", "income", "expense"].map((type) => (
    <button
      key={type}
      onClick={() => setFilterType(type)}
      className={`px-2 py-1 rounded text-sm ${
        filterType === type ? "bg-black text-white" : "bg-gray-200"
      }`}
    >
      {type}
    </button>
  ))}
</div>

        </div>
        
<div className="flex gap-4 mt-3 md:mt-0">
          {role === "admin" && <button className="bg-black text-white px-3 py-1" onClick={() => setShowForm(true)}>+ Add</button>}
        <button onClick={exportCSV} className="bg-[#6E62E6] text-white px-3 py-1">
  Export CSV
</button>
</div>
      </div>

<div className="bg-white/60 p-1 rounded-md">
  {loading ? <p>Loading...</p> : <Table>
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
        sorted.map((t) => (
          <TableRow key={t.id} className="hover:bg-gray-50 transition">
            <TableCell>{t.date}</TableCell>

            <TableCell className="">
              {t.category}
            </TableCell>

            <TableCell>
              <span
                className={`px-2 py-1 rounded text-xs  ${
                  t.type === "income"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {t.type}
              </span>
            </TableCell>

            <TableCell className="">
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
  </Table>}

</div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center tracking-tight">
          <div className="bg-white p-4 rounded flex flex-col gap-5 w-72 relative">
            <X onClick={() => setShowForm(false)} size={16} className="absolute right-3 top-3" />
            <input placeholder="Amount" value={formData.amount} className="border border-black px-1 mt-10" onChange={(e)=>setFormData({...formData, amount:e.target.value})} />
            <input placeholder="Category" className="border border-black px-1" value={formData.category} onChange={(e)=>setFormData({...formData, category:e.target.value})} />
            <select value={formData.type} onChange={(e)=>setFormData({...formData, type:e.target.value})}>
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
            <input type="date" value={formData.date} onChange={(e)=>setFormData({...formData, date:e.target.value})} />
            <Button onClick={handleAdd}>{editId ? "Update" : "Add"}</Button>
          </div>
        </div>
      )}
    </div>
  );
};


export default Transactions