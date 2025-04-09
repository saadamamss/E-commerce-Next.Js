"use client";

import { useEffect, useState, memo, useActionState } from "react";
import { ApplyCoupon } from "../../../lib/actions/couponaction";
import { useCookies } from "react-cookie";
import { useAppContext } from "../../AppProvider";
import CsrfToken from "@/components/csrf";

const initialState = {
  error: "",
  success: undefined,
  data: undefined,
};
const CouponForm = memo(function CouponForm() {
  const { cart, setCart } = useAppContext();
  if (!cart || cart.couponApplied) return null;

  const setCookie = useCookies(["cart"])[1];
  const [state, formAction, pending] = useActionState(
    ApplyCoupon,
    initialState
  );

  useEffect(() => {
    if (state.success) {
      const updated = { ...cart, ...state.data };
      setCart(updated);
      setCookie("cart", state.data.token);
    }
  }, [state.success]);

  //
  const applycoupon = (formdata: FormData) => {
    formAction(formdata);
  };

  return (
    <div>
      {state.error && (
        <div className="text-red py-2 block m-0">{state.error}</div>
      )}

      <form action={applycoupon} className="position-relative bg-body">
        <CsrfToken />
        <input
          className="form-control"
          type="text"
          name="coupon_code"
          placeholder="Coupon Code"
          required
        />
        <input
          className="btn-link fw-medium position-absolute top-0 end-0 h-100 px-4"
          type="submit"
          value={pending ? "APPLYING..." : "APPLY COUPON"}
          disabled={pending}
        />
      </form>
    </div>
  );
});

export default CouponForm;
