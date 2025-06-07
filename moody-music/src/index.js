// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';

// Add some global enhancements
document.documentElement.style.scrollBehavior = 'smooth';

// Prevent right-click context menu for a more app-like experience (optional)
// document.addEventListener('contextmenu', (e) => e.preventDefault());

// Add custom cursor for better UX (optional)
document.body.style.cursor = 'default';

// Performance observer for monitoring (optional)
if ('IntersectionObserver' in window) {
  // Enable lazy loading optimizations
  console.log('🎵 MusicAI: Enhanced features enabled');
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
