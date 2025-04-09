import CardSection from "./sections/CardsSection";
import CarouselSection from "./sections/Carousel";
import ProdSliderWPCard from "./sections/ProdSliderWPCard";
import ProductsCollection from "./sections/ProductCollection";
import PromoSlider from "./sections/PromoSlider";

export default async function Section({
  section,
  data,
}: {
  section: string;
  data: string;
}) {
  switch (section) {
    case "collection_slider":
      return (
        <>
          <ProdSliderWPCard data={data} />
          <div className="py-4 w-full clear-fix d-block"></div>
        </>
      );

    case "slide_show":
      return (
        <>
          <CarouselSection data={data} />
          <div className="py-4 w-full clear-fix d-block"></div>
        </>
      );
    case "promo_slider":
      return (
        <>
          <PromoSlider data={data} />
          <div className="py-4 w-full clear-fix d-block"></div>
        </>
      );
    case "promo_card":
      return (
        <>
          <CardSection data={data} />
          <div className="py-4 w-full clear-fix d-block"></div>
        </>
      );
    case "product_collection":
      return (
        <>
          <ProductsCollection data={data} />
          <div className="py-4 w-full clear-fix d-block"></div>
        </>
      );

    default:
      return <></>;
  }
}
