import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useDarkMode } from "../../context/themeContext.jsx";
import Header from "../../components/layout/header.jsx";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

function SellerLayout() {
    const { isDark } = useDarkMode();
    const location = useLocation();
    const [indicatorStyle, setIndicatorStyle] = useState({});
    const navRefs = useRef({});

    useEffect(() => {
        const activeRef = navRefs.current[location.pathname];
        if (activeRef) {
            const { offsetLeft, offsetWidth } = activeRef;
            setIndicatorStyle({
                left: offsetLeft,
                width: offsetWidth,
            });
        }
    }, [location.pathname]);

    const links = [
        { to: "/seller/dashboard", label: "Overview", icon: "home" },
        { to: "/seller/products", label: "Products", icon: "package_2" },
        { to: "/seller/orders", label: "Orders", icon: "orders" },
        { to: "/seller/settings", label: "Settings", icon: "settings" },
    ];

    return (
        <>
            <Header />
            <div className={`flex flex-col min-h-screen drop-shadow-xl transition-colors duration-300 ${
                    isDark
                        ? "bg-gradient-to-br from-gray-900 via-blue-950 to-black text-white"
                        : "bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900"
                }`}>
                <div className={`w-full top-16 z-50 ${
                        isDark ? "bg-blue-900/80" : "bg-gray-50"
                    } sticky backdrop-blur-md`}>
                    <nav className="flex shadow-lg font-medium items-center justify-center relative">
                        {links.map((link) => (
                            <NavLink key={link.to}
                                     to={link.to}
                                     ref={(el) => (navRefs.current[link.to] = el)}
                                     className={({ isActive }) =>
                                         `flex items-center gap-2 h-full px-4 py-4 transition-colors ${
                                         isActive 
                                             ? ( isDark ? "text-blue-400 font-semibold" : "text-blue-600 font-semibold") 
                                             : ( isDark ? "text-white hover:bg-blue-800" : "text-gray-600 hover:bg-gray-200")
                                     }`
                            }>
                                <span className="material-symbols-rounded text-current">
                                    {link.icon}
                                </span>
                                {link.label}
                            </NavLink>
                        ))}

                        {indicatorStyle.width && (
                            <motion.div
                                layout
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                className="absolute bottom-0 h-[2px] bg-blue-500 rounded"
                                style={{
                                    left: indicatorStyle.left,
                                    width: indicatorStyle.width,
                                }}
                            />
                        )}
                    </nav>
                </div>

                {/* Main Content */}
                <main className="flex-1 pt-16 overflow-auto">
                    <Outlet />
                </main>
            </div>
        </>
    );
}

export default SellerLayout;
