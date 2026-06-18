import React from "react";
import { useSelector } from "react-redux";
import { Spinner } from "../../Shared/Spinner.jsx";
import { Navigate } from "react-router";

const Protected = ({ children, role = "buyer" }) => {
  const user = useSelector((state) => state.auth.user);
  console.log(user)
  const loading = useSelector((state) => state.auth.loading);

  if (loading) return <Spinner />;

  if (!user) return <Navigate to="/login" replace/>;

  if (user.role !== role) return <Navigate to="/" replace/>;

  return children;
};

export default Protected;
