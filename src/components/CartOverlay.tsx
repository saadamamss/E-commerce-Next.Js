"use client";

import { useAppContext } from "@/app/AppProvider";

import { Suspense, useEffect, useState } from "react";
import CartOverlayAdd from "./CartOverlayAdd";
import CartInDrawer from "./CartInDrawer";
export default function CartOverlay() {
  const {
    setCartDrawerOpen,
    cartDrawerOpen,
    showCartInDrawer,
    setShowCartInDrawer,
  } = useAppContext();

  useEffect(() => {
    if (cartDrawerOpen) {
      document.querySelector("body")?.classList.add("overflow-hidden");
    } else {
      document.querySelector("body")?.classList.remove("overflow-hidden");
    }
  }, [cartDrawerOpen]);

  function closeDrawer(event: React.MouseEvent<HTMLElement>) {
    const el = (event.target as HTMLElement).id;
    if (el === "cartdrawerback" || el === "closer") {
      setCartDrawerOpen(false);
      setShowCartInDrawer(false);
    }
  }

  if (!cartDrawerOpen) {
    return null;
  }

  return (
    <>
      <div
        className="position-fixed top-0 left-0 w-full h-full z-50 page_overlay_open"
        style={{ backgroundColor: "rgba(0,0,0,0.2)" }}
        id="cartdrawerback"
        onClick={(event) => closeDrawer(event)}
        key={"fdf121aa"}
      >
        <div
          className="cartoverlaycontent w-full absolute right-0 top-0 h-screen overflow-y-scroll bg-white"
          style={{ maxWidth: "500px" }}
        >
          <div className="py-2 px-3 flex justify-end">
            <button onClick={(event) => closeDrawer(event)}>
              <i className="bi bi-x text-3xl" id="closer"></i>
            </button>
          </div>

          {/*  */}
          <div className="row mx-0">
            {showCartInDrawer ? <CartInDrawer /> : <CartOverlayAdd />}
          </div>
        </div>
      </div>
    </>
  );
}
