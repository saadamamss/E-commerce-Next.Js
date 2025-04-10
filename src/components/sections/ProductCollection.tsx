import { getCollectionProducts } from "@/lib/helpers/functions";
import Image from "next/image";
import Link from "next/link";
import Addcartbtn_nd from "../Addcartbtn_nd";
import AddToWishList from "../AddToWishList";

export default async function ProductsCollection({ data }: { data: string }) {
  const parsedData = JSON.parse(data);
  const products = await getCollectionProducts(
    parsedData.collectionId as string,
    parsedData.maxcards as number
  );

  if (!products.length) return null;

  return (
    <section className="products-grid container">
      <h2 className="section-title text-center mb-3 pb-xl-3 mb-xl-4">
        {parsedData.title}
      </h2>

      <div className="row">
        {products?.map((item) => (
          <div className="col-6 col-md-4 col-lg-3" key={item.id}>
            <div className="product-card product-card_style3 mb-3 mb-md-4 mb-xxl-5">
              <div className="pc__img-wrapper">
                <Link href={`/${item.slug}/${item.SKU}`}>
                  <Image
                    loading="lazy"
                    src={`/assets/images/products/${
                      item.images?.split(",")[0]
                    }`}
                    width="330"
                    height="400"
                    alt="Cropped Faux leather Jacket"
                    className="pc__img"
                  />
                </Link>
              </div>

              <div className="pc__info position-relative">
                <h6 className="pc__title mb-2">
                  <Link href={`/${item.slug}/${item.SKU}`}>{item.name}</Link>
                </h6>
                <div className="product-card__price d-flex align-items-center">
                  <span className="money price text-secondary">
                    EGP{item.price.toString()}
                  </span>
                </div>

                <div className="anim_appear-bottom position-absolute bottom-0 start-0 d-none d-sm-flex align-items-center justify-content-between w-100 bg-body">
                  <Addcartbtn_nd product={JSON.stringify(item)} />

                  <AddToWishList productId={item.id} className="pc__btn-wl" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-2">
        <Link
          className="btn-link btn-link_lg default-underline text-uppercase fw-medium"
          href={parsedData.link.url}
        >
          {parsedData.link.title}
        </Link>
      </div>
    </section>
  );
}
