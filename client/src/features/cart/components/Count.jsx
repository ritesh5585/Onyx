import React from "react";

const CartIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
);

const Count = ({ isMobile, cartCount }) => {
  return (
    <>
      {isMobile ? <span>Cart</span> : <CartIcon />}
      {cartCount > 0 && (
        <span
          className={
            isMobile
              ? "ml-2 inline-flex items-center justify-center min-w-[20px] h-[20px] px-1 rounded-full bg-[#c49a52] text-[#06060a] text-[11px] font-bold leading-none"
              : "absolute -top-2 -right-2 w-4 h-4 rounded-full bg-[#c49a52] text-[#06060a] text-[9px] font-bold flex items-center justify-center leading-none"
          }
        >
          {cartCount > 9 ? "9+" : cartCount}
        </span>
      )}
    </>
  );
};

export default Count;
