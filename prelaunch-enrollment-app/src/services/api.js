import axios from 'axios';
import { toast } from 'react-toastify';

// Function to test connection to a specific port
const testConnection = async (port) => {
    try {
        console.log(`Testing connection to port ${port}...`);
        const response = await axios.get(`http://localhost:${port}/health`, {
            withCredentials: true,
            timeout: 1000,
            headers: {
                'Accept': 'application/json'
            }
        });
        console.log(`Successfully connected to port ${port}`);
        return response.status === 200;
    } catch (error) {
        console.log(`Port ${port} not available:`, error.message);
        return false;
    }
};

// Function to find the correct API port
const findApiPort = async () => {
    // Try to read port from config file first
    try {
        const response = await fetch('/config/server-port.json');
        if (response.ok) {
            const config = await response.json();
            console.log('Found port in config:', config.port);
            if (await testConnection(config.port)) {
                return config.port;
            }
        }
    } catch (error) {
        console.log('Could not read port from config file:', error.message);
    }

    // Try common ports if config file read fails
    const ports = [5000, 5001, 5002, 5003];
    for (const port of ports) {
        if (await testConnection(port)) {
            console.log('Found working port:', port);
            return port;
        }
    }
    throw new Error('Could not connect to API server on any known port');
};

// Create axios instance with default config
const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// API methods
const apiService = {
    // Auth methods
    login: async (credentials) => {
        try {
            console.log('Attempting login with:', credentials);
            const response = await api.post('/enrollments/login', credentials);
            console.log('Login response:', response);
            return response;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    },

    // Enrollment methods
    createEnrollment: async (enrollmentData) => {
        try {
            console.log('Creating enrollment with data:', enrollmentData);
            const response = await api.post('/enrollments', enrollmentData);
            console.log('Enrollment creation response:', response);
            return response;
        } catch (error) {
            console.error('Enrollment creation error:', error);
            throw error;
        }
    },

    getEnrollment: async (id) => {
        try {
            console.log('Fetching enrollment with ID:', id);
            const response = await api.get(`/enrollments/${id}`);
            console.log('Enrollment fetch response:', response);
            return response;
        } catch (error) {
            console.error('Error fetching enrollment:', error);
            throw error;
        }
    },

    updateEnrollment: async (id, data) => {
        try {
            console.log('Updating enrollment:', id, data);
            const response = await api.put(`/enrollments/${id}`, data);
            console.log('Enrollment update response:', response);
            return response;
        } catch (error) {
            console.error('Error updating enrollment:', error);
            throw error;
        }
    },

    // Get all enrollees
    getAllEnrollees: async () => {
        try {
            console.log('Fetching all enrollees...');
            const response = await api.get('/enrollments/all-enrollees');
            console.log('All enrollees response:', response);
            return response;
        } catch (error) {
            console.error('Error fetching all enrollees:', error);
            throw error;
        }
    },

    // Get user's downline
    getDownline: async () => {
        try {
            console.log('Fetching user downline...');
            const response = await api.get('/enrollments/downline');
            console.log('Downline response:', response);
            return response;
        } catch (error) {
            console.error('Error fetching downline:', error);
            throw error;
        }
    }
};

export { apiService as api }; 