import axios from "axios";
const axiosIntances = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});
axiosIntances.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});
export default axiosIntances;
