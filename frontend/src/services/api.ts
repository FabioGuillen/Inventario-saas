import axios from "./axios";
export const getProducts = async () => axios.get("/products");
export const getProduct = async (id: number) => axios.get(`/products/${id}`);
export const createProduct = async (data: {
  name: string;
  price: number;
  stock: number;
  category: string;
}) => axios.post("/products", data);
export const updateProduct = async (
  id: number,
  data: { name: string; price: number; stock: number; category: string }
) => axios.put(`/products/${id}`, data);

export const searchProducts = async (query: string) =>
  axios.get(`/products/search?query=${encodeURIComponent(query)}`);
