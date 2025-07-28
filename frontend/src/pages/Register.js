import axios from "axios";
import { useState } from "react";

export default function Register({ navigate }) {
  const [form, setForm] = useState({ username: "", email: "", password: "" });

  const handleRegister = async () => {
    await axios.post("http://localhost:5000/api/register", form);
    alert("Registered successfully! Please login.");
    navigate("/login");
  };

  return (
    <div>
      <h2>Register</h2>
      <input
        placeholder="Username"
        onChange={(e) => setForm({ ...form, username: e.target.value })}
      />
      <br />
      <input
        placeholder="Email"
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      <br />
      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />
      <br />
      <button onClick={handleRegister}>Register</button>
    </div>
  );
}
