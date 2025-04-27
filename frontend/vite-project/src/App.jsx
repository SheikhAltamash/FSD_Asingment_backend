// Use BrowserRouter or HashRouter
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext"; 
import useAuth from "./hooks/useAuth"; 
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Dashboard from "./pages/Dashboard";
import "./index.css"; 


const PublicRoute = ({ children }) => {

  const { token, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }
  return token ? <Navigate to="/" replace /> : children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* --- Public Routes --- */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <RegisterPage />
              </PublicRoute>
            }
          />

          <Route path="/" element={<Dashboard />}></Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
