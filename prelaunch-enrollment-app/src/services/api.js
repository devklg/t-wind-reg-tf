import axios from 'axios';

const API_URL = 'http://localhost:5001/api';

// Create axios instance with default config
const apiClient = axios.create({
    baseURL: API_URL
});

// Add token to requests if it exists
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const api = {
    // Create new enrollment
    createEnrollment: async (data) => {
        const response = await apiClient.post('/enrollments', data);
        // Store the token when creating enrollment
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
        }
        return response.data;
    },

    // Get all enrollments
    getEnrollments: async () => {
        const response = await apiClient.get('/enrollments');
        return response.data;
    },

    // Get single enrollment
    getEnrollment: async (id) => {
        const response = await apiClient.get(`/enrollments/${id}`);
        return response.data;
    },

    // Update enrollment status
    updateEnrollmentStatus: async (id, status) => {
        const response = await apiClient.patch(`/enrollments/${id}/status`, { status });
        return response.data;
    },

    // Delete enrollment
    deleteEnrollment: async (id) => {
        const response = await apiClient.delete(`/enrollments/${id}`);
        return response.data;
    },

    // Update enrollment
    updateEnrollment: async (id, data) => {
        const response = await apiClient.put(`/enrollments/${id}`, data);
        return response.data;
    },
}; 