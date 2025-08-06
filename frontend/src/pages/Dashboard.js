import { useEffect, useState } from "react";

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
    <div
      style={{
        maxWidth: "800px",
        margin: "auto",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <header style={{ textAlign: "center", marginBottom: "30px" }}>
        <h2 style={{ fontSize: "2rem" }}>Budget Dashboard</h2>
      </header>

      <section
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
          justifyContent: "center",
          marginBottom: "20px",
        }}
      >
        <input
          type="text"
          placeholder="Title"
          value={newExpense.title}
          onChange={(e) =>
            setNewExpense({ ...newExpense, title: e.target.value })
          }
          style={{
            flex: "1 1 150px",
            padding: "10px",
            fontSize: "1rem",
            border: "1px solid #ccc",
            borderRadius: "5px",
          }}
        />
        <input
          type="number"
          placeholder="Amount"
          value={newExpense.amount}
          onChange={(e) =>
            setNewExpense({ ...newExpense, amount: e.target.value })
          }
          style={{
            flex: "1 1 150px",
            padding: "10px",
            fontSize: "1rem",
            border: "1px solid #ccc",
            borderRadius: "5px",
          }}
        />
        <button
          onClick={addExpense}
          style={{
            flex: "1 1 100px",
            backgroundColor: "#4CAF50",
            color: "white",
            padding: "10px",
            border: "none",
            borderRadius: "5px",
            fontSize: "1rem",
            cursor: "pointer",
          }}
        >
          Add
        </button>
      </section>

      <section
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          maxHeight: "400px",
          overflowY: "auto",
        }}
      >
        {expenses.map((exp, idx) => (
          <div
            key={idx}
            style={{
              display: "flex",
              justifyContent: "space-between",
              backgroundColor: "#f2f2f2",
              padding: "10px",
              borderRadius: "5px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            }}
          >
            <span style={{ fontWeight: "bold" }}>{exp.title}</span>
            <span style={{ color: "#333" }}>₹{exp.amount}</span>
          </div>
        ))}
      </section>

      <button
        onClick={() => {
          localStorage.removeItem("token");
          setPage("login");
        }}
        style={{
          marginTop: "30px",
          backgroundColor: "#f44336",
          color: "white",
          padding: "10px 20px",
          border: "none",
          borderRadius: "5px",
          fontSize: "1rem",
          cursor: "pointer",
          display: "block",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
