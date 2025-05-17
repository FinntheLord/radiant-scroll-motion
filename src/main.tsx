
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Function to add preload hints
const addPreloadHints = () => {
  // Preload critical CSS
  const preloadCSS = document.createElement('link');
  preloadCSS.rel = 'preload';
  preloadCSS.as = 'style';
  preloadCSS.href = './styles/base.css';
  document.head.appendChild(preloadCSS);
  
  // Preload icons font if using them
  const preloadFonts = document.createElement('link');
  preloadFonts.rel = 'preload';
  preloadFonts.as = 'font';
  preloadFonts.type = 'font/woff2';
  preloadFonts.href = 'https://fonts.googleapis.com/css?family=Inter:400,500,600,700&display=swap';
  preloadFonts.crossOrigin = 'anonymous';
  document.head.appendChild(preloadFonts);
};

// Initialize preloading
addPreloadHints();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
