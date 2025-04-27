import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const ProtectedRoute = () => {
  const { token, loading } = useAuth();

  if (loading) {
    // Optional: Show a loading spinner while checking auth state
    return <div>Loading...</div>;
  }

  // If there's a token, allow access to the nested routes (Outlet)
  // Otherwise, redirect to the login page
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
