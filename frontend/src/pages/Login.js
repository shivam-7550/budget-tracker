import { useState } from "react";
import "./Auth.css";

const Login = ({ setPage }) => {
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    try {
      const res = await fetch(
        "https://budget-tracker-0f26.onrender.com/api/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );
      const data = await res.json();

      if (res.status === 200 && data.token) {
        localStorage.setItem("token", data.token);
        alert("Login successful");
        setPage("dashboard");
      } else {
        alert(data.message || "Login failed");
      }
    } catch (err) {
      alert("Error logging in");
      console.error(err);
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
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
      <button onClick={handleLogin}>Login</button>
      <p>
        Don't have an account?{" "}
        <span className="link" onClick={() => setPage("register")}>
          Register
        </span>
      </p>
    </div>
  );
};

export default Login;
