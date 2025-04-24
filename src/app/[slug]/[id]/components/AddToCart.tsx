"use client";

import { useMemo, useState, useCallback, memo, useEffect } from "react";
import { addItemToCart } from "@/lib/models/Cart";
import { useAppContext } from "@/app/AppProvider";
import Image from "next/image";
import AddToWishList from "@/components/AddToWishList";

interface subAttrs {
  type: string;
  values: string[];
}

const AddToCart = memo(function AddToCart({ product }: { product: string }) {
  const prod = JSON.parse(product);
  const [quantity, setQuantity] = useState(1);
  const [load, setLoad] = useState(false);
  const [error, setError] = useState("");
  const { cart, setCart } = useAppContext();

  // =============================================================================
  const subAttributes: { type: string; values: string[] }[] = useMemo(() => {
    const values = prod.variants?.reduce((acc: subAttrs[], variant: any) => {
      const { id, SKU, quantity, images, price, ...rest } = variant;
      Object.keys(rest).forEach((key) => {
        if (!rest[key]) return;
        const bv = acc.find((i) => i.type == key);
        if (!bv) {
          acc.push({ type: key, values: [rest[key]] });
          return;
        }
        if (!bv.values.includes(rest[key])) {
          bv.values.push(rest[key]);
        }
      });

      return acc;
    }, [] as subAttrs[]);

    return values;
  }, []);

  // =============================================================================

  // Memoize selected variant to avoid recalculations
  const [variantAttributes, setVariantAttributes] = useState<
    Record<string, string | null>
  >({});

  const avaliableAttributes = useMemo(() => {
    return prod.variants.filter(
      (i: any) => i[prod.variantType] == variantAttributes[prod.variantType]
    );
  }, [variantAttributes]);

  const isAvailableAttr = useCallback(
    (attribute: string, value: string): boolean => {
      return !!avaliableAttributes.find(
        (i: any) => i[attribute] && i[attribute] === value
      );
    },
    [avaliableAttributes]
  );

  const selectedVariant = useMemo(() => {
    const variant = subAttributes.reduce((acc, attr): any[] => {
      acc = acc.filter(
        (i: any) => i[attr.type] == variantAttributes[attr.type]
      );
      return acc;
    }, avaliableAttributes);

    return variant.length ? variant[0] : {};
  }, [variantAttributes]);

  // Memoize image for the selected color
  const MainAttrImage = useCallback(({ value }: { value: string }) => {
    const image = prod.variants
      ?.find((k: any) => k[prod.variantType] === value)
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
  }, []);

  // Handle quantity changes
  const handleQuantityChange = useCallback(
    (delta: number) => {
      const qtyValue = Math.max(1, quantity + delta);
      selectedVariant &&
        qtyValue <= selectedVariant?.quantity &&
        setQuantity(qtyValue);
    },
    [quantity, selectedVariant]
  );

  // ==================================================================
  const ImageInSide = useCallback(() => {
    const images =
      prod.variants?.find(
        (k: any) => k[prod.variantType] === variantAttributes[prod.variantType]
      )?.images ?? prod.images;

    return images?.split(",").map((img: string, indx: number) => (
      <div
        className="swiper-slide product-single__image-item"
        style={{ height: "auto" }}
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
    ));
  }, [variantAttributes]);

  // ===========================================================
  // Add to cart action
  const AddToCartAction = useCallback(async () => {
    if (!selectedVariant.id) {
      setError("Please select a valid variant.");
      return;
    }
    if (selectedVariant?.quantity < quantity) {
      setError("Please enter quantity less than " + selectedVariant?.quantity);
      return;
    }

    const item = cart?.items.find(
      (i) => i.productId == prod.id && i.variantId == selectedVariant.id
    );

    if (item && item.qty + quantity > selectedVariant?.quantity) {
      setError("No more items to add in the cart! ");
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
    } catch (error) {
      setError("Failed to add item to cart. Please try again.");
    } finally {
      setLoad(false);
    }
  }, [selectedVariant, quantity, setCart]);

  //=====================================================================
  useEffect(() => {
    selectedVariant?.quantity < quantity && setQuantity(1);
    setError("");
  }, [selectedVariant]);

  //
  //
  return (
    <>
      <div className="col-lg-7">
        <div
          className="product-single__media"
          data-media-type="vertical-thumbnail"
        >
          <div className="product-single__image flex-1">
            <div className="swiper-container">
              <div className="swiper-wrapper">{<ImageInSide />}</div>
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

          <div className="product-single__thumbnail">
            <div className="swiper-container">
              <div className="swiper-wrapper flex-column">
                {<ImageInSide />}
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
          <div className="product-single__price mb-2 ">
            {selectedVariant?.price &&
            selectedVariant?.price !== prod?.price ? (
              <>
                <span className="money font-bold">
                  EGP{Number(selectedVariant?.price).toFixed(2)}
                </span>
                <span className="line-through px-2 text-small">
                  EGP{Number(prod?.price).toFixed(2)}
                </span>
              </>
            ) : (
              <span className="money font-bold">
                EGP{Number(prod?.price).toFixed(2)}
              </span>
            )}
          </div>
          {/* Attribute Selectors */}
          <div className="flex flex-column">
            {/* {JSON.stringify(variantAttributes)} */}

            <div className="mb-3">
              <h4>{prod.variantType}</h4>
              <div className="flex gap-1">
                {subAttributes
                  .find((i) => i.type == prod.variantType)
                  ?.values.map((attr) => (
                    <button
                      key={attr}
                      value={attr}
                      name={prod.variantType}
                      className={
                        variantAttributes[prod.variantType] == attr
                          ? "border-3 border-sky-500 transition"
                          : ""
                      }
                      onClick={(e) => {
                        setVariantAttributes((prev) => ({
                          ...prev,
                          [prod.variantType]: attr,
                        }));
                      }}
                    >
                      <MainAttrImage value={attr} />
                    </button>
                  ))}
              </div>
            </div>

            {subAttributes
              .filter((i) => i.type !== prod.variantType)
              .map((attr, indx) => (
                <div className="mb-3" key={attr.type}>
                  <h4>{attr.type}</h4>
                  <div className="flex gap-1">
                    {attr?.values?.map((value) => (
                      <button
                        key={value}
                        disabled={!isAvailableAttr(attr.type, value)}
                        name={attr.type}
                        className={`attrs border px-3 py-2 hover:bg-black hover:text-white transition ${
                          variantAttributes[attr.type] == value &&
                          isAvailableAttr(attr.type, value)
                            ? "bg-black text-white"
                            : ""
                        } `}
                        onClick={(e) =>
                          setVariantAttributes((prev) => ({
                            ...prev,
                            [attr.type]: value,
                          }))
                        }
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
          </div>

          {/* Stock Availability */}
          {/* {JSON.stringify(selectedVariant)} */}
          {selectedVariant.id && (
            <div className="block m-0 py-3">
              {selectedVariant.quantity
                ? `Available Quantity: ${selectedVariant.quantity}`
                : "Out Stock"}
            </div>
          )}

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

            {/* Error Message */}
            {error && <div className="text-red-500">{error}</div>}

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

          {/* Wishlist Link */}
          <div className="product-single__addtolinks mb-3">
            <AddToWishList
              productId={prod.id}
              className="add-to-wishlist flex items-center gap-2 "
            >
              <span>Add to Wishlist</span>
            </AddToWishList>
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
