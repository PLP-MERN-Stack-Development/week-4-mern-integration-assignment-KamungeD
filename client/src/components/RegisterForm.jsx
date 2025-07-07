import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/api";

export default function RegisterForm() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await authService.register(form);
      localStorage.setItem("token", res.data.token);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Register</h2>
      <input
        name="username"
        value={form.username}
        onChange={handleChange}
        placeholder="Username"
        required
      />
      <input
        name="password"
        type="password"
        value={form.password}
        onChange={handleChange}
        placeholder="Password (min 6 chars)"
        required
      />
      <button type="submit">Register</button>
      {error && <div style={{ color: "red" }}>{error}</div>}
    </form>
  );
}