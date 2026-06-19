import React, { useEffect } from "react";
import { RouterProvider } from "react-router";
import { routes } from "./app.router";
import { useAuth } from "../features/auth/hook/useAuth";
import { Spinner } from "../features/Shared/Spinner.jsx";
import { useSelector } from "react-redux";

const App = () => {
  const { checkAuth, loading, user, handleGetMe } = useAuth();
  const isCheckingAuth = loading && user === null;

  // Run auth check only once on mount to prevent infinite loop
  useEffect(() => {
    checkAuth().catch(() => {
      checkAuth;
    });
  }, []);

  return isCheckingAuth ? <Spinner /> : <RouterProvider router={routes} />
};

export default App;
