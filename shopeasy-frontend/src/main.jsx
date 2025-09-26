import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Login from './pages/login.jsx'
import Register from './pages/register.jsx'
import './index.css'
import App from './App.jsx'
import './hooks/useDarkMode.jsx';
import {AuthProvider} from './context/AuthContext.jsx';

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<App/>}/>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/register" element={<Register />}/>
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    </StrictMode>,
)
