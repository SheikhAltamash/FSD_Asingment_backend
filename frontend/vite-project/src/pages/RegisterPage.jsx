import  { useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const RegisterPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { register, loading, error, setError } = useAuth(); // Get setError

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
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    // Simple email format check (basic)
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    register(formData);
  };

  return (
    <div className="auth-form">
      <h2>Register</h2>
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
            minLength="6"
            autoComplete="new-password"
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
      <p>
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </div>
  );
};

export default RegisterPage;
