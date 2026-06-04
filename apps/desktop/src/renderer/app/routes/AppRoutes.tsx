import { Navigate, Outlet, Route, Routes, useNavigate } from "react-router-dom";
import { useEffect } from "react";

import { GuestRoute } from "../../shared/router/GuestRoute.tsx";
import { ProtectedRoute } from "../../shared/router/ProtectedRoute.tsx";
import { LoginPage } from "../../pages/LoginPage/LoginPage.tsx";
import { RegisterPage } from "../../pages/RegisterPage/RegisterPage.tsx";
import { HomePage } from "../../pages/HomePage/HomePage.tsx";
import { ProductPage } from "../../pages/ProductPage/ProductPage.tsx";
import { AdminPage } from "../../pages/AdminPage/AdminPage.tsx";
import { CustomProductPage } from "../../pages/CustomProductPage/CustomProductPage.tsx";

export function AppRoutes() {
  const navigate = useNavigate();

  useEffect(() => {
     const unsubscribe = window.auth.onForceLogout(() => {
      navigate("/login", { replace: true });
    });

    return () => {
      unsubscribe();
    };
  }, [navigate]);

  return (
    <Routes>
      <Route
        path="/login"
        element={
          <GuestRoute>
            <LoginPage />
          </GuestRoute>
        }
      />

      <Route
        path="/register"
        element={
          <GuestRoute>
            <RegisterPage />
          </GuestRoute>
        }
      />

      <Route
        path="/parser"
        element={
          <ProtectedRoute>
            <Outlet />
          </ProtectedRoute>
        }
      >
        <Route index element={<HomePage />} />
        <Route path="product" element={<ProductPage />} />
      </Route>

      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/custom-product"
        element={
          <ProtectedRoute>
            <CustomProductPage />
          </ProtectedRoute>
        }
      />


      <Route path="/" element={<Navigate to="/parser" replace />} />
      <Route path="*" element={<Navigate to="/parser" replace />} />
    </Routes>
  );
}