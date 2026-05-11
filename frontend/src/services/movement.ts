import axios from "./axios";

export const getMovementUsers = async () => axios.get("/movements/users");
export const getMovements = async () => axios.get("/movements");
export const createMovement = async (data: {
  productId: number;
  type: "IN" | "OUT";
  quantity: number;
}) => axios.post("/movements", data);