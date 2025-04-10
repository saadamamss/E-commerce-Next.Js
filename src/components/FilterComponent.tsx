"use client";
import { Slider } from "@heroui/slider";
import React, { memo, useCallback, useReducer, useState } from "react";
import { HeroUIProvider } from "@heroui/system";
import MultiSelect from "@/components/MultiSelect";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { filterType, safeSplit, searchFilter } from "@/lib/helpers/functions";
import Link from "next/link";
import {
  BRANDOPTIONS,
  COLORS_OPTIONS,
  SIZES_OPTIONS,
} from "@/lib/helpers/constants";

// Define action types for useReducer
type Action =
  | { type: "SET_COLOR_FILTER"; payload: string[] }
  | { type: "SET_SIZE_FILTER"; payload: string[] }
  | { type: "SET_PRICE_FILTER"; payload: number[] }
  | { type: "SET_BRAND_FILTER"; payload: string[] };

// Reducer function to handle state updates
function filterReducer(state: filterType, action: Action): filterType {
  switch (action.type) {
    case "SET_COLOR_FILTER":
      return { ...state, color: action.payload };
    case "SET_SIZE_FILTER":
      return { ...state, size: action.payload };
    case "SET_PRICE_FILTER":
      return {
        ...state,
        minprice: action.payload[0],
        maxprice: action.payload[1],
      };
    case "SET_BRAND_FILTER":
      return { ...state, brand: action.payload };
    default:
      return state;
  }
}

