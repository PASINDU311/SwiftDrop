import axios from "axios";
import * as SecureStore from "expo-secure-store";

const API = axios.create({
  baseURL: "http://192.168.1.6:5000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export async function testBackendConnection() {
  try {
    const response = await API.get("/health");

    console.log("✅ Backend API connected");
    console.log("Health:", response.data);

    return response.data;
  } catch (error) {
    console.error("❌ Backend API connection failed:", error);
    throw error;
  }
}

export async function loginUser(
  email: string,
  password: string
) {
  const response = await API.post("/auth/login", {
    email,
    password,
  });

  const { token, user } = response.data;

  await SecureStore.setItemAsync("auth_token", token);

  return {
    token,
    user,
  };
}

export async function registerUser(data: {
  name: string;
  email: string;
  password: string;
  phone: string;
}) {
  const response = await API.post("/auth/register", data);

  return response.data;
}

export async function getAuthToken() {
  return await SecureStore.getItemAsync("auth_token");
}

export async function logoutUser() {
  await SecureStore.deleteItemAsync("auth_token");
}

export async function getStoredUser() {
  const token = await SecureStore.getItemAsync("auth_token");

  if (!token) {
    return null;
  }

  try {
    const response = await API.get("/auth/me");

    return response.data.user;
  } catch (error) {
    await SecureStore.deleteItemAsync("auth_token");
    return null;
  }
}

API.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync("auth_token");

    if (token) {
      config.headers.set("Authorization", `Bearer ${token}`);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export async function getUsers() {
  const response = await API.get("/users");

  return response.data;
}

export default API;