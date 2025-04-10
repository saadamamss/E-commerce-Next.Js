"use client";
import Image from "next/image";
import Link from "next/link";
import { memo, useState } from "react";
import { useCookies } from "react-cookie";
import EmptyWishlist from "./empty";
type products = {
  name: string;
  id: number;
  category: {
    name: string;
  } | null;
  slug: string;
  SKU: string;
  price: number;
  images: string | null;
};
const WishlistContent = memo(function WishlistContent({
  data,
}: {
  data: string;
}) {
  const [products, setProducts] = useState<products[]>(JSON.parse(data));
  const [cookie, setNewCookie] = useCookies(["wishlist"]);
  function handleRemoveFromWishlist(productId: number) {
    const indx = cookie.wishlist.indexOf(productId);
    cookie.wishlist.splice(indx, 1);
    setNewCookie("wishlist", cookie.wishlist);
    //
    const newProductList = products.filter((prod) => prod.id !== productId);
    setProducts(newProductList);
  }

  if (!products?.length) {
    return <EmptyWishlist />;
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
                        >
                          <svg width="12" height="12" viewBox="0 0 12 12">
                            <use href="#icon_close" />
                          </svg>
                        </button>
                        );
                      </div>

                      <div className="pc__info position-relative">
                        <p className="pc__category">{product.category?.name}</p>
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
});

export default WishlistContent;
