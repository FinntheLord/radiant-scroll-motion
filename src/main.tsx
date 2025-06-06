
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Performance optimizations
const optimizePerformance = () => {
  // Preload critical resources
  const preloadCSS = document.createElement('link');
  preloadCSS.rel = 'preload';
  preloadCSS.as = 'style';
  preloadCSS.href = './styles/base.css';
  document.head.appendChild(preloadCSS);
  
  // Preload fonts with font-display: swap
  const preloadFonts = document.createElement('link');
  preloadFonts.rel = 'preload';
  preloadFonts.as = 'font';
  preloadFonts.type = 'font/woff2';
  preloadFonts.href = 'https://fonts.googleapis.com/css?family=Inter:400,500,600,700&display=swap';
  preloadFonts.crossOrigin = 'anonymous';
  document.head.appendChild(preloadFonts);

  // Optimize images loading
  if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[data-src]');
    images.forEach(img => {
      (img as HTMLImageElement).src = (img as HTMLImageElement).dataset.src!;
    });
  }

  // Service Worker registration for caching (optional)
  if ('serviceWorker' in navigator && import.meta.env.PROD) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        // Silent fail if no service worker
      });
    });
  }
};

// Web Vitals measurement - only in production
const measureWebVitals = async () => {
  if (import.meta.env.PROD) {
    try {
      const webVitals = await import('web-vitals');
      
      if (webVitals.onCLS) webVitals.onCLS(console.log);
      if (webVitals.onINP) webVitals.onINP(console.log);
      if (webVitals.onFCP) webVitals.onFCP(console.log);
      if (webVitals.onLCP) webVitals.onLCP(console.log);
      if (webVitals.onTTFB) webVitals.onTTFB(console.log);
    } catch (error) {
      // Silent fail if web-vitals package is not available
      console.debug('Web Vitals not available');
    }
  }
};

// Initialize optimizations
optimizePerformance();
measureWebVitals();

// Render app
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
