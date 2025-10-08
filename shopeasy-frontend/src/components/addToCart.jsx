import React, { useState } from "react";
import { addProductToCart } from "../services/shoppingCartService.js";

const AddToCart = ({ productId, onAddToCart, classes }) => {
    const [loading, setLoading] = useState(false);

    const handleClick = async (e) => {
        e.preventDefault();
        if (!productId) return;
        setLoading(true);

        const res = await addProductToCart({ productId, quantity: 1 });
        setLoading(false);

        if (res.success) {
            if (onAddToCart) onAddToCart(res.data);
            console.log("✅ Product added to cart!");
        } else {
            console.log("❌ " + res.error);
        }
    };

    return (
        <button onClick={handleClick}
                disabled={loading}
                className={classes}>
            {loading ? "Adding..." : "Add to Cart"}
        </button>
    );
};

export default AddToCart;
