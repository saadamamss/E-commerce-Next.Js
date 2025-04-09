"use client";
import { cancleOrder } from "@/lib/actions/cancelorder";
import { memo, useActionState } from "react";
const initial = {
  error: undefined,
  success: false,
  msg: "",
};
export default memo(function CancelOrderForm({ orderId }: { orderId: number }) {
  const [state, formAction, pending] = useActionState(cancleOrder, initial);

  return state.success ? (
    <p className="text-red text-left mb-0">This Order Canceled!</p>
  ) : (
    <form action={formAction}>
      <input type="hidden" name="orderId" value={orderId} />

      <button type="submit" className="btn btn-danger" disabled={pending}>
        {pending ? "Canceling..." : "Cancel Order"}
      </button>
    </form>
  );
});
