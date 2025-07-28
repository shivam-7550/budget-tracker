import axios from "axios";
import { useState } from "react";

const API_BASE = process.env.API_BASE;

function Login({ onLogin }) {
  const [form, setForm] = useState({ email: "", password: "" });

  const handleLogin = async () => {
    try {
      const res = await axios.post(`${API_BASE}/api/login`, form);
      localStorage.setItem("token", res.data.token);
      onLogin(res.data.user); // send user info to parent
    } catch (error) {
      alert("Login failed");
    }
  };

  return (
    <div className="form">
      <h2>Login</h2>
      <input
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      <input
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default Login;
