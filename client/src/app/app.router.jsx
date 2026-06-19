import { createBrowserRouter } from "react-router";
import Home from "../features/Products/pages/home.jsx";
import Register from "../features/auth/pages/Register.jsx";
import Login from "../features/auth/pages/Login.jsx";
import Dashboard from "../features/Products/pages/Dashboard.jsx";
import Protected from "../features/auth/components/Protected.jsx";
import CreateProduct from "../features/Products/pages/CreatProduct.jsx";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "*",
    element: <Home/>
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/seller",
    children: [
      {
        path: "create-product",
        element: (
          <Protected role="seller">
            <CreateProduct />
          </Protected>
        ),
      },
      {
        path: "dashboard",
        element: (
          <Protected role="seller">
            <Dashboard />
          </Protected>
        ),
      },
    ],
  },
]);
