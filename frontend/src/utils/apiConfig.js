const rawApiBaseUrl = process.env.REACT_APP_API_URL || 'http://93.127.136.228:5000';
// const rawApiBaseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const API_BASE_URL = rawApiBaseUrl
  .replace(/\/api\/?$/, '')
  .replace(/\/$/, '');

export default API_BASE_URL;

