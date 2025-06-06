"use client";

import { useMemo, useState, useCallback, memo, useEffect } from "react";
import { addItemToCart } from "@/lib/models/Cart";
import { useAppContext } from "@/app/AppProvider";
import Image from "next/image";
import Link from "next/link";

const CartOverlayAdd = memo(function CartOverlayAdd() {
  const {
    cart,
    cartDrawerContent: prod,
    setShowCartInDrawer,
  } = useAppContext();
  //
  if (!prod) return null;
  //
  const [quantity, setQuantity] = useState(1);
  const [load, setLoad] = useState(false);
  const [error, setError] = useState("");
  const { setCart } = useAppContext();

  // =============================================================================
  const subAttributes: { type: string; values: string[] }[] = useMemo(() => {
    const values = prod.variants?.reduce((acc, variant) => {
      const { id, SKU, quantity, images, price, ...rest } = variant;
      Object.keys(rest).forEach((key) => {
        if (!rest[key]) return;
        const bv = acc.find((i) => i.type == key);

        if (!bv) {
          acc.push({ type: key, values: [rest[key] as string] });
          return;
        }
        if (!bv.values.includes(rest[key] as string)) {
          bv.values.push(rest[key] as string);
        }
      });

      return acc;
    }, [] as { type: string; values: string[] }[]);

    return values;
  }, []);

  // =============================================================================

  // Memoize selected variant to avoid recalculations
  const [variantAttributes, setVariantAttributes] = useState<
    Record<string, string | null>
  >({});

  const avaliableAttributes = useMemo(() => {
    return prod.variants.filter(
      (i) => i[prod.variantType] == variantAttributes[prod.variantType]
    );
  }, [variantAttributes]);

  const isAvailableAttr = useCallback(
    (attribute: string, value: string): boolean => {
      return !!avaliableAttributes.find(
        (i) => i[attribute] && i[attribute] === value
      );
    },
    [avaliableAttributes]
  );

  // =============================================================================

  const selectedVariant = useMemo(() => {
    const variant = subAttributes.reduce((acc, attr): any[] => {
      acc = acc.filter((i) => i[attr.type] == variantAttributes[attr.type]);
      return acc;
    }, avaliableAttributes);

    return variant.length ? variant[0] : {};
  }, [variantAttributes]);

  // =============================================================================

  // Memoize image for the selected color
  const MainAttrImage = useCallback(({ value }: { value: string }) => {
    const image = prod.variants
      ?.find((k) => k[prod.variantType] === value)
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

  // =============================================================================

  const ImageInSide = useCallback(() => {
    const images =
      prod.variants?.find(
        (k) => k[prod.variantType] === variantAttributes[prod.variantType]
      )?.images ?? prod.images;

    return images?.split(",").map((img, indx) => (
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

  // =============================================================================
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
      setShowCartInDrawer(true);
    } catch (error) {
      setError("Failed to add item to cart. Please try again.");
    } finally {
      setLoad(false);
    }
  }, [selectedVariant, quantity, setCart]);

  // =============================================================================

  useEffect(() => {
    setError("");
  }, [selectedVariant]);

  //
  return (
    <>
      <div className="col-12">
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
        </div>
      </div>

      <div className="col-12">
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

          {/* Error Message */}
          {error && <div className="text-red-500">{error}</div>}
          <div className="product-single__addtocart">
            {/* Add to Cart Button */}
            <button
              className="btn btn-primary btn-addtocart"
              onClick={AddToCartAction}
              disabled={load || !selectedVariant.id}
              aria-label="Add to cart"
            >
              {load ? "Loading..." : "Add to Cart"}
            </button>
          </div>

          {/* Wishlist Link */}
          <div className="product-single__addtolinks">
            <Link
              href={`/${prod.slug}/${prod.SKU}`}
              className="menu-link menu-link_us-s text-md"
            >
              <b>View More Details </b>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
});

export default CartOverlayAdd;
