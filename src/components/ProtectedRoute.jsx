import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/useAuth";

function ProtectedRoute({ children }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <p className="status-message">読み込み中...</p>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
