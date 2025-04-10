"use client";
import { SearchCategory } from "@/lib/models/Category";
import { debounce } from "lodash";
import Link from "next/link";
import { memo, useCallback, useState, ChangeEvent } from "react";
interface searchResult {
  name: string;
  slug: string;
  id: number;
}
export default memo(function SearchForm() {
  const [search_q, setSearchQ] = useState("");
  const [searchResult, setSearchResult] = useState<searchResult[]>([]);

  // Create a ref to store the debounced function
  const debouncedSearch = useCallback(
    debounce(async (query) => {
      if (query.length > 2) {
        const res = await SearchCategory(query);
        if (res?.success) {
          setSearchResult(res.data);
        }
      } else {
        setSearchResult([]);
      }
    }, 300), // Adjust debounce delay as needed
    [setSearchResult]
  );

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQ(e.target.value);
    debouncedSearch(e.target.value);
  };

  return (
    <form action="/search" method="GET" className="search-field container">
      <p className="text-uppercase text-secondary fw-medium mb-4">
        What are you looking for?
      </p>
      <div className="position-relative">
        <input
          className="search-field__input search-popup__input w-100 fw-medium"
          type="text"
          name="q"
          value={search_q}
          autoComplete="off"
          onChange={handleInputChange}
          placeholder="Search products"
        />
        <button className="btn-icon search-popup__submit" type="submit">
          <svg
            className="d-block"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <use href="#icon_search" />
          </svg>
        </button>
        <button
          className="btn-icon btn-close-lg search-popup__reset"
          type="reset"
          onClick={() => setSearchQ("")} // Clear search input on reset
        ></button>
      </div>

      <div className="search-popup__results">
        <div className="sub-menu search-suggestion">
          <h6 className="sub-menu__title fs-base">Quicklinks</h6>
          <ul className="sub-menu__list list-unstyled">
            {searchResult?.map((item) => (
              <li className="sub-menu__item" key={item.id}>
                <Link
                  href={"/" + item.slug}
                  className="menu-link menu-link_us-s"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="search-result row row-cols-5"></div>
      </div>
    </form>
  );
});
