import axios from 'axios';

export const api = axios.create({
    baseURL: 'http://localhost:8000',
    withCredentials: true
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const requestOriginal = error.config;

        if (error.response?.status === 401 && !requestOriginal._retry) {
            requestOriginal._retry = true;

            try {
                await api.post('/api/auth/refresh');
                return api(requestOriginal);
            } catch {
                window.location.href = ('/');
            }
        }

        return Promise.reject(error);
    }
);