import { useState } from "react";
import "./Auth.css";

const Register = ({ setPage }) => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    try {
      const res = await fetch(
        "https://budget-tracker-0f26.onrender.com/api/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );

      const data = await res.json();
      if (res.status === 201 || res.status === 200) {
        alert("Registration successful");
        setPage("login");
      } else {
        alert(data.message || "Registration failed");
      }
    } catch (err) {
      alert("Error registering");
      console.error(err);
    }
  };

  return (
    <div className="auth-container">
      <h2>Register</h2>
      <input
        type="text"
        name="name"
        placeholder="Name"
        onChange={handleChange}
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        onChange={handleChange}
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        onChange={handleChange}
      />
      <button onClick={handleRegister}>Register</button>
      <p>
        Already have an account?{" "}
        <span className="link" onClick={() => setPage("login")}>
          Login
        </span>
      </p>
    </div>
  );
};

export default Register;
