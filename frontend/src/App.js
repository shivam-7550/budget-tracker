import axios from "axios";
import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState({ name: "", amount: "" });

  const fetchExpenses = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/expenses");
      setExpenses(res.data);
    } catch (err) {
      alert("Unable to fetch expenses. Make sure the backend is running.");
    }
  };

  const addExpense = async () => {
    if (!form.name || !form.amount) return;
    try {
      await axios.post("http://localhost:5000/api/expenses", form);
      setForm({ name: "", amount: "" });
      fetchExpenses();
    } catch (err) {
      alert("Failed to add expense");
    }
  };

  const deleteExpense = async (id) => {
    await axios.delete(`http://localhost:5000/api/expenses/${id}`);
    fetchExpenses();
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const total = expenses.reduce((acc, exp) => acc + exp.amount, 0);

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(amount);

  return (
    <div className="container">
      <h1 className="title">Budget Tracker</h1>

      <div className="form">
        <input
          type="text"
          placeholder="Expense Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          type="number"
          placeholder="Amount"
          value={form.amount}
          onChange={(e) =>
            setForm({ ...form, amount: parseFloat(e.target.value) })
          }
        />
        <button onClick={addExpense}>Add</button>
      </div>

      <ul className="expense-list">
        {expenses.map((exp) => (
          <li key={exp._id}>
            <span>{exp.name}</span>
            <div className="right">
              <span>{formatCurrency(exp.amount)}</span>
              <button className="delete" onClick={() => deleteExpense(exp._id)}>
                ✖
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div className="total">
        Total: <strong>{formatCurrency(total)}</strong>
      </div>
    </div>
  );
}

export default App;
