"use client";

import { useState, useCallback, useEffect, memo } from "react";
import { debounce } from "lodash"; // For debouncing API calls
import { updateItemQty } from "@/lib/models/Cart";
import { useAppContext } from "../../AppProvider";

// Memoize the component to prevent unnecessary re-renders
const ItemQty = memo(function ItemQty({
  quantity,
  line,
  maxQty,
}: {
  maxQty: number;
  quantity: number;
  line: string;
}) {
  const [qty, setQty] = useState(quantity);
  const [loading, setLoading] = useState(false);
  const { cart, setCart } = useAppContext();

  // Debounced function to handle quantity changes
  const debouncedHandleQtyChange = useCallback(
    debounce(async (line, qty) => {
      const { data, success } = await updateItemQty(line, qty);
      if (success) {
        const { item, updatedCart } = data;
        const newCart = { ...cart, ...updatedCart };
        if (cart) {
          // Update the specific item's quantity
          const olditem = newCart.items?.find(
            (k: { key: string }) => k.key === line
          );
          if (olditem) {
            olditem.qty = item.qty;
          }
          setCart(newCart);
        }
      } else {
        console.error("Error updating quantity:");
      }

      setLoading(false);
    }, 300), // Debounce for 300ms
    [cart, setCart]
  );

  // Update local quantity state when the prop changes
  useEffect(() => {
    setQty(quantity);
  }, [quantity]);

  // Handle increment
  const handleIncrement = useCallback(() => {
    const newQty = qty + 1;
    if (newQty > maxQty) return;
    setLoading(true);

    setQty(newQty);
    debouncedHandleQtyChange(line, newQty);
  }, [qty, line, debouncedHandleQtyChange]);

  // Handle decrement
  const handleDecrement = useCallback(() => {
    setLoading(true);
    const newQty = qty - 1;
    if (newQty >= 1) {
      // Ensure quantity doesn't go below 1
      setQty(newQty);
      debouncedHandleQtyChange(line, newQty);
    }
  }, [qty, line, debouncedHandleQtyChange]);

  return (
    <div className="position-relative flex border border-2 py-2 w-24 max-w-24">
      <button
        className="px-3"
        onClick={handleDecrement}
        disabled={loading || qty <= 1} // Disable if loading or quantity is 1
      >
        -
      </button>
      <div className="text-center m-0 flex-1 relative">
        {loading && (
          <div className="absolute top-0 left-0 w-full h-full bg-white flex justify-center items-center">
            <div
              className="spinner-border"
              style={{ width: "1rem", height: "1rem" }}
              role="status"
            >
              <span className="sr-only"></span>
            </div>
          </div>
        )}
        <span>{qty}</span>
      </div>
      <button
        className="px-3"
        onClick={handleIncrement}
        disabled={loading || maxQty == qty} // Disable if loading
      >
        +
      </button>
    </div>
  );
});

export default ItemQty;
