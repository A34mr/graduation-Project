import axios from 'axios';

// Base API configuration
const API_URL = 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor - add auth token to requests
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

// Response interceptor - handle errors globally
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            // Handle 401 Unauthorized - token expired or invalid
            if (error.response.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                // Redirect to login or show error
                if (window.location.pathname !== '/login') {
                    window.location.href = '/login';
                }
            }
            // Handle 403 Forbidden - access denied
            if (error.response.status === 403) {
                console.error('Access denied:', error.response.data.message);
            }
        }
        return Promise.reject(error);
    }
);

// Auth API calls
export const authAPI = {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data),
    getProfile: () => api.get('/auth/profile'),
    updateProfile: (data) => api.put('/auth/profile', data),
};

// Appointment API calls
export const appointmentsAPI = {
    create: (data) => api.post('/appointments', data),
    getAll: (params) => api.get('/appointments', { params }),
    getById: (id) => api.get(`/appointments/${id}`),
    updateStatus: (id, data) => api.patch(`/appointments/${id}`, data),
    updatePayment: (id, data) => api.patch(`/appointments/${id}/payment`, data),
    cancel: (id, data) => api.delete(`/appointments/${id}`, { data }),
    getAvailableSlots: (doctorId, date) => api.get(`/appointments/slots/${doctorId}/${date}`),
};

// Clinic API calls
export const clinicsAPI = {
    getAll: (params) => api.get('/clinics', { params }),
    search: (params) => api.get('/clinics/search', { params }),
    getById: (id) => api.get(`/clinics/${id}`),
    getClinicDoctors: (id) => api.get(`/clinics/${id}/doctors`),
    register: (data) => api.post('/clinics/register', data),
    updateProfile: (data) => api.put('/clinics/profile', data),
    getStats: () => api.get('/clinics/profile/stats'),
};

// Medical History API calls
export const medicalHistoryAPI = {
    get: () => api.get('/medical-history'),
    createOrUpdate: (data) => api.post('/medical-history', data),
    addDisease: (data) => api.post('/medical-history/diseases', data),
    removeDisease: (id) => api.delete(`/medical-history/diseases/${id}`),
    addMedication: (data) => api.post('/medical-history/medications', data),
    updateAllergies: (data) => api.put('/medical-history/allergies', data),
    getSummary: (patientId) => api.get(`/medical-history/summary/${patientId}`),
};

// Review API calls
export const reviewsAPI = {
    create: (data) => api.post('/reviews', data),
    getDoctorReviews: (doctorId) => api.get(`/reviews/doctor/${doctorId}`),
    getClinicReviews: (clinicId) => api.get(`/reviews/clinic/${clinicId}`),
    getMyReviews: () => api.get('/reviews/my/reviews'),
    update: (id, data) => api.put(`/reviews/${id}`, data),
    delete: (id) => api.delete(`/reviews/${id}`),
    markHelpful: (id) => api.post(`/reviews/${id}/helpful`),
    getStats: (doctorId) => api.get(`/reviews/stats/${doctorId}`),
};

// Message/Chat API calls
export const messagesAPI = {
    send: (data) => api.post('/messages', data),
    getConversations: () => api.get('/messages/conversations'),
    getConversation: (userId, userModel) => api.get(`/messages/conversation/${userId}/${userModel}`),
    markAsRead: (id) => api.patch(`/messages/${id}/read`),
    delete: (id) => api.delete(`/messages/${id}`),
    search: (query) => api.get('/messages/search', { params: { query } }),
    getUnreadCount: () => api.get('/messages/unread/count'),
};

// Upload API calls
export const uploadAPI = {
    uploadImage: (formData) => api.post('/upload/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    }),
    uploadMultipleImages: (formData) => api.post('/upload/images', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    }),
    uploadDocument: (formData) => api.post('/upload/document', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    }),
    deleteFile: (filename) => api.delete(`/upload/${filename}`),
};

export default api;
