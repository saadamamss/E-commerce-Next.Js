"use client";
import { useAppContext } from "@/app/AppProvider";

export default function CartCount() {
  const { cart } = useAppContext();
  if (!cart) return null;
  return (
    <span className="cart-amount d-block position-absolute js-cart-items-count cartItemsCount">
      {cart?.items?.length}
    </span>
  );
}
