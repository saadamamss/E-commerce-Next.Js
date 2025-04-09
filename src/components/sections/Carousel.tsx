import Image from "next/image";
import Link from "next/link";
type slide = {
  image: string;
  title: string;
  richText: string;
  markup: string;
  link: {
    title: string;
    url: string;
  };
};
export default function CarouselSection({ data }: { data: string }) {
  const parsedData = JSON.parse(data);
  return (
    <>
      <section
        className="swiper-container js-swiper-slider swiper-number-pagination slideshow"
        data-settings='{"autoplay": {"delay": 5000},"slidesPerView": 1,"effect": "fade","loop": true}'
      >
        <div className="swiper-wrapper">
          {parsedData.map((slide: slide, index: number) => (
            <div className="swiper-slide" key={index}>
              <div className="overflow-hidden position-relative h-100">
                <div className="slideshow-character position-absolute bottom-0 pos_right-center">
                  <Image
                    loading="lazy"
                    src={`/assets/images/home/demo3/${slide.image}`}
                    width="542"
                    height="733"
                    alt="Woman Fashion 1"
                    className="slideshow-character__img animate animate_fade animate_btt animate_delay-9"
                  />
                  <div className="character_markup type2">
                    <p className="text-uppercase font-sofia mark-grey-color animate animate_fade animate_btt animate_delay-10 mb-0">
                      {slide?.markup ?? ""}
                    </p>
                  </div>
                </div>
                <div className="slideshow-text container position-absolute start-50 top-50 translate-middle">
                  <h6 className="text_dash text-uppercase fs-base fw-medium animate animate_fade animate_btt animate_delay-3">
                    {slide.title}
                  </h6>
                  <h2 className="h1 text-capitalize fw-normal mb-0 animate animate_fade animate_btt animate_delay-5">
                    {slide.richText}
                  </h2>
                  <h2 className="h1 text-capitalize fw-bold animate animate_fade animate_btt animate_delay-5">
                    Dresses
                  </h2>

                  <Link
                    href={slide.link.title}
                    className="btn-link text-capitalize btn-link_lg default-underline fw-medium animate animate_fade animate_btt animate_delay-7"
                  >
                    {slide.link.title}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="container">
          <div className="slideshow-pagination slideshow-number-pagination d-flex align-items-center position-absolute bottom-0 mb-5"></div>
        </div>
      </section>
    </>
  );
}
