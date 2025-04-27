import  { useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { login, loading, error, setError } = useAuth(); // Get setError

  const handleChange = (e) => {
    setError(null); // Clear previous errors on change
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null); // Clear previous errors on submit
    if (!formData.email || !formData.password) {
      setError("Email and password are required.");
      return;
    }
    login(formData);
  };

  return (
    <div className="auth-form">
      <h2>Login</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            autoComplete="email"
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            autoComplete="current-password"
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      <p>Don not have an account? <Link to="/register">Register here</Link>
      </p>
    </div>
  );
};

export default LoginPage;
