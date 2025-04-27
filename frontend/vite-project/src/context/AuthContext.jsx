import { createContext, useState, useEffect } from "react";
import * as api from "../api"; // Assuming your api calls are in 'api/index.js'
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true); // Check initial auth state
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (storedToken) {
      setToken(storedToken);
      setUser(storedUser); 
    }
    setLoading(false); 
  }, []);

  const login = async (formData) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.login(formData);
      if (data.success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user)); 
        setToken(data.token);
        setUser(data.user);
        navigate("/"); 
      }
    } catch (err) {
      console.error("Login Error:", err);
      const message =
        err.response?.data?.message || "Login failed. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const register = async (formData) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.register(formData);
      if (data.success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setToken(data.token);
        setUser(data.user);
        navigate("/"); 
      }
    } catch (err) {
      console.error("Registration Error:", err);
      const message =
        err.response?.data?.message || "Registration failed. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{ user, token, login, register, logout, loading, error, setError }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
