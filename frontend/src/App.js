import axios from "axios";
import { useEffect, useState } from "react";
import Login from "./Login";
import Register from "./Register";

function App() {
  const [form, setForm] = useState({ name: "", amount: "" });
  const [expenses, setExpenses] = useState([]);
  const [page, setPage] = useState("login"); // login | register | dashboard

  const token = localStorage.getItem("token");

  const fetchExpenses = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/expenses", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExpenses(res.data);
    } catch (err) {
      alert("Please login again.");
      setPage("login");
      localStorage.removeItem("token");
    }
  };

  const addExpense = async () => {
    if (!form.name || !form.amount) return;
    try {
      await axios.post("http://localhost:5000/api/expenses", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setForm({ name: "", amount: "" });
      fetchExpenses();
    } catch (err) {
      console.log(err);
    }
  };

  const deleteExpense = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/expenses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchExpenses();
    } catch (err) {
      console.log(err);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setPage("login");
  };

  useEffect(() => {
    if (token) {
      setPage("dashboard");
      fetchExpenses();
    }
  }, [token]);

  if (page === "login") return <Login setPage={setPage} />;
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
