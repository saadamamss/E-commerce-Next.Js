"use client";

import { memo, useCallback, useState } from "react";
import { removeCartItem } from "@/lib/models/Cart";
import { useAppContext } from "../../AppProvider";
import { useCookies } from "react-cookie";
import { debounce, set } from "lodash";
const CartItemRemove = memo(function CartItemRemove({
  line,
}: {
  line: string;
}) {
  const { cart, setCart } = useAppContext();
  const removeCookie = useCookies(["cart"])[2];
  // Handle item removal
  const [isLoading, setIsLoading] = useState(false);

  const removecartItemAction = useCallback(
    debounce(async () => {
      setIsLoading(true);

      const { data, success } = await removeCartItem(line);
      if (success) {
        const updatedCart = { ...cart, ...data };
        updatedCart.items = updatedCart.items?.filter(
          (i: { key: string }) => i.key != line
        );
        if (!updatedCart.items?.length) {
          setCart(null);
          removeCookie("cart");
          return;
        }

        setCart(updatedCart);
      } else {
        console.error("Error removing item:");
      }
      setIsLoading(false);
    }, 200),
    [line, setCart, removeCookie, cart]
  );

  return (
    <>
      {isLoading && (
        <div
          className="spinner-border"
          style={{ width: "1rem", height: "1rem" }}
          role="status"
        >
          <span className="sr-only"></span>
        </div>
      )}

      {!isLoading && (
        <span
          className="remove-cart cursor-pointer"
          onClick={removecartItemAction}
          aria-label="Remove item"
        >
          <svg
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="#767676"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M0.259435 8.85506L9.11449 0L10 0.885506L1.14494 9.74056L0.259435 8.85506Z" />
            <path d="M0.885506 0.0889838L9.74057 8.94404L8.85506 9.82955L0 0.97449L0.885506 0.0889838Z" />
          </svg>
        </span>
      )}
    </>
  );
});

export default CartItemRemove;
