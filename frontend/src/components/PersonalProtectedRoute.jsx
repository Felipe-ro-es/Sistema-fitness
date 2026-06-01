import { Navigate } from "react-router";
import { usePersonalAuth } from "../context/PersonalAuthContext";

export default function PersonalProtectedRoute({ children }) {
  const { personal, loading } = usePersonalAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#ff6600] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!personal) return <Navigate to="/personal/login" replace />;
  return children;
}
