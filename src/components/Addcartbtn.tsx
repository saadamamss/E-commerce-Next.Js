"use client";

import { memo, useCallback } from "react";
import { useAppContext } from "../app/AppProvider";
import { Api } from "../app/api/routes";
export default memo(function Addcartbtn({ product }: { product: string }) {
  const { setCartDrawerOpen, setCartDrawercontent } = useAppContext();
  const prod = JSON.parse(product);
  async function opendrawer() {
    try {
      const response = await Api.get("/products", {
        params: { id: prod.id },
      });

      console.log({ ...prod, ...response.data });
      
      setCartDrawercontent({ ...prod, ...response.data });
      setCartDrawerOpen(true);

    } catch (error) {
      console.log(error);
    }
  }
  return (
    <button
      className="pc__atc btn anim_appear-bottom btn position-absolute border-0 text-uppercase fw-medium"
      title="Add To Cart"
      onClick={opendrawer}
    >
      Add To Cart
    </button>
  );
});
