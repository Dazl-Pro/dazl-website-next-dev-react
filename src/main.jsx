import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Provider } from 'react-redux';
import Store from './store/store.js';
import { BrowserRouter } from 'react-router-dom';
import { GoogleMap, LoadScript } from 'react-google-maps-api';
ReactDOM.createRoot(document.getElementById('root')).render(
    <BrowserRouter>
    <Provider store={Store}>
    <App />
    </Provider>
    </BrowserRouter>
)

