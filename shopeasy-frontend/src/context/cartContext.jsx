import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./authContext.jsx";
import { getCartItems } from "../services/shoppingCartService.js";

const CartContext = createContext();

export function CartProvider({ children }) {
    const { user } = useAuth();
    const [cart, setCart] = useState([]);

    useEffect(() => {
        const fetchCart = async () => {
            if (user?.role === "BUYER") {
                const res = await getCartItems();
                if (res.success) setCart(res.data);
            } else {
                const guestCart = JSON.parse(localStorage.getItem("guestCart")) || [];
                setCart(guestCart);
            }
        };
        fetchCart();
    }, [user]);

    useEffect(() => {
        if (!user) {
            const storedCart = localStorage.getItem("guestCart");
            setCart(storedCart ? JSON.parse(storedCart) : []);
        } else if (user?.role === "BUYER") {
            fetch("/api/cart")
                .then(res => res.json())
                .then(data => setCart(data))
                .catch(() => setCart([]));
        }
    }, [user]);

    const addToCart = (item) => {
        setCart(prev => {
            const existing = prev.find(i => i.productId === item.productId);
            if (existing) {
                // Increase quantity
                const updated = prev.map(i =>
                    i.productId === item.productId
                        ? { ...i, quantity: (i.quantity || 1) + (item.quantity || 1) }
                        : i
                );
                if (!user) localStorage.setItem("guestCart", JSON.stringify(updated));
                return updated;
            } else {
                const updated = [...prev, { ...item, quantity: item.quantity || 1 }];
                if (!user) localStorage.setItem("guestCart", JSON.stringify(updated));
                return updated;
            }
        });

        if (user?.role === "BUYER") {
            fetch("/api/cart/add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(item),
            });
        }
    };

    const removeFromCart = (productId) => {
        setCart(prev => {
            const updated = prev.filter(i => i.productId !== productId);
            if (!user) localStorage.setItem("guestCart", JSON.stringify(updated));
            return updated;
        });

        if (user?.role === "BUYER") {
            fetch(`/api/cart/remove/${productId}`, { method: "DELETE" });
        }
    };


    return (
        <CartContext.Provider value={{ cart, addToCart }}>
            {children}
        </CartContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
    return useContext(CartContext);
}
