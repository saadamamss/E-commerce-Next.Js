"use client";
import CsrfToken from "@/components/csrf";
import { PlaceOrder } from "@/lib/actions/placeOrder";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";

const initialState = {
  errors: {},
  error: undefined,
  success: undefined,
};
export default function DetailsForm() {
  const [state, formAction, pending] = useActionState(PlaceOrder, initialState);

  const handlePlaceOrder = async (formData: FormData) => {
    try {
      formAction(formData);
    } catch (error) {}
  };
  const router = useRouter();
  useEffect(() => {
    if (state.success) {
      router.replace("/order-confirmation");
    }
  }, [state.success]);
  //
  return (
    <form name="checkout-form" action={handlePlaceOrder}>
      <CsrfToken />
      <div className="checkout-form flex-column">
        <div className="billing-info__wrapper">
          <div className="row">
            <div className="col-6">
              <h4>SHIPPING DETAILS</h4>
            </div>
            <div className="col-6"></div>
          </div>

          <div className="row mt-5">
            <div className="col-md-6">
              <div className="form-floating my-3">
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  defaultValue={"saad"}
                />
                <label htmlFor="name">Full Name *</label>
                <span className="text-red">
                  {state?.errors?.name?.map((err) => (
                    <span className="d-block" key={err}>
                      {err}
                    </span>
                  ))}
                </span>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-floating my-3">
                <input
                  type="tel"
                  className="form-control"
                  name="phone"
                  defaultValue={"01124547242"}
                />
                <label htmlFor="phone">Phone Number *</label>
                <span className="text-red">
                  {state?.errors?.phone?.map((err) => (
                    <span className="d-block" key={err}>
                      {err}
                    </span>
                  ))}
                </span>
              </div>
            </div>
            <div className="col-md-12">
              <div className="form-floating my-3">
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  defaultValue={""}
                />
                <label htmlFor="phone">Email *</label>
                <span className="text-red">
                  {state?.errors?.email?.map((err) => (
                    <span className="d-block" key={err}>
                      {err}
                    </span>
                  ))}
                </span>
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-floating my-3">
                <input
                  type="text"
                  className="form-control"
                  name="zipCode"
                  defaultValue={""}
                />
                <label htmlFor="zipCode">Pincode *</label>
                <span className="text-red">
                  {state?.errors?.zipCode?.map((err) => (
                    <span className="d-block" key={err}>
                      {err}
                    </span>
                  ))}
                </span>
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-floating mt-3 mb-3">
                <input
                  type="text"
                  className="form-control"
                  name="province"
                  defaultValue={""}
                />
                <label htmlFor="province">State *</label>
                <span className="text-red">
                  {state?.errors?.province?.map((err) => (
                    <span className="d-block" key={err}>
                      {err}
                    </span>
                  ))}
                </span>
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-floating my-3">
                <input
                  type="text"
                  className="form-control"
                  name="city"
                  defaultValue={""}
                />
                <label htmlFor="city">Town / City *</label>
                <span className="text-red">
                  {state?.errors?.city?.map((err) => (
                    <span className="d-block" key={err}>
                      {err}
                    </span>
                  ))}
                </span>
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-floating my-3">
                <input
                  type="text"
                  className="form-control"
                  name="country"
                  defaultValue={""}
                />
                <label htmlFor="country">Country *</label>
                <span className="text-red">
                  {state?.errors?.country?.map((err) => (
                    <span className="d-block" key={err}>
                      {err}
                    </span>
                  ))}
                </span>
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-floating my-3">
                <input
                  type="text"
                  className="form-control"
                  name="address_1"
                  defaultValue={""}
                />
                <label htmlFor="address_1">House no, Building Name *</label>
                <span className="text-red">
                  {state?.errors?.address_1?.map((err) => (
                    <span className="d-block" key={err}>
                      {err}
                    </span>
                  ))}
                </span>
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-floating my-3">
                <input
                  type="text"
                  className="form-control"
                  name="address_2"
                  defaultValue={""}
                />
                <label htmlFor="address_2">Road Name, Area, Colony *</label>
                <span className="text-red">
                  {state?.errors?.address_2?.map((err) => (
                    <span className="d-block" key={err}>
                      {err}
                    </span>
                  ))}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="checkout__totals-wrapper">
          <div className="checkout__payment-methods">
            <span className="text-red d-block mb-3">
              {state?.errors?.payment_method?.map((err) => (
                <span className="d-block" key={err}>
                  {err}
                </span>
              ))}
            </span>
            <div className="form-check">
              <input
                className="form-check-input form-check-input_fill"
                type="radio"
                name="payment_method"
                id="checkout_payment_method_1"
                defaultValue={"DBT"}
                defaultChecked
              />
              <label
                className="form-check-label"
                htmlFor="checkout_payment_method_1"
              >
                Direct bank transfer
                <p className="option-detail">
                  Make your payment directly into our bank account. Please use
                  your Order ID as the payment reference.Your order will not be
                  shipped until the funds have cleared in our account.
                </p>
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input form-check-input_fill"
                type="radio"
                name="payment_method"
                id="checkout_payment_method_3"
                defaultValue={"COD"}
              />
              <label
                className="form-check-label"
                htmlFor="checkout_payment_method_3"
              >
                Cash on delivery
                <p className="option-detail">
                  Phasellus sed volutpat orci. Fusce eget lore mauris vehicula
                  elementum gravida nec dui. Aenean aliquam varius ipsum, non
                  ultricies tellus sodales eu. Donec dignissim viverra nunc, ut
                  aliquet magna posuere eget.
                </p>
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input form-check-input_fill"
                type="radio"
                name="payment_method"
                id="checkout_payment_method_4"
                defaultValue={"PAYPAL"}
              />
              <label
                className="form-check-label"
                htmlFor="checkout_payment_method_4"
              >
                Paypal
                <div className="option-detail">
                  <p>
                    Phasellus sed volutpat orci. Fusce eget lore mauris vehicula
                    elementum gravida nec dui. Aenean aliquam varius ipsum, non
                    ultricies tellus sodales eu. Donec dignissim viverra nunc,
                    ut aliquet magna posuere eget.
                  </p>
                  <br />
                  {/* <PaymentSection /> */}
                </div>
              </label>
            </div>
            <div className="policy-text">
              Your personal data will be used to process your order, support
              your experience throughout this website, and for other purposes
              described in our{" "}
              <a href="terms.html" target="_blank">
                privacy policy
              </a>
              .
            </div>
            <br />
            <p aria-live="polite">{state?.error}</p>
            <button className="btn btn-primary btn-checkout">
              {pending ? "Loading..." : "PLACE ORDER"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
