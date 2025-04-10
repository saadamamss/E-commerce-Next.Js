"use client";
import { useAppContext } from "@/app/AppProvider";
import Image from "next/image";
import { memo, useEffect, useMemo } from "react";

export default memo(function ReviewsListComponent({
  reviews,
}: {
  reviews: string;
}) {
  const parseReviews = useMemo(() => JSON.parse(reviews), []);
  const { ReviewsList, dispatchReviewsList } = useAppContext();

  useEffect(() => {
    dispatchReviewsList({ type: "SET_LIST", payload: { review: parseReviews } });
  }, []);
  return (
    <>
      {ReviewsList.map((review) => (
        <div className="product-single__reviews-item" key={review.id}>
          <div className="customer-avatar">
            <Image
              loading="lazy"
              src="/assets/images/avatar.jpg"
              alt=""
              width={50}
              height={50}
            />
          </div>
          <div className="customer-review w-full">
            <div className="customer-name w-full">
              <h6>{review.user?.name}</h6>
              <div className="reviews-group d-flex">
                <div
                  className="star-rate"
                  style={
                    {
                      "--i": `${Math.ceil((parseInt(review.rate) / 5) * 100)}%`,
                    } as React.CSSProperties
                  }
                ></div>
              </div>
            </div>
            <div className="review-date">
              {new Date(review?.createdAt as Date).toDateString()}
            </div>
            <div className="review-text">
              <p>{review.review}</p>
            </div>
          </div>
        </div>
      ))}
    </>
  );
});
