import { createBrowserRouter } from "react-router";
import Register from "../features/auth/pages/Register.jsx";
import Login from "../features/auth/pages/Login.jsx";
import CreateProduct from "../features/Products/pages/CreatProduct.jsx";
import { NavLink } from "react-router";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: (
      <div className="flex flex-col items-center justify-center h-screen bg-[#0a0a0a] gap-4 text-white">
        <h1 className="text-4xl font-bold mb-4">Dashboard</h1>

        <NavLink to={"/register"}>Register</NavLink>
        <NavLink to={"/login"}>Login</NavLink>
        <NavLink to={"/createProduct"}>Upload</NavLink>
      </div>
    ),
  },
  { path: "/register", element: <Register /> },
  { path: "/login", element: <Login /> },
  { path: "/createProduct", element: <CreateProduct /> },
]);
