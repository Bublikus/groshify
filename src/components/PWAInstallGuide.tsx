'use client';

import { useState } from 'react';
import { Smartphone, X, Menu, Download } from 'lucide-react';
import { Typography } from '@/components/ui/typography';

export function PWAInstallGuide() {
  const [isVisible, setIsVisible] = useState(false);

  const showInstallGuide = () => setIsVisible(true);
  const hideInstallGuide = () => setIsVisible(false);

  if (!isVisible) {
    return (
      <button
        onClick={showInstallGuide}
        className="fixed bottom-4 right-4 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-40"
        title="Install App"
      >
        <Smartphone className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl border border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <Typography variant="h2" className="text-2xl font-bold text-gray-900">Install Groshify</Typography>
          <button
            onClick={hideInstallGuide}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="space-y-6">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <Typography variant="h3" className="font-semibold text-blue-900 mb-3 flex items-center">
              <Menu className="w-5 h-5 mr-2" />
              Chrome / Edge
            </Typography>
            <Typography variant="list" className="list-decimal list-inside text-sm space-y-2 text-blue-800">
              <Typography variant="listItem">Click the menu (⋮) in the address bar</Typography>
              <Typography variant="listItem">Select &ldquo;Install Groshify&rdquo;</Typography>
              <Typography variant="listItem">Click &ldquo;Install&rdquo; to confirm</Typography>
            </Typography>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <Typography variant="h3" className="font-semibold text-green-900 mb-3 flex items-center">
              <Download className="w-5 h-5 mr-2" />
              Safari (iOS)
            </Typography>
            <Typography variant="list" className="list-decimal list-inside text-sm space-y-2 text-green-800">
              <Typography variant="listItem">Tap the Share button (□↑)</Typography>
              <Typography variant="listItem">Scroll down and tap &ldquo;Add to Home Screen&rdquo;</Typography>
              <Typography variant="listItem">Tap &ldquo;Add&rdquo; to confirm</Typography>
            </Typography>
          </div>
          
          <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
            <Typography variant="h3" className="font-semibold text-orange-900 mb-3 flex items-center">
              <Menu className="w-5 h-5 mr-2" />
              Firefox
            </Typography>
            <Typography variant="list" className="list-decimal list-inside text-sm space-y-2 text-orange-800">
              <Typography variant="listItem">Click the menu (☰) in the address bar</Typography>
              <Typography variant="listItem">Select &ldquo;Install App&rdquo;</Typography>
              <Typography variant="listItem">Click &ldquo;Install&rdquo; to confirm</Typography>
            </Typography>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={hideInstallGuide}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
} 