import axios from "./axios";

export const login = async (email: string, password: string) => {
  return axios.post("/auth/login", { email, password });
};
export const register = async (
  name: string,
  email: string,
  password: string
) => {
  return axios.post("/auth/register", { name, email, password });
};
export const getUsers = async () => axios.get("/auth/users");
export const deleteUser = async (id: number) =>
  axios.delete(`/auth/users/${id}`);
export const changeRole = async (id: number, role: string) =>
  axios.put(`/auth/users/${id}/role`, { role });
export const getUser = async () => axios.get("/auth/profile");
