import axios from "axios";
import { useState } from "react";

const API_BASE = process.env.API_BASE;

function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleRegister = async () => {
    try {
      const res = await axios.post(`${API_BASE}/api/register`, form);
      alert("Registration successful");
    } catch (error) {
      alert("Registration failed");
    }
  };

  return (
    <div className="form">
      <h2>Register</h2>
      <input
        type="text"
        placeholder="Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />
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
      <button onClick={handleRegister}>Register</button>
    </div>
  );
}

export default Register;
