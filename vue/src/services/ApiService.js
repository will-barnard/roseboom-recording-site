import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if it exists
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default {
  // Auth
  login(credentials) {
    return apiClient.post('/auth/login', credentials);
  },
  register(userData) {
    return apiClient.post('/auth/register', userData);
  },
  verifyToken() {
    return apiClient.get('/auth/verify');
  },
  changePassword(passwordData) {
    return apiClient.post('/auth/change-password', passwordData);
  },

  // Projects
  getProjects() {
    return apiClient.get('/projects');
  },
  getProject(id) {
    return apiClient.get(`/projects/${id}`);
  },
  createProject(formData) {
    return apiClient.post('/projects', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  updateProject(id, formData) {
    return apiClient.put(`/projects/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  deleteProject(id) {
    return apiClient.delete(`/projects/${id}`);
  },
  reorderProjects(projectIds) {
    return apiClient.post('/projects/reorder', { projectIds });
  },

  // Videos
  getVideos() {
    return apiClient.get('/videos');
  },
  getVideo(id) {
    return apiClient.get(`/videos/${id}`);
  },
  createVideo(videoData) {
    return apiClient.post('/videos', videoData);
  },
  updateVideo(id, videoData) {
    return apiClient.put(`/videos/${id}`, videoData);
  },
  deleteVideo(id) {
    return apiClient.delete(`/videos/${id}`);
  },
  reorderVideos(videoIds) {
    return apiClient.post('/videos/reorder', { videoIds });
  },

  // Content
  getHomeContent() {
    return apiClient.get('/content/home');
  },
  updateHomeContent(content) {
    return apiClient.put('/content/home', { content });
  }
};
