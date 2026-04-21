import axios from 'axios';

const API_URL = 'http://localhost:5000';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Schools API
export const fetchSchools = async (limit = 20, offset = 0) => {
  const response = await api.get(`/schools?limit=${limit}&offset=${offset}`);
  return response.data;
};

export const searchSchools = async (query, limit = 20, offset = 0) => {
  const response = await api.get(`/schools/search?q=${encodeURIComponent(query)}&limit=${limit}&offset=${offset}`);
  return response.data;
};

// Academic Navigation API
export const getFieldsBySchool = async (schoolId) => {
  const response = await api.get(`/api/schools/${schoolId}/fields`);
  return response.data;
};

export const getSemestersByField = async (fieldId) => {
  const response = await api.get(`/api/fields/${fieldId}/semesters`);
  return response.data;
};

export const getModulesBySemester = async (semesterId) => {
  const response = await api.get(`/api/semesters/${semesterId}/modules`);
  return response.data;
};

export const getModuleDetail = async (moduleId) => {
  const response = await api.get(`/api/modules/${moduleId}`);
  return response.data;
};

// Resources API
export const getTrendingResources = async (limit = 20, offset = 0) => {
  const response = await api.get(`/api/resources/trending?limit=${limit}&offset=${offset}`);
  return response.data;
};

export const getResourcesByModule = async (moduleId, limit = 50, offset = 0) => {
  const response = await api.get(`/api/modules/${moduleId}/resources?limit=${limit}&offset=${offset}`);
  return response.data;
};

export const uploadResource = async (moduleId, formData) => {
  const response = await api.post(`/api/modules/${moduleId}/resources`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

export const getResourceDetail = async (resourceId) => {
  const response = await api.get(`/api/resources/${resourceId}`);
  return response.data;
};

export const deleteResource = async (resourceId) => {
  const response = await api.delete(`/api/resources/${resourceId}`);
  return response.data;
};

// Interactions API
export const getComments = async (resourceId) => {
  const response = await api.get(`/api/resources/${resourceId}/comments`);
  return response.data;
};

export const addComment = async (resourceId, content, parentId = null) => {
  const response = await api.post(`/api/resources/${resourceId}/comments`, { content, parentId });
  return response.data;
};

export const addReaction = async (resourceId, type) => {
  const response = await api.post(`/api/resources/${resourceId}/reactions`, { type });
  return response.data;
};

export const deleteComment = async (commentId) => {
  const response = await api.delete(`/api/resources/comments/${commentId}`);
  return response.data;
};

export const removeReaction = async (resourceId) => {
  const response = await api.delete(`/api/resources/${resourceId}/reactions`);
  return response.data;
};

export const trackView = async (resourceId) => {
  const response = await api.post(`/api/resources/${resourceId}/views`);
  return response.data;
};

// Reviews API
export const getSchoolReviews = async (schoolId, limit = 10, offset = 0) => {
  const response = await api.get(`/api/reviews/${schoolId}?limit=${limit}&offset=${offset}`);
  return response.data;
};

export const addReview = async (schoolId, rating, comment) => {
  const response = await api.post(`/api/reviews/${schoolId}`, { rating, comment });
  return response.data;
};

export const deleteReview = async (reviewId) => {
  const response = await api.delete(`/api/reviews/${reviewId}`);
  return response.data;
};

// Location API
export const fetchCountries = async () => {
  const response = await api.get('/api/locations/countries');
  return response.data;
};

export const fetchCitiesByCountry = async (countryId) => {
  const response = await api.get(`/api/locations/countries/${countryId}/cities`);
  return response.data;
};

// Professor API
export const getProfessorDashboard = async () => {
  const response = await api.get('/api/professor/dashboard');
  return response.data;
};

export default api;
