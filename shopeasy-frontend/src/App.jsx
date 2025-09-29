import './App.css'
import Header from "./components/layout/header.jsx";
import "./hooks/useDarkMode.jsx"
import Homepage from "./pages/homepage.jsx";
import {Route, Routes} from "react-router-dom";
import Login from "./pages/login.jsx";
import Register from "./pages/register.jsx";
import Cart from "./pages/cart.jsx";
import SellerLayout from "./pages/seller/sellerLayout.jsx";
import Dashboard from "./pages/seller/dashboard.jsx";
import Products from "./pages/seller/products.jsx";
import Orders from "./pages/seller/orders.jsx";
import Settings from "./pages/seller/settings.jsx";

function App() {
    return (
        <>
            <Routes>
                <Route path="/" element={<Homepage />}/>
                <Route path="/login" element={<Login />}/>
                <Route path="/register" element={<Register />}/>
                <Route path="/seller" element={<SellerLayout />}>
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="products" element={<Products />} />
                    <Route path="orders" element={<Orders />} />
                    <Route path="settings" element={<Settings />} />
                </Route>
                <Route path={"/cart"} element={<Cart />} />
            </Routes>
        </>
    )
}

export default App
