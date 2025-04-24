import { notFound } from "next/navigation";
import { findPage, hpp, searchParam } from "@/lib/helpers/functions";
import PageBuilder from "@/components/PageBuilder";
import FilterComponent from "@/components/FilterComponent";
import Pagination from "@/components/Pagination";
import Addcartbtn from "@/components/Addcartbtn";
import Image from "next/image";
import Link from "next/link";
import Product from "../../lib/models/Product";
import { JsonValue } from "@prisma/client/runtime/library";
import AddToWishList from "@/components/AddToWishList";
import { productCategories } from "@/lib/models/Category";

// Define interfaces for better type safety
interface PageFoundType {
  type: string;
  slug: string;
  content: JsonValue;
}

export default async function ShowProducts({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string; id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const slug = (await params).slug;

  // Find the requested page
  const pageFound: PageFoundType | null = await findPage(slug);

  if (!pageFound) return notFound();

  // If the page is a "build" type, render the PageBuilder
  if (pageFound.type === "build") {
    return <PageBuilder sections={pageFound.content as object} />;
  }

  // Parse search parameters
  const { page, ...filters } = hpp((await searchParams) as searchParam);

  // Fetch filtered products
  const { products, count, pagination } = await new Product(
    pageFound,
    filters,
    page
  ).getProducts();

  // Fetch categories based on the slug

  const categories = await productCategories(pageFound.type, slug);

  return (
    <main className="pt-90">
      <section className="shop-main container d-flex pt-4 pt-xl-5">
        {/* Filters section */}
        <FilterComponent filters={filters} categories={categories} />

        {/* Products section */}
        <div className="shop-list flex-grow-1">
          {/* Breadcrumb and product count */}
          <div className="d-flex justify-content-between mb-4 pb-md-2">
            <div className="breadcrumb mb-0 d-none d-md-block flex-grow-1">
              <Link
                href="/"
                className="menu-link menu-link_us-s text-uppercase fw-medium"
              >
                Home
              </Link>
              <span className="breadcrumb-separator menu-link fw-medium ps-1 pe-1">
                /
              </span>
              <span className="menu-link menu-link_us-s text-uppercase fw-medium">
                {slug}
              </span>
            </div>

            <div className="shop-acs d-flex align-items-center justify-content-between justify-content-md-end flex-grow-1">
              <div className="col-size align-items-center order-1 d-flex">
                <span className="text-uppercase fw-medium me-2">
                  We Found ({count}) Items
                </span>
              </div>
            </div>
            <div className="shop-filter d-flex align-items-center order-0 order-md-3 d-lg-none">
              <button
                className="btn-link btn-link_f d-flex align-items-center ps-0 js-open-aside"
                data-aside="shopFilter"
              >
                <svg
                  className="d-inline-block align-middle me-2"
                  width="14"
                  height="10"
                  viewBox="0 0 14 10"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <use href="#icon_filter" />
                </svg>
                <span className="text-uppercase fw-medium d-inline-block align-middle">
                  Filter
                </span>
              </button>
            </div>
          </div>

          {/* Products grid */}
          <div
            className="products-grid row row-cols-2 row-cols-md-3"
            id="products-grid"
          >
            {!products?.length && <h2 className="py-4">No Products Found</h2>}

            {products?.map((product) => (
              <div className="product-card-wrapper" key={product.id}>
                <div className="product-card mb-3 mb-md-4 mb-xxl-5">
                  <div className="pc__img-wrapper">
                    <div
                      className="swiper-container background-img js-swiper-slider"
                      data-settings='{"resizeObserver": true}'
                    >
                      <div className="swiper-wrapper">
                        {product.images?.split(",").map((img, ind) => (
                          <div className="swiper-slide" key={ind}>
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

                    <Addcartbtn product={JSON.stringify(product)} />
                  </div>

                  <div className="pc__info position-relative">
                    <p className="pc__category">{product.category?.name}</p>
                    {!!product.noReview && (
                      <div className="product-card__review d-flex align-items-center">
                        <div className="reviews-group d-flex">
                          <div
                            className="star-rate"
                            style={
                              {
                                "--i": `${Math.ceil(
                                  (Number(product.avgRate) / 5) * 100
                                )}%`,
                              } as React.CSSProperties
                            }
                          ></div>
                        </div>
                        <span className="reviews-note text-lowercase text-secondary ms-1">
                          {product.noReview} reviews
                        </span>
                      </div>
                    )}
                    <h6 className="pc__title mb-2">
                      <Link href={`/${product.slug}/${product.SKU}`}>
                        {product.name}
                      </Link>
                    </h6>

                    <div className="product-card__price font-bold">
                      <span className="money">EGP{Number(product.price)}</span>
                    </div>

                    <AddToWishList productId={product.id} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <Pagination pagination={pagination} />
        </div>
      </section>
      <br />
    </main>
  );
}
