"use client";

import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";

export default function WishlistCount() {
  const [cookie] = useCookies(["wishlist"]);
  const [count, setCount] = useState(0);
  useEffect(() => {
    setCount(cookie.wishlist?.length);
  }, [cookie.wishlist]);

  if (!count) return null;

  return (
    <span className="wishlist-amount d-block position-absolute">{count}</span>
  );
}
