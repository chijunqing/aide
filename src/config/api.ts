interface ApiConfig {
  baseURL: string;
}

const defaultConfig: ApiConfig = {
  baseURL: 'http://127.0.0.1:7081'
};

// Get configuration from environment variables or use defaults
const config: ApiConfig = {
  baseURL: import.meta.env.VITE_API_BASE_URL || defaultConfig.baseURL
};

export const getApiUrl = (path: string): string => {
  return `${config.baseURL}${path}`;
};

export default config; 