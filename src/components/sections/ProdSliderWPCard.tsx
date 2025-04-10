import { getCollectionProducts } from "@/lib/helpers/functions";
import Image from "next/image";
import Link from "next/link";
import Addcartbtn_nd from "../Addcartbtn_nd";
import AddToWishList from "../AddToWishList";

export default async function ProdSliderWPCard({ data }: { data: string }) {
  const parsedData = JSON.parse(data);
  const products = await getCollectionProducts(
    parsedData.collectionId as string,
    parsedData.maxcards as number
  );

  if (!products.length) return null;

  function getdate(date: string) {
    const d = new Date(date);
    return d.toLocaleDateString("en-GB").replaceAll("/", "-");
  }
  // 
  return (
    <section className="hot-deals container">
      <h2 className="section-title  text-capitalize text-center mb-3 pb-xl-3 mb-xl-4">
        {parsedData.headtitle}
      </h2>
      <div className="row">
        <div className="col-md-6 col-lg-4 col-xl-20per d-flex align-items-center flex-column justify-content-center py-4 align-items-md-start">
          <h2 className="text-capitalize">{parsedData.title}</h2>
          <h2 className="fw-bold">{parsedData.subtitle}</h2>

          <div
            className="position-relative d-flex align-items-center text-center pt-xxl-4 js-countdown mb-3"
            data-date={getdate(parsedData.date)}
            data-time="06:00"
          >
            <div className="day countdown-unit">
              <span className="countdown-num d-block"></span>
              <span className="countdown-word text-uppercase text-secondary">
                Days
              </span>
            </div>

            <div className="hour countdown-unit">
              <span className="countdown-num d-block"></span>
              <span className="countdown-word text-uppercase text-secondary">
                Hours
              </span>
            </div>

            <div className="min countdown-unit">
              <span className="countdown-num d-block"></span>
              <span className="countdown-word text-uppercase text-secondary">
                Mins
              </span>
            </div>

            <div className="sec countdown-unit">
              <span className="countdown-num d-block"></span>
              <span className="countdown-word text-uppercase text-secondary">
                Sec
              </span>
            </div>
          </div>

          <Link
            href={parsedData.link.url}
            className="btn-link default-underline text-uppercase fw-medium mt-3"
          >
            {parsedData.link.title}
          </Link>
        </div>
        <div className="col-md-6 col-lg-8 col-xl-80per">
          <div className="position-relative">
            <div
              className="swiper-container js-swiper-slider"
              data-settings='{
  "autoplay": {
    "delay": 5000
  },
  "slidesPerView": 4,
  "slidesPerGroup": 4,
  "effect": "none",
  "loop": false,
  "breakpoints": {
    "320": {
      "slidesPerView": 2,
      "slidesPerGroup": 2,
      "spaceBetween": 14
    },
    "768": {
      "slidesPerView": 2,
      "slidesPerGroup": 3,
      "spaceBetween": 24
    },
    "992": {
      "slidesPerView": 3,
      "slidesPerGroup": 1,
      "spaceBetween": 30,
      "pagination": false
    },
    "1200": {
      "slidesPerView": 4,
      "slidesPerGroup": 1,
      "spaceBetween": 30,
      "pagination": false
    }
  }
}'
            >
              <div className="swiper-wrapper">
                {products.map((product) => (
                  <div
                    className="swiper-slide product-card product-card_style3"
                    key={product.id}
                  >
                    <div className="pc__img-wrapper">
                      <Link href={`/${product?.slug}/${product.SKU}`}>
                        <Image
                          loading="lazy"
                          src={`/assets/images/products/${
                            product.images?.split(",")[0]
                          }`}
                          width="258"
                          height="313"
                          alt="Cropped Faux leather Jacket"
                          className="pc__img"
                        />
                        <Image
                          loading="lazy"
                          src={`/assets/images/products/${
                            product.images?.split(",")[0]
                          }`}
                          width="258"
                          height="313"
                          alt="Cropped Faux leather Jacket"
                          className="pc__img pc__img-second"
                        />
                      </Link>
                    </div>

                    <div className="pc__info position-relative">
                      <h6 className="pc__title mb-2">
                        <Link href={`/${product?.slug}/${product.SKU}`}>
                          {product?.name}
                        </Link>
                      </h6>
                      <div className="product-card__price d-flex">
                        <span className="font-bold text-lg text-secondary">
                          EGP{Number(product?.price)}
                        </span>
                      </div>

                      <div className="anim_appear-bottom position-absolute bottom-0 start-0 d-none d-sm-flex align-items-center w-100 justify-between bg-body">
                        <Addcartbtn_nd product={JSON.stringify(product)} />

                        <AddToWishList
                          productId={product.id}
                          className="pc__btn-wl"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
