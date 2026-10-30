import { useEffect, useLayoutEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";

const RouteScrollReset = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    const previousRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";
    return () => {
      window.history.scrollRestoration = previousRestoration;
    };
  }, []);

  useLayoutEffect(() => {
    const target = hash
      ? document.getElementById(decodeURIComponent(hash.slice(1)))
      : null;

    if (target) {
      target.scrollIntoView({ behavior: "auto" });
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return <Outlet />;
};

export default RouteScrollReset;
