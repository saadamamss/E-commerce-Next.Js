"use client";

import Link from "next/link";
import { memo } from "react";

const EmptyWishlist = memo(function EmptyWishlist() {
  return (
    <main className="pt-90">
      <div className="mb-4 pb-4"></div>
      <div className="container">
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
          <div className="mb-6 p-4 bg-pink-50 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-yellow-400 animate-pulse"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Your Wishlist is Empty
          </h2>
          <p className="text-gray-500 mb-6 max-w-md">
            Save your favorite items here to keep track of what you love!
          </p>
          <Link
            href="/shop"
            className="px-6 py-3 bg-stone-950 hover:bg-stone-800 text-white font-mediumtransition duration-200"
          >
            Browse Products
          </Link>
        </div>
      </div>
    </main>
  );
});

export default EmptyWishlist;
