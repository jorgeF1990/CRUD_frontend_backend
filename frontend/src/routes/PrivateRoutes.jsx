import { UserContext } from "../context/UserContext";
import { useContext } from "react";
import { Navigate } from "react-router-dom";

function PrivateRoutes({ children }) {
  const { user, loading } = useContext(UserContext);

  if (loading) {
    return <div>Loading...</div>; // O un spinner de carga
  }

  return user ? children : <Navigate to="/login" />;
}

export default PrivateRoutes