
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

console.log('Main.tsx executing - starting application');

const root = document.getElementById("root");
if (!root) {
  console.error('Root element not found');
  throw new Error('Root element not found');
}

console.log('Root element found, creating React root');

try {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  console.log('React app successfully mounted');
} catch (error) {
  console.error('Error mounting React app:', error);
  
  // Fallback rendering without StrictMode
  try {
    ReactDOM.createRoot(root).render(<App />);
    console.log('React app mounted without StrictMode');
  } catch (fallbackError) {
    console.error('Fallback rendering also failed:', fallbackError);
    root.innerHTML = `
      <div style="padding: 20px; color: red; font-family: Arial, sans-serif;">
        <h1>Application Error</h1>
        <p>Failed to load the application. Check console for details.</p>
        <pre>${error.message}</pre>
      </div>
    `;
  }
}
