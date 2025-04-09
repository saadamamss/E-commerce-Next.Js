"use client";

import { useMemo, useState, useCallback, memo } from "react";
import { addItemToCart } from "@/app/api/cart/Cart";
import { useAppContext } from "@/app/AppProvider";
import {
  recoverAttributes,
  transformBaseVariants,
} from "@/lib/helpers/productvariants";
import Image from "next/image";
import Link from "next/link";

const AddToCart = memo(function AddToCart({ product }: { product: string }) {
  const prod = JSON.parse(product);
  const [quantity, setQuantity] = useState(1);
  const [load, setLoad] = useState(false);
  const [error, setError] = useState("");

  const { setCart } = useAppContext();

  // Memoize attributes and baseVariants to avoid recalculations
  const attributes = useMemo(
    () => recoverAttributes(prod.attributes, prod.variants[0]),
    [prod]
  );
  const baseVariants = useMemo(
    () => transformBaseVariants(prod.variants, attributes),
    [prod, attributes]
  );

  const [attrCombination, setAttrComb] = useState<Record<string, string>>({
    attr_1: attributes.attr_1?.[0],
    attr_2: attributes.attr_2?.[0],
    attr_3: attributes.attr_3?.[0],
  });

  // Memoize selected variant to avoid recalculations
  const selectedVariant = useMemo(() => {
    return baseVariants.find(
      (variant) =>
        variant.attr_1 === attrCombination.attr_1 &&
        variant.attr_2 === attrCombination.attr_2 &&
        variant.attr_3 === attrCombination.attr_3
    );
  }, [baseVariants, attrCombination]);

  const selectedVariantImages = useMemo(() => {
    return baseVariants
      .find((variant) => variant.attr_1 === attrCombination.attr_1)
      ?.images?.split(",");
  }, [baseVariants, attrCombination.attr_1]);

  // Memoize image for the selected color
  const ImageColor = useCallback(
    ({ value }: { value: string }) => {
      const image = baseVariants
        ?.find((k) => k.attr_1 === value)
        ?.images?.split(",")[0];
      return (
        <Image
          src={`/assets/images/products/${image}`}
          alt={`Product color ${value}`}
          width={100}
          height={100}
          aria-label={`Product color ${value}`}
        />
      );
    },
    [baseVariants]
  );

  // Handle quantity changes
  const handleQuantityChange = useCallback(
    (delta: number) => {
      const qtyValue = Math.max(1, quantity + delta);
      selectedVariant &&
        qtyValue <= selectedVariant?.qty &&
        setQuantity(qtyValue);
    },
    [quantity, selectedVariant]
  );

  const checkattr_2 = useCallback(
    (value: string) => {
      if (attrCombination.attr_1) {
        return baseVariants.find(
          (variant) =>
            variant.attr_1 == attrCombination.attr_1 &&
            variant.attr_2 == value &&
            variant.qty > 0
        );
      }
      return true;
    },
    [attrCombination]
  );
  const checkattr_3 = useCallback(
    (value: string) => {
      if (attrCombination.attr_1 && attrCombination.attr_2) {
        // eval(findVariant())
        return baseVariants.find(
          (variant) =>
            variant.attr_1 == attrCombination.attr_1 &&
            variant.attr_2 == attrCombination.attr_2 &&
            variant.attr_3 == value &&
            variant.qty > 0
        );
      }
      return true;
    },
    [attrCombination]
  );

  // Add to cart action
  const AddToCartAction = useCallback(async () => {
    if (!selectedVariant) {
      setError("Please select a valid variant.");
      return;
    }

    setLoad(true);
    try {
      const response = await addItemToCart(
        prod.id,
        selectedVariant.id,
        quantity
      );
      setCart(response);
      console.log(response);
    } catch (error) {
      console.error(error);
      setError("Failed to add item to cart. Please try again.");
    } finally {
      setLoad(false);
    }
  }, [selectedVariant, quantity, setCart]);

  return (
    <>
      <div className="col-lg-7">
        <div
          className="product-single__media"
          data-media-type="vertical-thumbnail"
        >
          <div className="product-single__thumbnail">
            <div className="swiper-container">
              <div className="swiper-wrapper flex-column">
                {selectedVariantImages?.map((img, indx) => (
                  <div
                    className="swiper-slide product-single__image-item"
                    style={{ height: "auto" }}
                    key={indx}
                  >
                    <Image
                      loading="lazy"
                      className="h-auto"
                      src={`/assets/images/products/${img}`}
                      width={110}
                      height={110}
                      alt=""
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="product-single__image flex-1">
            <div className="swiper-container">
              <div className="swiper-wrapper">
                {selectedVariantImages?.map((img, indx) => (
                  <div
                    className="swiper-slide product-single__image-item"
                    key={indx}
                  >
                    <Image
                      loading="lazy"
                      className="h-auto"
                      src={`/assets/images/products/${img}`}
                      width="674"
                      height="674"
                      alt=""
                    />
                  </div>
                ))}
              </div>
              <div className="swiper-button-prev">
                <svg
                  width="7"
                  height="11"
                  viewBox="0 0 7 11"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <use href="#icon_prev_sm" />
                </svg>
              </div>
              <div className="swiper-button-next">
                <svg
                  width="7"
                  height="11"
                  viewBox="0 0 7 11"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <use href="#icon_next_sm" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="col-lg-5">
        <div className=" flex justify-between">
          <h1 className="product-single__name">{prod?.name}</h1>
          <div className="product-single__rating">
            <div className="reviews-group d-flex">
              <div
                className="star-rate"
                style={
                  {
                    "--i": `${Math.ceil(
                      ((prod?.avgRate as number) / 5) * 100
                    )}%`,
                  } as React.CSSProperties
                }
              ></div>
            </div>
            <span className="reviews-note text-lowercase text-secondary ms-1">
              {prod?.noReview} reviews
            </span>
          </div>
        </div>

        <div className="flex flex-column">
          {/* price and short desc */}

          <div className="product-single__short-desc mb-3">
            <p className="mb-0">{prod?.shortDesc}</p>
          </div>
          <div className="product-single__price mb-2">
            <span className="money font-bold">
              EGP{selectedVariant?.price ?? prod?.price.toString()}
            </span>
          </div>
          {/* Attribute Selectors */}
          <div className="flex flex-column">
            <div className="mb-3">
              <h4></h4>
              <div className="flex gap-1">
                {attributes.attr_1?.map((value) => (
                  <button
                    onClick={() =>
                      setAttrComb((prev) => ({
                        ...prev,
                        attr_1: value,
                      }))
                    }
                    key={value}
                    className={`border-2 hover:border-sky-600 ${
                      attrCombination.attr_1 == value ? "border-sky-600" : ""
                    }`}
                  >
                    <ImageColor value={value} />
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-3">
              <h4></h4>
              <div className="flex gap-1">
                {attributes.attr_2?.map((value) => (
                  <button
                    onClick={() =>
                      setAttrComb((prev) => ({
                        ...prev,
                        attr_2: value,
                      }))
                    }
                    key={value}
                    className={`attrs border px-3 py-2 hover:bg-black hover:text-white transition ${
                      attrCombination.attr_2 == value
                        ? "bg-black text-white"
                        : ""
                    } `}
                    disabled={!checkattr_2(value)}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-3">
              <h4></h4>
              <div className="flex gap-1">
                {attributes.attr_3?.map((value) => (
                  <button
                    onClick={() =>
                      setAttrComb((prev) => ({
                        ...prev,
                        attr_3: value,
                      }))
                    }
                    key={value}
                    className={`attrs border px-3 py-2 hover:bg-black hover:text-white transition ${
                      attrCombination.attr_3 == value
                        ? "bg-black text-white"
                        : ""
                    } `}
                    disabled={!checkattr_3(value)}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Stock Availability */}
          {/* {JSON.stringify(selectedVariant)} */}
          <div className="block m-0 py-3">
            {selectedVariant && selectedVariant.qty
              ? `Available: ${selectedVariant.qty}`
              : "Not Available"}
          </div>

          {/* Quantity Control */}
          <div className="product-single__addtocart">
            <div className="qty-control position-relative">
              <input
                type="number"
                name="quantity"
                value={quantity}
                min="1"
                className="qty-control__number text-center"
                onChange={(e) =>
                  setQuantity(Math.max(1, Number(e.target.value)))
                }
                aria-label="Quantity"
              />
              <button
                onClick={() => handleQuantityChange(-1)}
                className="position-absolute -translate-y-3 top-50 w-6 text-center left-2 cursor-pointer bg-slate-900 text-white rounded-full"
                aria-label="Decrease quantity"
              >
                <strong>-</strong>
              </button>
              <button
                onClick={() => handleQuantityChange(1)}
                className="position-absolute -translate-y-3 top-50 w-6 text-center right-2 cursor-pointer bg-slate-900 text-white rounded-full"
                aria-label="Increase quantity"
              >
                <strong>+</strong>
              </button>
            </div>

            {/* Add to Cart Button */}
            <button
              className="btn btn-primary btn-addtocart"
              onClick={AddToCartAction}
              disabled={load || !selectedVariant}
              aria-label="Add to cart"
            >
              {load ? "Loading..." : "Add to Cart"}
            </button>
          </div>

          {/* Error Message */}
          {error && <div className="text-red-500">{error}</div>}

          {/* Wishlist Link */}
          <div className="product-single__addtolinks">
            <Link href="#" className="menu-link menu-link_us-s add-to-wishlist">
              <svg
                width="16"
                height="16"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <use href="#icon_heart" />
              </svg>
              <span>Add to Wishlist</span>
            </Link>
          </div>
        </div>
        <div className="product-single__meta-info">
          <div className="meta-item">
            <label>SKU:</label>
            <span>{prod.SKU}</span>
          </div>
          <div className="meta-item">
            <label>Categories:</label>
            <span>{prod.category?.name}</span>
          </div>
        </div>
      </div>
    </>
  );
});

export default AddToCart;
