import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import { Buffer } from 'buffer';

// Polyfill Buffer for the entire application
window.Buffer = window.Buffer || Buffer;

// Add performance optimization for animations
// This disables React StrictMode which can cause animations to run twice in development
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
); 