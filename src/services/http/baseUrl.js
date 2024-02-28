import axios from "axios";

// Create an Axios instance
const api = axios.create({
  baseURL: "https://api.dazlpro.com/api",

  headers: {
    Accept: "application/json",
    "Content-type": "application/json",
  },
});

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    const authToken = localStorage.getItem("token");
    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
