import axios from 'axios';

// This line looks for the link in your Render Environment Variables
const envApiUrl = import.meta.env?.VITE_API_URL || process.env.REACT_APP_API_URL;

const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? envApiUrl // On Render, it uses the link you saved in the Dashboard
    : "http://localhost:5000/api"; // On your computer, it uses localhost

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminData');
      window.location.href = '/admin';
    }
    return Promise.reject(error);
  }
);

export const testAPI = {
  getTestsByRole: (role) => api.get(`/tests?role=${role}`),
  getTestById: (id) => api.get(`/tests/${id}`),
};

export const submissionAPI = {
  submitTest: (testId, data) => api.post(`/submissions/${testId}/submit`, data),
  getSubmissions: (params = {}) => api.get('/submissions', { params }),
  getSubmissionDetails: (id) => api.get(`/submissions/${id}`),
  gradeSubmission: (id, data) => api.post(`/submissions/${id}/grade`, data),
};

export const adminAPI = {
  login: (credentials) => api.post('/auth/admin/login', credentials),
  getDashboardStats: () => api.get('/admin/dashboard/stats'),
  exportSubmissions: (params = {}) => api.get('/admin/export', { 
    params,
    responseType: 'blob' 
  }),
};

export default api;
