import { useEffect, useState } from "react";
import "./Dashboard.css";

const Dashboard = ({ setPage }) => {
  const [expenses, setExpenses] = useState([]);
  const [newExpense, setNewExpense] = useState({ title: "", amount: "" });

  const fetchExpenses = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        "https://budget-tracker-0f26.onrender.com/api/expenses",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      if (res.status === 200) {
        setExpenses(data);
      } else {
        alert(data.message || "Error fetching expenses");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const addExpense = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        "https://budget-tracker-0f26.onrender.com/api/expenses",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newExpense),
        }
      );

      const data = await res.json();
      if (res.status === 201) {
        setNewExpense({ title: "", amount: "" });
        fetchExpenses();
      } else {
        alert(data.message || "Error adding expense");
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      <div className="expense-form">
        <input
          type="text"
          placeholder="Title"
          value={newExpense.title}
          onChange={(e) =>
            setNewExpense({ ...newExpense, title: e.target.value })
          }
        />
        <input
          type="number"
          placeholder="Amount"
          value={newExpense.amount}
          onChange={(e) =>
            setNewExpense({ ...newExpense, amount: e.target.value })
          }
        />
        <button onClick={addExpense}>Add Expense</button>
      </div>

      <ul className="expense-list">
        {expenses.map((exp, idx) => (
          <li key={idx}>
            <strong>{exp.title}</strong>: ₹{exp.amount}
          </li>
        ))}
      </ul>

      <button
        className="logout"
        onClick={() => {
          localStorage.removeItem("token");
          setPage("login");
        }}
      >
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
