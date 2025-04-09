"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Pagination({
  pagination,
}: {
  pagination: {
    prev: number | null;
    next: number | null;
    pages: number[];
    current: number;
  } | null;
}) {
  const [isClient, setIsClient] = useState(false);
  function handle(page: number) {
    const url = new URL(window.location.href);
    if (page === 1) url.searchParams.delete("page");
    else url.searchParams.set("page", page.toString());

    return url.href;
  }
  useEffect(() => {
    setIsClient(true);
  }, []);
  return (
    <>
      {pagination && (
        <nav
          className="shop-pages d-flex justify-content-between mt-3"
          aria-label="Page navigation"
        >
          {!!pagination?.prev ? (
            <Link
              href={isClient ? handle(pagination?.prev) : ""}
              className="btn-link d-inline-flex align-items-center cursor-pointer"
            >
              <svg
                className="me-1"
                width="7"
                height="11"
                viewBox="0 0 7 11"
                xmlns="http://www.w3.org/2000/svg"
              >
                <use href="#icon_prev_sm" />
              </svg>
              <span className="fw-medium">PREV</span>
            </Link>
          ) : (
            <span className="btn-link d-inline-flex align-items-center cursor-pointer">
              <svg
                className="me-1"
                width="7"
                height="11"
                viewBox="0 0 7 11"
                xmlns="http://www.w3.org/2000/svg"
              >
                <use href="#icon_prev_sm" />
              </svg>
              <span className="fw-medium">PREV</span>
            </span>
          )}
          <ul className="pagination mb-0">
            {pagination?.pages?.map((page: number) => (
              <li className="page-item" key={page}>
                <Link
                  href={isClient ? handle(page) : ""}
                  className={`btn-link px-1 mx-2 cursor-pointer ${
                    page === pagination.current ? "btn-link_active" : ""
                  }`}
                >
                  {page}
                </Link>
              </li>
            ))}
          </ul>
          {pagination?.next ? (
            <Link
              href={isClient ? handle(pagination?.next) : ""}
              className="btn-link d-inline-flex align-items-center cursor-pointer"
            >
              <span className="fw-medium me-1">NEXT</span>
              <svg
                width="7"
                height="11"
                viewBox="0 0 7 11"
                xmlns="http://www.w3.org/2000/svg"
              >
                <use href="#icon_next_sm" />
              </svg>
            </Link>
          ) : (
            <span className="btn-link d-inline-flex align-items-center cursor-pointer">
              <span className="fw-medium me-1">NEXT</span>
              <svg
                width="7"
                height="11"
                viewBox="0 0 7 11"
                xmlns="http://www.w3.org/2000/svg"
              >
                <use href="#icon_next_sm" />
              </svg>
            </span>
          )}
        </nav>
      )}
    </>
  );
}
