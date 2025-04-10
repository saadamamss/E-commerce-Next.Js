"use client";

import Link from "next/link";
import { memo } from "react";

const EmptyCart = memo(function EmptyCart() {
  return (
    <main className="pt-90">
      <div className="mb-4 pb-4"></div>
      <div className="container">
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
          <div className="mb-6 p-4 bg-gray-100 rounded-full animate-pulse">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Your Cart is Empty
          </h2>
          <p className="text-gray-500 mb-6 max-w-md">
            Looks like you haven’t added anything to your cart yet. Let’s change
            that!
          </p>
          <Link
            href="/shop"
            className="px-6 py-3 bg-stone-950 hover:bg-stone-800 text-white font-mediumtransition duration-200"
          >
            Shop Now
          </Link>
        </div>
      </div>
    </main>
  );
});

export default EmptyCart;
