// PWA Configuration
export const PWA_CONFIG = {
  // Set this to false to completely disable PWA functionality
  enabled: false,

  // Service worker configuration
  serviceWorker: {
    enabled: true,
    path: "/sw.js",
  },

  // Install prompt configuration
  installPrompt: {
    enabled: true,
    autoShow: false, // Set to true to show install prompt automatically
  },

  // Offline indicator configuration
  offlineIndicator: {
    enabled: true,
  },

  // PWA install guide configuration
  installGuide: {
    enabled: true,
  },
} as const;

// Helper function to check if PWA is enabled
export const isPWAEnabled = () => PWA_CONFIG.enabled;

// Helper function to check if specific PWA feature is enabled
export const isPWAFeatureEnabled = (
  feature: "serviceWorker" | "installPrompt" | "offlineIndicator" | "installGuide"
) => {
  return PWA_CONFIG.enabled && PWA_CONFIG[feature].enabled;
};
