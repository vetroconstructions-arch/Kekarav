import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import NotFound from './components/NotFound.jsx'
import './index.css'

const path = window.location.pathname;
const isHome = path === '/' || path === '/index.html';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        {isHome ? <App /> : <NotFound />}
    </React.StrictMode>,
)
