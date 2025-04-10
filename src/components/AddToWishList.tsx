"use client";
import { memo, useEffect, useState } from "react";
import { useCookies } from "react-cookie";

export default memo(function AddToWishlist({
  children,
  className,
  productId,
}: {
  children?: React.ReactElement;
  className?: string;
  productId: number;
}) {
  const [cookie, setWishlistCookie] = useCookies(["wishlist"]);
  const [inList, setInList] = useState(false);
  //
  function adddProductToWishlist() {
    if (cookie.wishlist) {
      if (cookie.wishlist.includes(productId)) {
        const indx = cookie.wishlist.indexOf(productId);
        cookie.wishlist.splice(indx, 1);
        setWishlistCookie("wishlist", cookie.wishlist);
        console.log(cookie.wishlist);

        return;
      }

      cookie.wishlist.push(productId);
      setWishlistCookie("wishlist", cookie.wishlist);
      return;
    }
    setWishlistCookie("wishlist", [productId]);
  }

  useEffect(() => {
    setInList(cookie.wishlist?.includes(productId));
  }, [cookie.wishlist]);

  return (
    <button
      className={
        className ??
        "pc__btn-wl position-absolute top-0 end-0 bg-transparent border-0 bg-dark"
      }
      title="Add To Wishlist"
      onClick={() => {
        adddProductToWishlist();
      }}
    >
      {inList ? (
        <span className="bi bi-heart-fill text-[20px]"></span>
      ) : (
        <span className="bi bi-heart text-[20px]"></span>
      )}
      {children}
    </button>
  );
});
