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
      className="btn-link btn-link_lg me-4 text-uppercase fw-medium js-add-cart js-open-aside"
      data-aside="cartDrawer"
      title="Add To Cart"
      onClick={opendrawer}
    >
      Add To Cart
    </button>
  );
});
