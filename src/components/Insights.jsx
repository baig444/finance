import { useFinance } from "../context/FinanceContext";

const Insights = () => {
  const { transactions } = useFinance();

  if (transactions.length === 0) {
    return (
      <div className="bg-white p-4 rounded-md">
        No insights available
      </div>
    );
  }

  // Highest category
  const categoryTotals = transactions.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount;
    return acc;
  }, {});

  const highest = Object.entries(categoryTotals)
    .sort((a, b) => b[1] - a[1])[0];

//   Monthly comparison
  const currentMonth = new Date().getMonth();
  const current = transactions
    .filter(t => new Date(t.date).getMonth() === currentMonth)
    .reduce((sum, t) => sum + t.amount, 0);

  const prev = transactions
    .filter(t => new Date(t.date).getMonth() === currentMonth - 1)
    .reduce((sum, t) => sum + t.amount, 0);

  const diff = prev ? (((current - prev) / prev) * 100).toFixed(1) : 0;

  return (
    <div className="bg-white p-4 rounded-md space-y-1">
      <h2 className="text-xl">Insights</h2>

      <p>
        Highest spending: <b>{highest[0]}</b> (₹{highest[1]})
      </p>

      <p>
        This month: ₹{current}
      </p>

      <p>
        Change: {diff}% from last month
      </p>
    </div>
  );
};

export default Insights;