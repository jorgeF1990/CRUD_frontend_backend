// src/App.jsx
import { Routes, Route } from "react-router-dom";
import { Login } from "./pages/login.jsx";
import { Register } from "./pages/register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Home from "./pages/Home.jsx";
import Layout from "./components/Layout.jsx";
import PrivateRoutes from "./routes/PrivateRoutes.jsx";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Rutas públicas */}
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />

        {/* Ruta privada */}
        <Route
          path="dashboard"
          element={
            <PrivateRoutes>
              <Dashboard />
            </PrivateRoutes>
          }
        />

        {/* Ruta 404 */}
        <Route path="*" element={<h1>404 - Página no encontrada</h1>} />
      </Route>
    </Routes>
  );
};

export default App;
