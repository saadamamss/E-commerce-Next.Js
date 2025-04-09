import Image from "next/image";
import Link from "next/link";

export default function PromoSlider({ data }: { data: string }) {
  const parsedData = JSON.parse(data);

  return (
    <section className="category-carousel container">
      <h2 className="section-title text-center mb-3 pb-xl-2 mb-xl-4">
        {parsedData.sectionTitle}
      </h2>

      <div className="position-relative">
        <div
          className="swiper-container js-swiper-slider"
          data-settings='{
"autoplay": {
  "delay": 5000
},
"slidesPerView": 8,
"slidesPerGroup": 1,
"effect": "none",
"loop": true,
"navigation": {
  "nextEl": ".products-carousel__next-1",
  "prevEl": ".products-carousel__prev-1"
},
"breakpoints": {
  "320": {
    "slidesPerView": 2,
    "slidesPerGroup": 2,
    "spaceBetween": 15
  },
  "768": {
    "slidesPerView": 4,
    "slidesPerGroup": 4,
    "spaceBetween": 30
  },
  "992": {
    "slidesPerView": 6,
    "slidesPerGroup": 1,
    "spaceBetween": 45,
    "pagination": false
  },
  "1200": {
    "slidesPerView": 8,
    "slidesPerGroup": 1,
    "spaceBetween": 60,
    "pagination": false
  }
}
}'
        >
          <div className="swiper-wrapper">
            {parsedData?.slides?.map(
              (
                item: { image: string; link: { title: string; url: string } },
                index: number
              ) => (
                <div className="swiper-slide" key={index}>
                  <Image
                    loading="lazy"
                    className="w-100 h-auto mb-3"
                    src={`/assets/images/home/demo3/${item.image}`}
                    width="124"
                    height="124"
                    alt=""
                  />
                  <div className="text-center">
                    <Link
                      href={item.link.url}
                      className="text-capitalize menu-link fw-medium"
                    >
                      {item.link.title}
                    </Link>
                  </div>
                </div>
              )
            )}
          </div>
        </div>

        <div className="products-carousel__prev products-carousel__prev-1 position-absolute top-50 d-flex align-items-center justify-content-center">
          <svg
            width="25"
            height="25"
            viewBox="0 0 25 25"
            xmlns="http://www.w3.org/2000/svg"
          >
            <use href="#icon_prev_md" />
          </svg>
        </div>
        <div className="products-carousel__next products-carousel__next-1 position-absolute top-50 d-flex align-items-center justify-content-center">
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
    </section>
  );
}
