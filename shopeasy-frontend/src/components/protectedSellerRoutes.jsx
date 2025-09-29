import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/authContext.jsx";

function ProtectedSellerRoute() {
    const { user } = useAuth();
    if (!user || user.role !== "SELLER") {
        return <Navigate to="/" replace />;
    }
    return <Outlet />;
}

export default ProtectedSellerRoute;
