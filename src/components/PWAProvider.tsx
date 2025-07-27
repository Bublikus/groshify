'use client';

import { useEffect, useState } from 'react';
import { PWAInstallGuide } from './PWAInstallGuide';
import { isPWAEnabled, isPWAFeatureEnabled } from '@/config/pwa';
import { getAssetUrl } from '@/config/env';

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
      setDeferredPrompt(e as BeforeInstallPromptEvent);
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
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span className="font-semibold">You are currently offline. Some features may be limited.</span>
          </div>
        </div>
      )}

      {/* Install prompt */}
      {isPWAEnabled() && isPWAFeatureEnabled('installPrompt') && showInstallPrompt && (
        <div className="fixed bottom-4 left-4 right-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-xl shadow-2xl border border-blue-500 z-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-lg">Install Groshify</h3>
                <p className="text-blue-100 text-sm">Add to home screen for quick access</p>
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
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
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