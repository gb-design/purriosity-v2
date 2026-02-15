import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { AuthProvider } from './contexts/AuthContext';
import { SavedProductsProvider } from './contexts/SavedProductsContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <SavedProductsProvider>
                    <App />
                </SavedProductsProvider>
            </AuthProvider>
        </BrowserRouter>
    </React.StrictMode>
);
