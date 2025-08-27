import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/HoopCast/', // Ensure this matches your GitHub repository name
  plugins: [react()],
});

// filepath: /Users/abdulkafinirig/Documents/basketball-schedule/src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { HashRouter as Router, Route, Navigate } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <Route path="/" element={<Navigate to="/Home" />} />
      <App />
    </Router>
  </React.StrictMode>
);
