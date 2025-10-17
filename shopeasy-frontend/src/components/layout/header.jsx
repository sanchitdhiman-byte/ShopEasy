import {useEffect, useRef, useState} from "react";
import {Link} from "react-router-dom";
import shopEasyLogoDark from "../../assets/shopeasy-name-only-dark.png";
import shopEasyLogoLight from "../../assets/shopeasy-name-only-light.png";
import {useDarkMode} from "../../context/themeContext.jsx";
import {useAuth} from "../../context/authContext.jsx";
import {useSearch} from "../../hooks/useSearch.jsx";
import {useCart} from "../../context/cartContext.jsx";

function Header() {
    const { isDark, toggleDarkMode } = useDarkMode();
    const { user, logout } = useAuth();
    const { cart } = useCart();
    const { results, loading, search} = useSearch();

    const [query, setQuery] = useState("");
    const [isSearchDropdown, setIsSearchDropdown] = useState(false);
    const searchRef = useRef(null);

    useEffect(() => {
        if (query.trim()) {
            const timeout = setTimeout(() => search(query), 300);
            return () => clearTimeout(timeout);
        }
    }, [query, search]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (searchRef.current && !searchRef.current.contains(e.target)) {
                setIsSearchDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);


    return (
        <header className={`flex items-center justify-between px-8 py-3 ${
                    isDark ? "bg-blue-950 text-white" : "bg-white text-gray-900"
                } shadow-lg fixed top-0 left-0 right-0 z-50 transition-colors duration-300`}>
            <div className="flex items-center flex-shrink-0">
                <Link to={ (user && user.role === "SELLER") ? "/seller/dashboard" : "/" }>
                    <img src={isDark ? shopEasyLogoDark : shopEasyLogoLight}
                         alt="ShopEasy Logo"
                         className="h-10 w-auto hover:scale-105 transition-transform"
                    />
                </Link>
            </div>

            <div ref={searchRef}
                 className={`relative flex items-center w-1/2 max-w-lg px-4 py-2 rounded-full ${
                     isDark ? "border-gray-700 bg-blue-900/80" : "border-gray-300 bg-gray-200"
                 } transition`}>
                <input type="text"
                       placeholder="Search"
                       value={query}
                       onChange={(e) => setQuery(e.target.value)}
                       onFocus={() => setIsSearchDropdown(true)}
                       className={`flex-1 bg-transparent w-full focus:outline-none font-[Poppins] ${
                           isDark ? "text-white placeholder-gray-400" : "text-gray-900 placeholder-gray-500"
                       }`}
                />
                <span className={`material-symbols-rounded text-xl select-none ${
                            isDark ? "text-gray-400" : "text-gray-500"
                        }`}>
                    search
                </span>

                { isSearchDropdown && query.trim() && (
                    <div className={`absolute top-full left-0 mt-2 w-full rounded-lg shadow-lg ${
                            isDark ? "bg-blue-900 text-white" : "bg-white text-gray-900"
                        } transition-all duration-300 ease-in-out`}>
                        { loading ?
                            (
                                <div className="p-4 text-sm opacity-70">Searching...</div>
                            ) : (
                                <>
                                    <div key="products" className="p-2">
                                        <h5 className="text-xs font-semibold uppercase opacity-70">Products</h5>
                                        <div className="mt-1 flex flex-col gap-1">
                                            {results?.products?.length > 0 ?
                                                (
                                                    results.products.map((product) => (
                                                        <Link key={product.productId}
                                                              to={`/product/${product.productId}`}
                                                              className={`block px-2 py-1 rounded ${
                                                                  isDark ? "hover:bg-blue-800" : "hover:bg-gray-100"
                                                              }`}
                                                              onClick={() => {
                                                                  setIsSearchDropdown(false);
                                                                  setQuery(product.productName);
                                                              }}>
                                                            {product.productName}
                                                        </Link>
                                                    ))
                                                ) : (
                                                    <div className="text-sm opacity-70">No products found</div>
                                                )
                                            }
                                    </div>
                                </div>

                                <div key="categories" className="p-2 border-t border-gray-300/20">
                                    <h5 className="text-xs font-semibold uppercase opacity-70">Categories</h5>
                                    <div className="mt-1 flex flex-col gap-1">
                                        {results?.categories?.length > 0 ? (
                                            results.categories.map((cat) => (
                                                <Link key={cat.categoryId}
                                                   to={`/category/${cat.categoryId}`}
                                                   className={`block px-2 py-1 rounded ${
                                                       isDark ? "hover:bg-blue-800" : "hover:bg-gray-100"
                                                   }`}
                                                   onClick={() => {
                                                       setIsSearchDropdown(false);
                                                       setQuery(cat.categoryName);
                                                   }}>
                                                    {cat.categoryName}
                                                </Link>
                                            ))
                                        ) : (
                                            <div className="text-sm opacity-70">No categories found</div>
                                        )}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>


            <div className="flex items-center flex-shrink-0 gap-1.5">
                <button onClick={toggleDarkMode}
                        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
                        className={`p-2 w-10 h-10 flex items-center justify-center rounded-full ${
                            isDark ? "hover:bg-indigo-800 bg-blue-900/70" : "hover:bg-gray-200 bg-gray-100"} transition`}>
                    <span className="material-symbols-rounded text-2xl">
                        {isDark ? "light_mode" : "dark_mode"}
                    </span>
                </button>

                {(user?.role === "BUYER" || !user) && (
                    <Link to="/cart"
                          className={`flex w-10 h-10 items-center justify-center gap-2 px-3 py-2 rounded-full font-medium ${
                              isDark
                                  ? "bg-blue-900/70 hover:bg-indigo-800 text-white"
                                  : "bg-gray-100 hover:bg-gray-200 text-gray-900"
                          } transition`}>
                                <span className="material-symbols-rounded text-xl items-center justify-center">
                                    shopping_cart
                                </span>
                    </Link>
                )}

                {user ?
                    (
                        <div className="flex items-center gap-1.5">
                            <Link to="/profile"
                               className={`flex w-10 h-10 items-center justify-center gap-2 px-3 py-2 rounded-full font-medium ${
                                   isDark
                                       ? "bg-blue-900/70 hover:bg-indigo-800 text-white"
                                       : "bg-gray-100 hover:bg-gray-200 text-gray-900"
                               } transition`}>
                                <span className="material-symbols-rounded text-xl items-center justify-center">
                                    account_circle
                                </span>
                            </Link>
                            <button onClick={logout}
                                    className={`px-3 w-10 h-10 flex py-2 rounded-full font-medium items-center justify-center gap-1 ${
                                        isDark
                                            ? "bg-red-600 hover:bg-red-700 text-white"
                                            : "bg-red-100 hover:bg-red-200 text-red-800"
                                    } transition`}>
                                <span className="material-symbols-rounded text-xl items-center justify-center">
                                    logout
                                </span>
                            </button>
                        </div>
                    ) : (
                        <Link to="/login"
                           className={`flex items-center justify-center gap-2 px-3 py-2 rounded-full font-medium ${
                               isDark
                                   ? "bg-blue-900/70 hover:bg-indigo-800 text-white"
                                   : "bg-blue-600 hover:bg-blue-500 text-white"
                           } transition`}>
                            <span className="material-symbols-rounded text-xl">
                                login
                            </span>
                            Login
                        </Link>
                    )
                }
            </div>
        </header>
    );
}

export default Header;
