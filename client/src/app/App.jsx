import React, { useEffect } from "react";
import { RouterProvider } from "react-router";
import { routes } from "./app.router";
import { useAuth } from "../features/auth/hook/useAuth";
import { Spinner } from "../features/Shared/Spinner.jsx";

const App = () => {
  const { checkAuth, loading, user } = useAuth();
  const isCheckingAuth = loading && user === null;

  // Run auth check only once on mount to prevent infinite loop
  useEffect(() => {
    checkAuth().catch(() => {
      // ignore
    });
  }, [checkAuth]);

  return isCheckingAuth ? <Spinner /> : <RouterProvider router={routes} />
};

export default App;
