import { lazy } from "react";
import { createBrowserRouter } from "react-router";
import Protected from "../features/auth/components/Protected.jsx";
import Home from "../features/Products/pages/Home.jsx";

const Register = lazy(() => import("../features/auth/pages/Register.jsx"));
const Login = lazy(() => import("../features/auth/pages/Login.jsx"));
const Dashboard = lazy(
  () => import("../features/Products/pages/Dashboard.jsx"),
);
const CreateProduct = lazy(
  () => import("../features/Products/pages/CreatProduct.jsx"),
);
const SellerProductDetail = lazy(
  () => import("../features/Products/pages/SellerProductdetail.jsx"),
);
const ProductDetails = lazy(
  () => import("../features/Products/pages/ProductDetails.jsx"),
);
const Wishlist = lazy(
  () => import("../features/Wishlists/pages/getYourList.jsx"),
);
const Cart = lazy(() => import("../features/cart/pages/Cart.jsx"));
const NotFound = lazy(() => import("../features/components/NotFound.jsx"));

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "*",
    element: <NotFound />,
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
      {
        path: "dashboard/:productId/variant",
        element: <SellerProductDetail />,
      },
    ],
  },
  {
    path: "/product/:productId",
    element: <ProductDetails />,
  },
  {
    path: "/getyourcart",
    element: <Cart />,
  },
  {
    path: "/getYourList",
    element: <Wishlist />,
  },
]);
