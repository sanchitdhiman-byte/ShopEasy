import './App.css'
import "./hooks/useDarkMode.jsx"
import Homepage from "./pages/homepage.jsx";
import {Route, Routes} from "react-router-dom";
import Login from "./pages/login.jsx";
import Register from "./pages/register.jsx";
import Cart from "./pages/cart.jsx";
import SellerLayout from "./pages/seller/sellerLayout.jsx";
import Dashboard from "./pages/seller/dashboard.jsx";
import Products from "./pages/seller/products.jsx";
import ProductList from "./pages/productList.jsx";
import Orders from "./pages/seller/orders.jsx";
import Settings from "./pages/seller/settings.jsx";
import Profile from "./pages/profile.jsx";
import Categories from "./pages/categories.jsx";
import Product from "./pages/product.jsx";
import Category from "./pages/category.jsx";
import AddProduct from "./pages/seller/addProduct.jsx";
import EditProduct from "./pages/seller/editProduct.jsx";

function App() {
    return (
        <>
            <Routes>
                <Route path="/" element={<Homepage />}/>
                <Route path="/login" element={<Login />}/>
                <Route path="/register" element={<Register />}/>
                <Route path="/categories" element={<Categories />} />
                <Route path="/products" element={<ProductList />} />
                <Route path="/product/:id" element={<Product/>} />
                <Route path="/category/:id" element={<Category />} />
                <Route path="/seller" element={<SellerLayout />}>
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="products" element={<Products />} />
                    <Route path="orders" element={<Orders />} />
                    <Route path="settings" element={<Settings />} />
                    <Route path="products/add/" element={<AddProduct />} />
                    <Route path="products/edit/:id" element={<EditProduct />} />
                </Route>
                <Route path={"/cart"} element={<Cart />} />
                <Route path={"/profile"} element={<Profile />} />
            </Routes>
        </>
    )
}

export default App
