import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useCart } from "../hooks/useCart";

const Cart = () => {
  const getYourCart = useSelector((state) => state.cart.items);
  console.log(getYourCart);

  const { handleGetCart } = useCart();
  useEffect(() => {
    handleGetCart();
  }, []);
  return <div>Cart</div>;
};

export default Cart;
