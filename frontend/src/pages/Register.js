import axios from "axios";
import { useState } from "react";

const API_BASE = "https://budget-tracker-0f26.onrender.com";

const Register = ({ setPage }) => {
  const [form, setForm] = useState({ email: "", password: "" });

  const handleRegister = async () => {
    try {
      const res = await axios.post(`${API_BASE}/api/register`, form);
      if (res.status === 201 || res.status === 200) {
        alert("Registration successful. Please login.");
        setPage("login"); // 👈 switch to login page
      }
    } catch (err) {
      console.error(err);
      alert("Registration failed");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Register</h2>
      <input
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      <br />

      <input
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />
      <br />
      <button onClick={handleRegister}>Register</button>
      <p>
        Already have an account?{" "}
        <button onClick={() => setPage("login")}>Login</button>
      </p>
    </div>
  );
};

export default Register;
