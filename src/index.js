import React from 'react';
import ReactDOM from 'react-dom/client'; // Importe de 'react-dom/client'
import App from './App';
import './index.css';

// Crie uma raiz e renderize o App
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);