import axios from 'axios';

// Base API URL - Update this with your actual backend URL
const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
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

// Response interceptor to handle auth errors
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

// API endpoints
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getCurrentUser: () => api.get('/auth/me'),
};

export const videoAPI = {
  getAllVideos: (params) => api.get('/videos', { params }),
  getVideoById: (id) => api.get(`/videos/${id}`),
  uploadVideo: (formData) => api.post('/videos', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  updateVideo: (id, data) => api.put(`/videos/${id}`, data),
  deleteVideo: (id) => api.delete(`/videos/${id}`),
  likeVideo: (id) => api.post(`/videos/${id}/like`),
  dislikeVideo: (id) => api.post(`/videos/${id}/dislike`),
  searchVideos: (query) => api.get(`/videos/search?q=${query}`),
};

export const commentAPI = {
  getComments: (videoId) => api.get(`/videos/${videoId}/comments`),
  addComment: (videoId, data) => api.post(`/videos/${videoId}/comments`, data),
  updateComment: (commentId, data) => api.put(`/comments/${commentId}`, data),
  deleteComment: (commentId) => api.delete(`/comments/${commentId}`),
};

export const channelAPI = {
  getChannel: (id) => api.get(`/channels/${id}`),
  updateChannel: (id, data) => api.put(`/channels/${id}`, data),
  getChannelVideos: (id) => api.get(`/channels/${id}/videos`),
  subscribeToChannel: (id) => api.post(`/channels/${id}/subscribe`),
  unsubscribeFromChannel: (id) => api.post(`/channels/${id}/unsubscribe`),
};

export default api;