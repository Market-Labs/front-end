import axios from 'axios';
import { platformApiBaseUrl } from './api-endpoints.js';
import { clearSessionToken, sessionToken, setApiUser } from './api-session.js';

export class BaseApi {
  #http;

  constructor() {
    this.#http = axios.create({
      baseURL: platformApiBaseUrl,
      headers: { 'Content-Type': 'application/json' },
    });

    this.#http.interceptors.request.use((config) => {
      const token = sessionToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    this.#http.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          clearSessionToken();
          setApiUser(null);
          if (!['/login', '/sign-up'].includes(window.location.pathname)) window.location.assign('/login');
        }
        return Promise.reject(error);
      },
    );
  }

  get http() {
    return this.#http;
  }
}
