import axios from "./axios";

export const getReports = async () => axios.get("/reports");
