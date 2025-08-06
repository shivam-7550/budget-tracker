import axios from "axios";
import { useEffect, useState } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
const API_BASE = "https://budget-tracker-0f26.onrender.com";
function App() {
  const [form, setForm] = useState({ name: "", amount: "" });
  const [expenses, setExpenses] = useState([]);
  const [page, setPage] = useState("login");
  const [token, setToken] = useState(localStorage.getItem("token"));
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
      setPage("dashboard");
    }
  }, []);
  const fetchExpenses = async () => {
    if (!token) return;
    try {
      const res = await axios.get(`${API_BASE}/api/expenses`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setExpenses(res.data);
    } catch (err) {
      console.error("Fetch expenses failed:", err);
      alert("Session expired. Please login again.");
      localStorage.removeItem("token");
      setToken(null);
      setPage("login");
    }
  };
  const addExpense = async () => {
    if (!form.name || !form.amount) return;
    try {
      await axios.post(`${API_BASE}/api/expenses`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setForm({ name: "", amount: "" });
      fetchExpenses();
    } catch (err) {
      console.error("Add expense failed:", err.response?.data || err.message);
      alert("Failed to add expense. Please login again.");
      localStorage.removeItem("token");
      setToken(null);
      setPage("login");
    }
  };
  const deleteExpense = async (id) => {
    try {
      await axios.delete(`${API_BASE}/api/expenses/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchExpenses();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setPage("login");
  };
  useEffect(() => {
    if (token) {
      setPage("dashboard");
      fetchExpenses();
    }
  }, [token]);
  if (page === "login") return <Login setPage={setPage} setToken={setToken} />;

  if (page === "register") return <Register setPage={setPage} />;
  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>💰 Budget Tracker</h2>
      <button onClick={logout} style={{ float: "right" }}>
        Logout
      </button>
      <div style={{ marginBottom: "20px" }}>
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
        <button onClick={addExpense}>Add Expense</button>
      </div>
      <ul>
        {expenses.map((expense) => (
          <li key={expense._id}>
            ₹ {expense.amount} - {expense.name}
            <button
              onClick={() => deleteExpense(expense._id)}
              style={{ marginLeft: "10px" }}
            >
              ❌
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
export default App;
