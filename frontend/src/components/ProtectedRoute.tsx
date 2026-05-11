import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: string[];
}

const ProtectedRoute = ({ children, roles = [] }: ProtectedRouteProps) => {
  const token = localStorage.getItem("token");
  const { user } = useAuthStore();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#121212] text-white">
        Verificando acceso...
      </div>
    );
  }

  if (roles.length > 0 && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
