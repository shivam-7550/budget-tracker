import axios from "axios";
import { useState } from "react";

const API_BASE = "https://budget-tracker-0f26.onrender.com";

const Login = ({ setPage, setToken }) => {
  const [form, setForm] = useState({ email: "", password: "" });
  const handleLogin = async () => {
    try {
      const res = await axios.post(`${API_BASE}/api/login`, form);
      const token = res.data.token;
      if (token) {
        localStorage.setItem("token", token);
        setToken(token); // 🔥 This line is important!
        setPage("dashboard");
      } else {
        alert("Login failed. Please check your credentials.");
      }
    } catch (err) {
      console.error(err);
      alert("Invalid email or password.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Login</h2>
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
      <button onClick={handleLogin}>Login</button>
      <br />
      <p>
        Don't have an account?{" "}
        <span
          onClick={() => setPage("register")}
          style={{ color: "blue", cursor: "pointer" }}
        >
          Register here
        </span>
      </p>
    </div>
  );
};
export default Login;
