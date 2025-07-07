import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/api";

export default function LoginForm() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await authService.login(form);
      localStorage.setItem("token", res.data.token);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
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
        placeholder="Password"
        required
      />
      <button type="submit">Login</button>
      {error && <div style={{ color: "red" }}>{error}</div>}
    </form>
  );
}