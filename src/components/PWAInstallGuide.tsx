'use client';

import { useState } from 'react';

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
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl border border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Install Groshify</h2>
          <button
            onClick={hideInstallGuide}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="space-y-6">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-3 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
              Chrome / Edge
            </h3>
            <ol className="list-decimal list-inside text-sm space-y-2 text-blue-800">
              <li>Click the menu (⋮) in the address bar</li>
              <li>Select &ldquo;Install Groshify&rdquo;</li>
              <li>Click &ldquo;Install&rdquo; to confirm</li>
            </ol>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h3 className="font-semibold text-green-900 mb-3 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Safari (iOS)
            </h3>
            <ol className="list-decimal list-inside text-sm space-y-2 text-green-800">
              <li>Tap the Share button (□↑)</li>
              <li>Scroll down and tap &ldquo;Add to Home Screen&rdquo;</li>
              <li>Tap &ldquo;Add&rdquo; to confirm</li>
            </ol>
          </div>
          
          <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
            <h3 className="font-semibold text-orange-900 mb-3 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
              Firefox
            </h3>
            <ol className="list-decimal list-inside text-sm space-y-2 text-orange-800">
              <li>Click the menu (☰) in the address bar</li>
              <li>Select &ldquo;Install App&rdquo;</li>
              <li>Click &ldquo;Install&rdquo; to confirm</li>
            </ol>
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