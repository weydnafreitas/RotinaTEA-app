import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const api = axios.create({
  baseURL: "http://192.168.0.5:3000", // Para emulador Android - Para iOS use: http://localhost:3000
});

// Interceptor para adicionar token automaticamente
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("@RotinaTEA:token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