const FilterComponent = memo(function FilterComponent({
  filters,
  categories,
}: {
  filters: searchFilter;
  categories: { name: string; id: number; slug: string }[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // Initialize state using useReducer
  const [state, dispatch] = useReducer(filterReducer, {
    color: safeSplit(filters.color) ?? [],
    size: safeSplit(filters.size) ?? [],
    brand: safeSplit(filters.brand) ?? [],
    minprice: 100,
    maxprice: 500,
  });

  const [priceRangechange, setPriceRangeChange] = useState(false);

  // Memoized event handlers
  const handleColorFilter = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      const updatedColors = event.target.checked
        ? [...state.color, value]
        : state.color.filter((i) => i !== value);
      dispatch({ type: "SET_COLOR_FILTER", payload: updatedColors });
    },
    [state.color]
  );

  const handleSizeFilter = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      const updatedSizes = event.target.checked
        ? [...state.size, value]
        : state.size.filter((i) => i !== value);
      dispatch({ type: "SET_SIZE_FILTER", payload: updatedSizes });
    },
    [state.size]
  );

  const handleBrandFilter = useCallback(
    (value: readonly { value: string; label: string }[]) => {
      const updatedBrands = value.map((i) => i.value);
      dispatch({ type: "SET_BRAND_FILTER", payload: updatedBrands });
    },
    []
  );

  const handlePriceFilter = useCallback((value: number[]) => {
    setPriceRangeChange(true);
    dispatch({ type: "SET_PRICE_FILTER", payload: value });
  }, []);

  const ApplyFilter = useCallback(() => {
    const params = new URLSearchParams(searchParams);

    if (state.color?.length) params.set("color", state.color.join("--"));
    else params.delete("color");

    if (state.size?.length) params.set("size", state.size.join("--"));
    else params.delete("size");

    if (state.brand?.length) params.set("brand", state.brand.join("--"));
    else params.delete("brand");

    if (priceRangechange) {
      params.set("minprice", state.minprice.toString());
      params.set("maxprice", state.maxprice.toString());
    } else {
      params.delete("minprice");
      params.delete("maxprice");
    }
    params.delete("page");

    router.push(`${pathname}?${params.toString()}`);
  }, [state, router]);
  //
  const clearFilters = useCallback(() => {
    router.replace(pathname);
  }, [searchParams]);
  return (
    <div className="shop-sidebar side-sticky bg-body" id="shopFilter">
      <div className="aside-header d-flex d-lg-none align-items-center">
        <h3 className="text-uppercase fs-6 mb-0">Filter By</h3>
        <button className="btn-close-lg js-close-aside btn-close-aside ms-auto"></button>
      </div>

      <div className="pt-4 pt-lg-0"></div>

      {/* Product Categories Section */}
      <div className="accordion" id="categories-list">
        <div className="accordion-item mb-4 pb-3">
          <h5 className="accordion-header" id="accordion-heading-1">
            <button
              className="accordion-button p-0 border-0 fs-5 text-uppercase"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#accordion-filter-1"
              aria-expanded="true"
              aria-controls="accordion-filter-1"
            >
              Product Categories
              <svg
                className="accordion-button__icon type2"
                viewBox="0 0 10 6"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g aria-hidden="true" stroke="none" fillRule="evenodd">
                  <path d="M5.35668 0.159286C5.16235 -0.053094 4.83769 -0.0530941 4.64287 0.159286L0.147611 5.05963C-0.0492049 5.27473 -0.049205 5.62357 0.147611 5.83813C0.344427 6.05323 0.664108 6.05323 0.860924 5.83813L5 1.32706L9.13858 5.83867C9.33589 6.05378 9.65507 6.05378 9.85239 5.83867C10.0492 5.62357 10.0492 5.27473 9.85239 5.06018L5.35668 0.159286Z" />
                </g>
              </svg>
            </button>
          </h5>
          <div
            id="accordion-filter-1"
            className="accordion-collapse collapse show border-0"
            aria-labelledby="accordion-heading-1"
            data-bs-parent="#categories-list"
          >
            <div className="accordion-body px-0 pb-0 pt-3">
              <ul className="list list-inline mb-0">
                {categories?.map((category) => (
                  <li className="list-item" key={category.id}>
                    <Link href={`/${category.slug}`} className="menu-link py-1">
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Brands Section */}
      <div className="accordion" id="brand-filters">
        <div className="accordion-item mb-4 pb-3">
          <h5 className="accordion-header" id="accordion-heading-brand">
            <button
              className="accordion-button p-0 border-0 fs-5 text-uppercase"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#accordion-filter-brand"
              aria-expanded="true"
              aria-controls="accordion-filter-brand"
            >
              Brands
              <svg
                className="accordion-button__icon type2"
                viewBox="0 0 10 6"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g aria-hidden="true" stroke="none" fillRule="evenodd">
                  <path d="M5.35668 0.159286C5.16235 -0.053094 4.83769 -0.0530941 4.64287 0.159286L0.147611 5.05963C-0.0492049 5.27473 -0.049205 5.62357 0.147611 5.83813C0.344427 6.05323 0.664108 6.05323 0.860924 5.83813L5 1.32706L9.13858 5.83867C9.33589 6.05378 9.65507 6.05378 9.85239 5.83867C10.0492 5.62357 10.0492 5.27473 9.85239 5.06018L5.35668 0.159286Z" />
                </g>
              </svg>
            </button>
          </h5>
          <div
            id="accordion-filter-brand"
            className="accordion-collapse collapse show border-0"
            aria-labelledby="accordion-heading-brand"
            data-bs-parent="#brand-filters"
          >
            <div className="accordion-body px-1 pb-0">
              <MultiSelect
                options={BRANDOPTIONS}
                defaultValue={BRANDOPTIONS.filter((op) =>
                  state.brand?.includes(op.value)
                )}
                onChange={handleBrandFilter}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Color Section */}
      <div className="accordion" id="color-filters">
        <div className="accordion-item mb-4 pb-3">
          <h5 className="accordion-header" id="accordion-heading-1">
            <button
              className="accordion-button p-0 border-0 fs-5 text-uppercase"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#accordion-filter-2"
              aria-expanded="true"
              aria-controls="accordion-filter-2"
            >
              Color
              <svg
                className="accordion-button__icon type2"
                viewBox="0 0 10 6"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g aria-hidden="true" stroke="none" fillRule="evenodd">
                  <path d="M5.35668 0.159286C5.16235 -0.053094 4.83769 -0.0530941 4.64287 0.159286L0.147611 5.05963C-0.0492049 5.27473 -0.049205 5.62357 0.147611 5.83813C0.344427 6.05323 0.664108 6.05323 0.860924 5.83813L5 1.32706L9.13858 5.83867C9.33589 6.05378 9.65507 6.05378 9.85239 5.83867C10.0492 5.62357 10.0492 5.27473 9.85239 5.06018L5.35668 0.159286Z" />
                </g>
              </svg>
            </button>
          </h5>
          <div
            id="accordion-filter-2"
            className="accordion-collapse collapse show border-0"
            aria-labelledby="accordion-heading-1"
            data-bs-parent="#color-filters"
          >
            <div className="accordion-body px-0 pb-0">
              <div className="d-flex flex-wrap" id="colorFilter">
                {COLORS_OPTIONS.map((color) => (
                  <input
                    key={color}
                    type="checkbox"
                    onChange={handleColorFilter}
                    value={color}
                    checked={state.color?.includes(color)}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Size Section */}
      <div className="accordion" id="size-filters">
        <div className="accordion-item mb-4 pb-3">
          <h5 className="accordion-header" id="accordion-heading-size">
            <button
              className="accordion-button p-0 border-0 fs-5 text-uppercase"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#accordion-filter-size"
              aria-expanded="true"
              aria-controls="accordion-filter-size"
            >
              Sizes
              <svg
                className="accordion-button__icon type2"
                viewBox="0 0 10 6"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g aria-hidden="true" stroke="none" fillRule="evenodd">
                  <path d="M5.35668 0.159286C5.16235 -0.053094 4.83769 -0.0530941 4.64287 0.159286L0.147611 5.05963C-0.0492049 5.27473 -0.049205 5.62357 0.147611 5.83813C0.344427 6.05323 0.664108 6.05323 0.860924 5.83813L5 1.32706L9.13858 5.83867C9.33589 6.05378 9.65507 6.05378 9.85239 5.83867C10.0492 5.62357 10.0492 5.27473 9.85239 5.06018L5.35668 0.159286Z" />
                </g>
              </svg>
            </button>
          </h5>
          <div
            id="accordion-filter-size"
            className="accordion-collapse collapse show border-0"
            aria-labelledby="accordion-heading-size"
            data-bs-parent="#size-filters"
          >
            <div className="accordion-body px-0 pb-0">
              <div className="d-flex flex-wrap" id="sizeFilter">
                {SIZES_OPTIONS.map((size) => (
                  <input
                    key={size}
                    type="checkbox"
                    onChange={handleSizeFilter}
                    value={size}
                    checked={state.size?.includes(size)}
                    className="swatch-size"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Price Section */}
      <div className="accordion" id="price-filters">
        <div className="accordion-item mb-4">
          <h5 className="accordion-header mb-2" id="accordion-heading-price">
            <button
              className="accordion-button p-0 border-0 fs-5 text-uppercase"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#accordion-filter-price"
              aria-expanded="true"
              aria-controls="accordion-filter-price"
            >
              Price
              <svg
                className="accordion-button__icon type2"
                viewBox="0 0 10 6"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g aria-hidden="true" stroke="none" fillRule="evenodd">
                  <path d="M5.35668 0.159286C5.16235 -0.053094 4.83769 -0.0530941 4.64287 0.159286L0.147611 5.05963C-0.0492049 5.27473 -0.049205 5.62357 0.147611 5.83813C0.344427 6.05323 0.664108 6.05323 0.860924 5.83813L5 1.32706L9.13858 5.83867C9.33589 6.05378 9.65507 6.05378 9.85239 5.83867C10.0492 5.62357 10.0492 5.27473 9.85239 5.06018L5.35668 0.159286Z" />
                </g>
              </svg>
            </button>
          </h5>
          <div
            id="accordion-filter-price"
            className="accordion-collapse collapse show border-0"
            aria-labelledby="accordion-heading-size"
            data-bs-parent="#price-filters"
          >
            <div className="accordion-body px-0 pb-0">
              <div className="d-flex flex-wrap" id="priceFilter">
                <HeroUIProvider className="w-full">
                  <Slider
                    className="w-full"
                    maxValue={1000}
                    minValue={0}
                    step={10}
                    size="sm"
                    value={[state.minprice, state.maxprice]}
                    onChange={(value) => handlePriceFilter(value as number[])}
                  />
                  <span className="py-2">
                    EGP{state.minprice} - EGP{state.maxprice}
                  </span>
                </HeroUIProvider>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="block">
        <button
          className="bg-stone-950 text-white hover:bg-stone-900 p-3 m-0 inline-block text-uppercase"
          onClick={() => {
            ApplyFilter();
          }}
        >
          Filter
        </button>

        {!!searchParams.size && (
          <button
            className="border-2 hover:bg-stone-900 hover:text-white p-3 mx-2 inline-block text-uppercase"
            onClick={() => clearFilters()}
          >
            Clear Filter
          </button>
        )}
      </div>
    </div>
  );
});

export default FilterComponent;
