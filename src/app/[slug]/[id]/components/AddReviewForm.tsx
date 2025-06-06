"use client";

import { useAppContext } from "@/app/AppProvider";
import { AddReview } from "@/lib/actions/AddReview";
import { useActionState, useEffect, useState } from "react";

const initialstate = {
  errors: {},
  error: undefined,
  success: undefined,
  data: undefined,
};
export default function AddReviewForm({ id }: { id: number }) {
  const [review, setReview] = useState("");
  const [rate, setRate] = useState(0);
  const { dispatchReviewsList } = useAppContext();
  const [state, formAction, pending] = useActionState(AddReview, initialstate);

  function handleAddreviewAction(formData: FormData) {
    try {
      formAction(formData);
    } catch (error) {}
  }
  // 
  useEffect(() => {
    if (state.success) {
      dispatchReviewsList({ type: "ADD_TO_LIST", payload: { review: state.data } });
    }
  }, [state?.success]);

  return (
    <>
      {
        <div className="product-single__review-form">
          <form name="customer-review-form" action={handleAddreviewAction}>
            <input type="hidden" name="productId" value={id} />
            <div className="select-star-rating">
              <label>Your rating *</label>
              <span className="star-rating flex flex-row justify-start">
                {[1, 2, 3, 4, 5].map((item) => (
                  <span
                    className={`star ${item <= rate ? "selected" : ""}`}
                    key={item}
                    onClick={() => setRate(item)}
                  >
                    <svg
                      className="star-icon"
                      width="24"
                      height="24"
                      fill="#ccc"
                      viewBox="0 0 12 12"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M11.1429 5.04687C11.1429 4.84598 10.9286 4.76562 10.7679 4.73884L7.40625 4.25L5.89955 1.20312C5.83929 1.07589 5.72545 0.928571 5.57143 0.928571C5.41741 0.928571 5.30357 1.07589 5.2433 1.20312L3.73661 4.25L0.375 4.73884C0.207589 4.76562 0 4.84598 0 5.04687C0 5.16741 0.0870536 5.28125 0.167411 5.3683L2.60491 7.73884L2.02902 11.0871C2.02232 11.1339 2.01563 11.1741 2.01563 11.221C2.01563 11.3951 2.10268 11.5558 2.29688 11.5558C2.39063 11.5558 2.47768 11.5223 2.56473 11.4754L5.57143 9.89509L8.57813 11.4754C8.65848 11.5223 8.75223 11.5558 8.84598 11.5558C9.04018 11.5558 9.12054 11.3951 9.12054 11.221C9.12054 11.1741 9.12054 11.1339 9.11384 11.0871L8.53795 7.73884L10.9688 5.3683C11.0558 5.28125 11.1429 5.16741 11.1429 5.04687Z" />
                    </svg>
                  </span>
                ))}
              </span>
            </div>
            <input
              type="hidden"
              id="form-input-rating"
              name="rate"
              value={rate}
            />
            <div className="mb-4">
              <textarea
                id="form-input-review"
                className="form-control form-control_gray"
                placeholder="Your Review"
                name="review"
                cols={30}
                rows={8}
                onChange={(e) => setReview(e.target.value)}
              ></textarea>
            </div>

            <div className="form-action">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={pending}
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      }
    </>
  );
}
