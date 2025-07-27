// Environment configuration
export const env = {
  // App URL for base path configuration
  APP_URL: process.env.APP_URL || '',

  // Check if we're in production
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
  
  // Check if we're in development
  IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
} as const;

// Helper function to get full URL with base path
export const getFullUrl = (path: string): string => {
  const basePath = env.APP_URL || '';
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${basePath}${cleanPath}`;
};

// Helper function to get asset URL
export const getAssetUrl = (path: string): string => {
  return getFullUrl(path);
};

// Helper function to get absolute URL (for external references)
export const getAbsoluteUrl = (path: string): string => {
  const baseUrl = env.APP_URL || '';
  if (!baseUrl) return getFullUrl(path);
  
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
}; 