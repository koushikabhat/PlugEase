import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BACKEND_URI } from "@env"; // make sure you set this in your .env file

const api = axios.create({ baseURL: `http://${BACKEND_URI}/api` });

// Request interceptor to attach token
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("userToken");
    console.log("Attaching token to request:", token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.log("Unauthorized! Token expired or invalid.");
      // You can logout user here or refresh token
    }
    return Promise.reject(error);
  }
);

export default api;
