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
    <div
      style={{
        maxWidth: "700px",
        margin: "0 auto",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
        }}
      >
        <h2 style={{ margin: 0 }}>💰 Budget Tracker</h2>
        <button
          onClick={logout}
          style={{
            backgroundColor: "#f44336",
            color: "#fff",
            border: "none",
            padding: "8px 16px",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Logout
        </button>
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
          marginBottom: "20px",
        }}
      >
        <input
          type="text"
          placeholder="Expense name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          style={{
            flex: "1 1 200px",
            padding: "10px",
            fontSize: "1rem",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        />
        <input
          type="number"
          placeholder="Amount"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
          style={{
            flex: "1 1 120px",
            padding: "10px",
            fontSize: "1rem",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        />
        <button
          onClick={addExpense}
          style={{
            flex: "1 1 100px",
            backgroundColor: "#4CAF50",
            color: "#fff",
            border: "none",
            padding: "10px",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Add
        </button>
      </div>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {expenses.map((expense) => (
          <li
            key={expense._id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: "#f2f2f2",
              marginBottom: "10px",
              padding: "10px 15px",
              borderRadius: "4px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            }}
          >
            <span>
              ₹ {expense.amount} - <strong>{expense.name}</strong>
            </span>
            <button
              onClick={() => deleteExpense(expense._id)}
              style={{
                backgroundColor: "#e74c3c",
                color: "#fff",
                border: "none",
                padding: "6px 10px",
                borderRadius: "4px",
                cursor: "pointer",
              }}
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
