import axios from 'axios';
import { platformApiBaseUrl } from './api-endpoints.js';

export class BaseApi {
  #http;

  constructor() {
    this.#http = axios.create({
      baseURL: platformApiBaseUrl,
      headers: { 'Content-Type': 'application/json' },
    });

    this.#http.interceptors.request.use((config) => {
      const token = window.localStorage.getItem('marketgo.auth.token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    this.#http.interceptors.response.use(
      (response) => response,
      (error) => Promise.reject(error),
    );
  }

  get http() {
    return this.#http;
  }
}
