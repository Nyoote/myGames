import { Navigate } from "react-router-dom";
import { useAuth } from "../Hooks/useAuthentification.js";

export default function FallbackRedirect() {
    const { isAuthenticated } = useAuth();
    return <Navigate to={isAuthenticated ? "/games" : "/login"} replace />;
}
