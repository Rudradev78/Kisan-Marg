import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Your live Render URL
const API_BASE_URL = 'https://kisan-marg-backend.onrender.com/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  // 60s timeout helps handle Render's "Cold Start" spin-up time
  timeout: 60000, 
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

/**
 * REQUEST INTERCEPTOR
 * Reaches into the unified 'userData' object to fetch the token
 */
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const session = await AsyncStorage.getItem('userData');
      
      if (session) {
        const parsedData = JSON.parse(session);
        const token = parsedData.token; // 🟢 Extract token from the object

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    } catch (error) {
      console.log("Error attaching token in api.js:", error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * RESPONSE INTERCEPTOR
 * Global error monitoring for easier debugging during your BCA demo
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      console.log('--- API Error: Timeout (Server waking up) ---');
    } else if (!error.response) {
      console.log('--- API Error: Connection Lost ---');
    } else {
      // Log the specific status (like 401 or 404) and the backend message
      console.log(`--- API Error ${error.response.status}: ${error.response.data?.message || 'Unknown Error'} ---`);
    }
    return Promise.reject(error);
  }
);

export default apiClient;