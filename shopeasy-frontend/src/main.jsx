import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import {BrowserRouter} from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import './hooks/useDarkMode.jsx';
import {AuthProvider} from './context/AuthContext.jsx';
import {ThemeProvider} from "./context/themeContext.jsx";
import {CartProvider} from "./context/cartContext.jsx";

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <AuthProvider>
            <BrowserRouter>
                <ThemeProvider>
                    <CartProvider>
                        <App />
                    </CartProvider>
                </ThemeProvider>
            </BrowserRouter>
        </AuthProvider>
    </StrictMode>,
)
