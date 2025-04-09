"use client";
import { useAppContext } from "@/app/AppProvider";
import ItemQty from "@/app/cart/components/ItemQty";
import Image from "next/image";
import Link from "next/link";
import { memo, useCallback, useEffect, useState } from "react";

const CartInDrawer = memo(function CartInDrawer() {
  const { cart } = useAppContext();
  const itemAttributes = useCallback((item: any): string[] => {
    const { id, SKU, price, images, quantity, ...rest } = item;
    Object.keys(rest).forEach((key) => {
      if (!rest[key]) delete rest[key];
    });

    return Object.keys(rest);
  }, []);

  return (
    <div className="col-12">
      <h3 className="py-2 font-bold">Products added to Bag</h3>
      {cart?.items?.map((item) => (
        <div key={item.key} className="flex flex-row py-2 border-bottom">
          <div className="">
            <Image
              width={150}
              height={100}
              src={`/assets/images/products/${item.image}`}
              alt=""
            />
          </div>
          <div className="flex-1 px-3">
            <h4 className="font-bold">{item.name} </h4>
            <h4 className="font-bold text-red italic">{item.price}EGP</h4>
            <div className="text-slate-500">
              {itemAttributes(item.variant)?.map((attr) => (
                <span key={attr} className="d-block">
                  <strong>{attr}:</strong> {item.variant[attr]}
                </span>
              ))}
            </div>
            <div className="d-block py-2">
              <ItemQty
                quantity={item.qty}
                line={item.key}
                maxQty={item.variant.quantity}
              />
            </div>
          </div>
        </div>
      ))}
      {/*  */}
      <div className="flex justify-between py-3">
        <span className="font-bold text-xl">Total</span>
        <span className="font-bold text-xl text-red ">
          EGP
          <span className="shopping-cart__total">
            {Number(cart?.total).toFixed(2)}
          </span>
        </span>
      </div>

      <div className="d-block w-full mb-3">
        <Link
          href="/cart"
          className="bg-gray-700 d-block text-center w-full py-2 text-xl text-white hover:bg-gray-950"
        >
          View Cart
        </Link>
      </div>

      <div className="d-block w-full">
        <Link
          href="/checkout"
          className="w-full d-block text-center py-2 text-xl text-black border-2 border-slate-800 hover:bg-gray-950 hover:text-white"
        >
          Checkout
        </Link>
      </div>
    </div>
  );
});
export default CartInDrawer;
