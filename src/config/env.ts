// Environment configuration
export const env = {
  // App URL for base path configuration
  APP_URL: process.env.APP_URL || '',
  
  // Base path for assets and routes (extracted from APP_URL)
  BASE_PATH: (() => {
    const appUrl = process.env.APP_URL || '';
    if (!appUrl) return '';
    
    // For localhost, always use empty base path
    if (appUrl.includes('localhost') || appUrl.includes('127.0.0.1')) {
      return '';
    }
    
    // If it's a full URL, extract the path part
    if (appUrl.startsWith('http')) {
      return appUrl;
    }
    
    // If it's already a path, return as is
    return appUrl;
  })(),
  
  // Full base URL for absolute URLs
  BASE_URL: process.env.APP_URL || '',
  
  // Check if we're in production
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
  
  // Check if we're in development
  IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
} as const;

// Helper function to get full URL with base path
export const getFullUrl = (path: string): string => {
  const basePath = env.BASE_PATH || '';
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${basePath}${cleanPath}`;
};

// Helper function to get asset URL
export const getAssetUrl = (path: string): string => {
  return getFullUrl(path);
};

// Helper function to get absolute URL (for external references)
export const getAbsoluteUrl = (path: string): string => {
  const baseUrl = env.BASE_URL || '';
  if (!baseUrl) return getFullUrl(path);
  
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
}; 