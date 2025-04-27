import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL||"http://localhost:8080/api";

console.log(
  "[API Setup] Reading VITE_API_URL from import.meta.env:",
  import.meta.env.VITE_API_URL
);

if (!apiUrl) {
  console.error(
    "CRITICAL ERROR: VITE_API_URL is not defined in your .env file. Requests will likely fail. " +
      "Ensure .env exists in the project root with VITE_API_URL=http://<your_backend_host>:<port>/api and RESTART the Vite server."
  );

}
console.log("[API Setup] Using API Base URL for requests:", apiUrl);

const API = axios.create({
  baseURL: apiUrl, 
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers = config.headers || {}; 
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.log("[Interceptor] No token found in localStorage.");
    }
    return config; 
  },
  (error) => {
    console.error("[Interceptor] Request Error:", error);
    return Promise.reject(error);
  }
);

export const login = (formData) => API.post("/auth/login", formData); 
export const register = (formData) => API.post("/auth/register", formData); 

export const fetchTasks = () => API.get("/tasks"); 
export const createTask = (newTask) => API.post("/tasks", newTask);
export const updateTask = (id, updatedTask) =>
  API.put(`/tasks/${id}`, updatedTask);
export const deleteTask = (id) => API.delete(`/tasks/${id}`);

export default API;
