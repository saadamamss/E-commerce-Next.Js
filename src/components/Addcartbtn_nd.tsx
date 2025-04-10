"use client";

import { memo } from "react";
import { useAppContext } from "../app/AppProvider";
import { Api } from "../lib/models/Api";
export default memo(function Addcartbtn({ product }: { product: string }) {
  const { setCartDrawerOpen, setcartDrawerContent } = useAppContext();
  const prod = JSON.parse(product);
  async function opendrawer() {
    try {
      const response = await Api.get("/products", {
        params: { id: prod.id },
      });

      setcartDrawerContent({ ...prod, ...response.data });
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
