import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Your live Render URL
const API_BASE_URL = 'https://kisan-marg-backend.onrender.com/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  // Increased to 60s to handle Render's "Cold Start" (server spin-up)
  timeout: 60000, 
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

/**
 * REQUEST INTERCEPTOR
 * Automatically attaches the JWT token to the header of every request
 */
apiClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * RESPONSE INTERCEPTOR
 * Provides global error handling and helpful debugging logs
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      console.log('--- API Error: Timeout (Server is likely waking up) ---');
    } else if (!error.response) {
      console.log('--- API Error: Network/Connection Problem ---');
    } else {
      console.log(`--- API Error ${error.response.status}: ${error.response.data?.message} ---`);
    }
    return Promise.reject(error);
  }
);

export default apiClient;