import { useEffect, useState } from "react";
import "./Auth.css"; // Include external CSS for styling

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
    <div className="dashboard-container">
      <header>
        <h2>Budget Dashboard</h2>
      </header>

      <section className="expense-form">
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
        <button onClick={addExpense}>Add</button>
      </section>

      <section className="expense-list">
        {expenses.map((exp, idx) => (
          <div className="expense-item" key={idx}>
            <span className="expense-title">{exp.title}</span>
            <span className="expense-amount">₹{exp.amount}</span>
          </div>
        ))}
      </section>

      <button
        className="logout-btn"
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
