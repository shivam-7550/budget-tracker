import axios from "axios";
import { useEffect, useState } from "react";

const API_BASE = process.env.API_BASE;

function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState({ name: "", amount: "" });

  const fetchExpenses = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(`${API_BASE}/api/expenses`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExpenses(res.data);
    } catch (err) {
      alert("Failed to load expenses");
    }
  };

  const addExpense = async () => {
    if (!form.name || !form.amount) return;
    try {
      const token = localStorage.getItem("token");
      await axios.post(`${API_BASE}/api/expenses`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setForm({ name: "", amount: "" });
      fetchExpenses();
    } catch (err) {
      alert("Failed to add expense");
    }
  };

  const deleteExpense = async (id) => {
    const token = localStorage.getItem("token");
    await axios.delete(`${API_BASE}/api/expenses/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchExpenses();
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const total = expenses.reduce((acc, exp) => acc + exp.amount, 0);

  return (
    <div className="container">
      <h1>Dashboard</h1>

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

      <ul>
        {expenses.map((exp) => (
          <li key={exp._id}>
            {exp.name} - ₹{exp.amount}{" "}
            <button onClick={() => deleteExpense(exp._id)}>Delete</button>
          </li>
        ))}
      </ul>

      <h3>Total: ₹{total}</h3>
    </div>
  );
}

export default Dashboard;
