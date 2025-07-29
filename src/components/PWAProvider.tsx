'use client';

import { useEffect, useState } from 'react';
import { PWAInstallGuide } from './PWAInstallGuide';
import { isPWAEnabled, isPWAFeatureEnabled } from '@/config/pwa';
import { getAssetUrl } from '@/config/env';
import { AlertTriangle, Smartphone, X } from 'lucide-react';
import { Typography } from '@/components/ui/typography';

interface PWAProviderProps {
  children: React.ReactNode;
}

// Type for the BeforeInstallPromptEvent
interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PWAProvider({ children }: PWAProviderProps) {
  const [isOnline, setIsOnline] = useState(true);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    // Only run PWA functionality if enabled
    if (!isPWAEnabled()) {
      return;
    }

    // Register service worker
    if (isPWAFeatureEnabled('serviceWorker') && 'serviceWorker' in navigator) {
      navigator.serviceWorker
        .register(getAssetUrl('/sw.js'))
        .then((registration) => {
          console.log('SW registered: ', registration);
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError);
        });
    }

    // Handle online/offline status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    if (isPWAFeatureEnabled('offlineIndicator')) {
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
    }

    // Handle PWA install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      if (!isPWAFeatureEnabled('installPrompt')) return;
      
      e.preventDefault();
      if (e instanceof Event && 'prompt' in e && 'userChoice' in e) {
        setDeferredPrompt(e as BeforeInstallPromptEvent);
      }
      setShowInstallPrompt(true);
    };

    if (isPWAFeatureEnabled('installPrompt')) {
      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    }

    // Handle app installed
    const handleAppInstalled = () => {
      console.log('PWA was installed');
      setShowInstallPrompt(false);
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      if (isPWAFeatureEnabled('offlineIndicator')) {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      }
      if (isPWAFeatureEnabled('installPrompt')) {
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      }
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      setDeferredPrompt(null);
      setShowInstallPrompt(false);
    }
  };

  return (
    <>
      {children}
      
      {/* Offline indicator */}
      {isPWAEnabled() && isPWAFeatureEnabled('offlineIndicator') && !isOnline && (
        <div className="fixed top-0 left-0 right-0 bg-amber-500 text-amber-900 text-center py-3 px-4 z-50 shadow-lg border-b border-amber-600">
          <div className="flex items-center justify-center space-x-2">
            <AlertTriangle className="w-5 h-5" />
            <Typography variant="large" className="font-semibold">You are currently offline. Some features may be limited.</Typography>
          </div>
        </div>
      )}

      {/* Install prompt */}
      {isPWAEnabled() && isPWAFeatureEnabled('installPrompt') && showInstallPrompt && (
        <div className="fixed bottom-4 left-4 right-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-xl shadow-2xl border border-blue-500 z-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                <Smartphone className="w-6 h-6" />
              </div>
              <div>
                <Typography variant="h3" className="font-bold text-lg">Install Groshify</Typography>
                <Typography variant="muted" className="text-blue-100 text-sm">Add to home screen for quick access</Typography>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleInstallClick}
                className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Install
              </button>
              <button
                onClick={() => setShowInstallPrompt(false)}
                className="text-white hover:text-blue-100 transition-colors p-2 rounded-full hover:bg-white hover:bg-opacity-20"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PWA Install Guide */}
      {isPWAEnabled() && isPWAFeatureEnabled('installGuide') && <PWAInstallGuide />}
    </>
  );
} 