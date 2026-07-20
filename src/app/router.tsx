import { createBrowserRouter } from "react-router-dom";
import HomePage from "../pages/HomePage";
import Layout from "../components/layout/Layout";
import { LoginPage } from "../pages/LoginPage";
import { RegisterPage } from "../pages/RegisterPage";
import { ForgotPasswordPage } from "../pages/ForgotPasswordPage";
import ManufacturersPage from "../pages/ManufacturersPage";
import ManufacturersAdminPage from "../pages/admin/ManufacturersAdminPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout><HomePage /></Layout>,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPasswordPage />,
  },
  {
    path: "/manufacturers",
    element: <Layout><ManufacturersPage /></Layout>,
  },
  {
    path: "/admin/manufacturers",
    element: <ManufacturersAdminPage />,
  },
]);
