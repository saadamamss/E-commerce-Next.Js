import Image from "next/image";
import Link from "next/link";

export default function CardSection({ data }: { data: string }) {
  const parsedData = JSON.parse(data);
  return (
    <section className="category-banner container">
      <div className="row">
        {parsedData.map(
          (
            item: {
              image: string;
              title: string;
              badge: string | null;
              link: { title: string; url: string };
            },
            index: number
          ) => (
            <div className="col-md-6" key={index}>
              <div className="category-banner__item border-radius-10 mb-5">
                <Image
                  loading="lazy"
                  className="h-auto"
                  src={`/assets/images/home/demo3/${item.image}`}
                  width="690"
                  height="665"
                  alt=""
                />
                {item.badge && (
                  <div className="category-banner__item-mark">{item.badge}</div>
                )}

                <div className="category-banner__item-content">
                  <h3 className="mb-0 text-capitalize">{item.title}</h3>
                  <Link
                    href={item.link.url}
                    className="btn-link text-capitalize default-underline text-uppercase fw-medium"
                  >
                    {item.link.title}
                  </Link>
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </section>
  );
}
