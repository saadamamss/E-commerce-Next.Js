import { prisma } from "@/prisma";
import Image from "next/image";
import { notFound } from "next/navigation";
import AddTocart from "./components/AddToCart";
import AddReviewForm from "./components/AddReviewForm";
import ReviewsListComponent from "./components/Reviews";
import Link from "next/link";
import Addcartbtn from "@/components/Addcartbtn";

export default async function ProductDetails({
  params,
}: {
  params: Promise<{ slug: string; id: string }>;
}) {
  const slug = (await params).slug;
  const id = (await params).id;

  const product = await prisma.product.findUnique({
    where: {
      SKU: id,
      slug: slug,
    },
    include: {
      reviews: {
        include: {
          user: true,
        },
      },
      variants: {
        omit: {
          createdAt: true,
          updatedAt: true,
          productId: true,
        },
      },
      category: true,
      brand: true,
    },
  });

  const related_products = await prisma.product.findMany({
    where: {
      id: { not: product?.id },
      categoryId: product?.categoryId,
    },
    include: {
      category: true,
    },
    take: 8,
  });

  if (!product) {
    return notFound();
  }
  return (
    <>
      {product && (
        <main className="pt-90">
          <div className="mb-md-1 pb-md-3"></div>
          <section className="product-single container py-5">
            <div className="row">
              {product && <AddTocart product={JSON.stringify(product)} />}
              
            </div>
            <div className="product-single__details-tab">
              <ul className="nav nav-tabs" id="myTab" role="tablist">
                <li className="nav-item" role="presentation">
                  <a
                    className="nav-link nav-link_underscore active"
                    id="tab-description-tab"
                    data-bs-toggle="tab"
                    href="#tab-description"
                    role="tab"
                    aria-controls="tab-description"
                    aria-selected="true"
                  >
                    Description
                  </a>
                </li>
                <li className="nav-item" role="presentation">
                  <a
                    className="nav-link nav-link_underscore"
                    id="tab-additional-info-tab"
                    data-bs-toggle="tab"
                    href="#tab-additional-info"
                    role="tab"
                    aria-controls="tab-additional-info"
                    aria-selected="false"
                  >
                    Additional Information
                  </a>
                </li>
                <li className="nav-item" role="presentation">
                  <a
                    className="nav-link nav-link_underscore"
                    id="tab-reviews-tab"
                    data-bs-toggle="tab"
                    href="#tab-reviews"
                    role="tab"
                    aria-controls="tab-reviews"
                    aria-selected="false"
                  >
                    Reviews ({product?.reviews.length})
                  </a>
                </li>
              </ul>
              <div className="tab-content">
                <div
                  className="tab-pane fade show active"
                  id="tab-description"
                  role="tabpanel"
                  aria-labelledby="tab-description-tab"
                >
                  <div className="product-single__description">
                    {product?.description}
                  </div>
                </div>
                <div
                  className="tab-pane fade"
                  id="tab-additional-info"
                  role="tabpanel"
                  aria-labelledby="tab-additional-info-tab"
                >
                  <div className="product-single__addtional-info">
                    {product?.features}
                  </div>
                </div>
                <div
                  className="tab-pane fade"
                  id="tab-reviews"
                  role="tabpanel"
                  aria-labelledby="tab-reviews-tab"
                >
                  <h2 className="product-single__reviews-title">Reviews</h2>
                  <div className="product-single__reviews-list">
                    <ReviewsListComponent
                      reviews={JSON.stringify(product?.reviews)}
                    />
                  </div>

                  <AddReviewForm id={product.id} />
                </div>
              </div>
            </div>
          </section>

          {/* related products */}

          {related_products.length && (
            <section className="products-carousel container">
              <h2 className="h3 text-uppercase mb-4 pb-xl-2 mb-xl-4">
                Related <strong>Products</strong>
              </h2>

              <div id="related_products" className="position-relative">
                <div
                  className="swiper-container js-swiper-slider"
                  data-settings='{
            "autoplay": false,
            "slidesPerView": 4,
            "slidesPerGroup": 4,
            "effect": "none",
            "loop": false,
            "pagination": {
              "el": "#related_products .products-pagination",
              "type": "bullets",
              "clickable": true
            },
            "navigation": {
              "nextEl": "#related_products .products-carousel__next",
              "prevEl": "#related_products .products-carousel__prev"
            },
            "breakpoints": {
              "320": {
                "slidesPerView": 2,
                "slidesPerGroup": 2,
                "spaceBetween": 14
              },
              "768": {
                "slidesPerView": 3,
                "slidesPerGroup": 3,
                "spaceBetween": 24
              },
              "992": {
                "slidesPerView": 4,
                "slidesPerGroup": 4,
                "spaceBetween": 30
              }
            }
          }'
                >
                  <div className="swiper-wrapper">
                    {related_products?.map((item, i) => (
                      <div className="swiper-slide product-card" key={i}>
                        <div className="pc__img-wrapper">
                          <div
                            className="swiper-container background-img js-swiper-slider"
                            data-settings='{"resizeObserver": true}'
                          >
                            <div className="swiper-wrapper">
                              {item.images?.split(",").map((img, ind) => (
                                <div className="swiper-slide" key={ind}>
                                  <Link href={`/${item.slug}/${item.SKU}`}>
                                    <Image
                                      loading="lazy"
                                      src={`/assets/images/products/${img}`}
                                      width={330}
                                      height={400}
                                      alt={item.name}
                                      className="pc__img"
                                    />
                                  </Link>
                                </div>
                              ))}
                            </div>

                            <span className="pc__img-prev">
                              <svg
                                width="7"
                                height="11"
                                viewBox="0 0 7 11"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <use href="#icon_prev_sm" />
                              </svg>
                            </span>
                            <span className="pc__img-next">
                              <svg
                                width="7"
                                height="11"
                                viewBox="0 0 7 11"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <use href="#icon_next_sm" />
                              </svg>
                            </span>
                          </div>

                          <Addcartbtn product={JSON.stringify(item)} />
                        </div>

                        <div className="pc__info position-relative">
                          <p className="pc__category">{item?.category?.name}</p>
                          <h6 className="pc__title">
                            <Link href={`/${item.slug}/${item.SKU}`}>
                              {item?.name}
                            </Link>
                          </h6>
                          <div className="product-card__price d-flex mt-2">
                            <span className="text-black text-lg">
                              EGP{Number(item?.price)}
                            </span>
                          </div>

                          <button
                            className="pc__btn-wl position-absolute top-0 end-0 bg-transparent border-0 js-add-wishlist"
                            title="Add To Wishlist"
                          >
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 20 20"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <use href="#icon_heart" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="absolute top-0 right-0 flex gap-2">
                  <div className="products-carousel__prev  d-flex align-items-center justify-content-center">
                    <svg
                      width="25"
                      height="25"
                      viewBox="0 0 25 25"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <use href="#icon_prev_md" />
                    </svg>
                  </div>

                  <div className="products-carousel__next  d-flex align-items-center justify-content-center">
                    <svg
                      width="25"
                      height="25"
                      viewBox="0 0 25 25"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <use href="#icon_next_md" />
                    </svg>
                  </div>
                </div>

                <div className="products-pagination mt-4 mb-5 d-flex align-items-center justify-content-center"></div>
              </div>
            </section>
          )}
        </main>
      )}
    </>
  );
}
