const tokenKey = 'marketgo.auth.token';
let currentUser = null;

export const sessionToken = () => window.localStorage.getItem(tokenKey) || window.sessionStorage.getItem(tokenKey);

export const saveSessionToken = (token, remember) => {
  clearSessionToken();
  (remember ? window.localStorage : window.sessionStorage).setItem(tokenKey, token);
};

export const clearSessionToken = () => {
  window.localStorage.removeItem(tokenKey);
  window.sessionStorage.removeItem(tokenKey);
};

export const apiUser = () => currentUser;
export const setApiUser = (user) => { currentUser = user; };

export const isTokenExpired = (token) => {
  try {
    const segment = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(atob(segment.padEnd(Math.ceil(segment.length / 4) * 4, '=')));
    return !Number.isFinite(payload.exp) || payload.exp * 1000 <= Date.now();
  } catch {
    return true;
  }
};
