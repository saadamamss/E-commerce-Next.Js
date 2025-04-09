"use client";
import { useAppContext } from "../AppProvider";
import { useEffect, useState, useCallback } from "react";
import { Api } from "../api/routes";
import Image from "next/image";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Link from "next/link";

export default function WishList() {
  const { WishList, wishlistDispatch } = useAppContext();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWishlistProducts = useCallback(async () => {
    if (!WishList.length) {
      setProducts([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const { data } = await Api.post("/wishlist/", { WishList });
      setProducts(data);
    } catch (err) {
      console.error("Failed to fetch wishlist:", err);
      setError("Failed to load wishlist. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [WishList]);

  useEffect(() => {
    fetchWishlistProducts();
  }, [fetchWishlistProducts]);

  const handleRemoveFromWishlist = useCallback(
    (productId) => {
      wishlistDispatch({
        type: "REMOVE_ITEM",
        payload: productId,
      });
    },
    [wishlistDispatch]
  );

  if (loading) {
    return (
      <main className="pt-90">
        <div className="mb-4 pb-4"></div>
        <div className="container">
          <h1 className="text-3xl">Wishlist</h1>
          <hr />
          <div className="row mx-0">
            <div className="col-lg-12">
              <div className="products-grid row row-cols-2 row-cols-lg-4">
                {[...Array(4)].map((_, index) => (
                  <div className="product-card-wrapper" key={index}>
                    <div className="product-card mb-3 mb-md-4 mb-xxl-5">
                      <Skeleton height={400} />
                      <div className="pc__info position-relative mt-2">
                        <Skeleton width={100} />
                        <Skeleton width={150} />
                        <Skeleton width={80} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="pt-90">
        <div className="container">
          <div className="alert alert-danger">{error}</div>
          <button className="btn btn-primary" onClick={fetchWishlistProducts}>
            Retry
          </button>
        </div>
      </main>
    );
  }

  if (!products.length) {
    return (
      <main className="pt-90">
        <div className="mb-4 pb-4"></div>
        <div className="container">
          <div className="d-flex flex-column align-items-center text-center py-5 border rounded-2xl">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              className="mb-3"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
            <h3 className="mb-2">Your wishlist is empty</h3>
            <p className="text-muted">
              Add items to your wishlist to see them here
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-90">
      <div className="mb-4 pb-4"></div>
      <div className="container">
        <h1 className="text-3xl">Wishlist</h1>
        <hr />
        <div className="row mx-0">
          <div className="col-lg-12">
            <div className="page-content my-account__wishlist">
              <div className="products-grid row row-cols-2 row-cols-lg-4">
                {products.map((product) => (
                  <div className="product-card-wrapper" key={product.id}>
                    <div className="product-card mb-3 mb-md-4 mb-xxl-5">
                      <div className="pc__img-wrapper">
                        <div className="swiper-container background-img js-swiper-slider">
                          <div className="swiper-wrapper">
                            {product?.images?.split(",").map((img, index) => (
                              <div className="swiper-slide" key={index}>
                                <Link href={`/${product.slug}/${product.SKU}`}>
                                  <Image
                                    loading="lazy"
                                    src={`/assets/images/products/${img}`}
                                    width={330}
                                    height={400}
                                    alt={product.name}
                                    className="pc__img"
                                  />
                                </Link>
                              </div>
                            ))}
                          </div>
                          <span className="pc__img-prev">
                            <svg width="7" height="11" viewBox="0 0 7 11">
                              <use href="#icon_prev_sm" />
                            </svg>
                          </span>
                          <span className="pc__img-next">
                            <svg width="7" height="11" viewBox="0 0 7 11">
                              <use href="#icon_next_sm" />
                            </svg>
                          </span>
                        </div>
                        <button
                          className="btn-remove-from-wishlist"
                          onClick={() => handleRemoveFromWishlist(product.id)}
                          aria-label={`Remove ${product.name} from wishlist`}
                        >
                          <svg width="12" height="12" viewBox="0 0 12 12">
                            <use href="#icon_close" />
                          </svg>
                        </button>
                      </div>

                      <div className="pc__info position-relative">
                        <p className="pc__category">{product.category.name}</p>
                        <Link
                          href={`/${product.slug}/${product.SKU}`}
                          className="pc__title"
                        >
                          {product.name}
                        </Link>
                        <div className="product-card__price d-flex">
                          <span className="money price font-bold">
                            EGP{Number(product.price).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
