import axios from 'axios';
import { API_URL } from '@env';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

let getToken;

/**
 * Sets the Bearer auth token to the current user's token.
 * @param {Function} tokenGetter - Returns the current user's token.
 */
const setTokenGetter = (tokenGetter) => {
  getToken = tokenGetter;
};

// Axios interceptor
api.interceptors.request.use(
  (apiConfig) => {
    const token = getToken();
    if (token) {
      apiConfig.headers['Authorization'] = `Bearer ${token}`;
    }
    return apiConfig;
  }
);

const apiService = {
  setTokenGetter,
  getUsers: () => api.get('/users'),
  getFeed: (url) => api.get(url),
  getSurveys: (url) => api.get(url),
  getQuestions: (surveyId) => api.get(`/questions/${surveyId}`),
  getResponses: (surveyId) => api.get(`/responses/${surveyId}`),
  postSurvey: (body) => api.post('/surveys', body),
  postResponse: (body) => api.post('/responses', body),
  postResponder: (body) => api.post('/responder', body),
  postRemove: (body) => api.post('/remove', body),
  deleteSurvey: (surveyId) => api.delete(`/surveys/${surveyId}`),
  deleteUser: (username, userId) => api.delete(`/delete/${username}/${userId}`),
}

export default apiService;
