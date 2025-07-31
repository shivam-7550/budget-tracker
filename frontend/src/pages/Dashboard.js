// src/Dashboard.js
import axios from "axios";
import { useEffect, useState } from "react";

const API_BASE =
  process.env.API_BASE || "https://budget-tracker-0f26.onrender.com";

function Dashboard({ onLogout }) {
  const [form, setForm] = useState({ name: "", amount: "" });
  const [expenses, setExpenses] = useState([]);

  const fetchExpenses = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_BASE}/api/expenses`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExpenses(res.data);
    } catch (err) {
      alert("Failed to fetch expenses");
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
      alert("Error adding expense");
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  return (
    <div className="dashboard-container">
      <h2>Expense Dashboard</h2>
      <div className="form-section">
        <input
          type="text"
          placeholder="Expense name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          type="number"
          placeholder="Amount"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
        />
        <button onClick={addExpense}>Add</button>
        <button
          onClick={() => {
            localStorage.removeItem("token");
            onLogout();
          }}
        >
          Logout
        </button>
      </div>

      <ul className="expense-list">
        {expenses.map((item) => (
          <li key={item._id}>
            {item.name} - ₹{item.amount}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;
