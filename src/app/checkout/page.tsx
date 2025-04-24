"use client";
import DetailsForm from "./components/DetailsForm";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAppContext } from "../AppProvider";
import { useCallback } from "react";

export default function CheckoutPage() {
  const { cart } = useAppContext();
  const router = useRouter();
  if (!cart) router.replace("/sign-in", { scroll: true });



  return (
    <main className="pt-90">
      <div className="mb-4 pb-4"></div>
      <section className="shop-checkout container">
        <h2 className="page-title">Shipping and Checkout</h2>
        <div className="checkout-steps">
          <span className="checkout-steps__item active">
            <span className="checkout-steps__item-number">01</span>
            <span className="checkout-steps__item-title">
              <span>Shopping Bag</span>
              <em>Manage Your Items List</em>
            </span>
          </span>
          <span className="checkout-steps__item active">
            <span className="checkout-steps__item-number">02</span>
            <span className="checkout-steps__item-title">
              <span>Shipping and Checkout</span>
              <em>Checkout Your Items List</em>
            </span>
          </span>
          <span className="checkout-steps__item">
            <span className="checkout-steps__item-number">03</span>
            <span className="checkout-steps__item-title">
              <span>Confirmation</span>
              <em>Review And Submit Your Order</em>
            </span>
          </span>
        </div>

        <div className="row">
          <div className="col-md-8">
            <DetailsForm />
          </div>

          <div className="col-md-4">
            <div className="checkout__totals-wrapper py-5 sticky-content">
              <div className="checkout__totals">
                <h3>Your Order</h3>
                <table className="checkout-cart-items">
                  <thead>
                    <tr>
                      <th colSpan={2}>PRODUCTS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cart?.items.map((item) => (
                      <tr key={item.key}>
                        <td colSpan={2}>
                          <div className="flex flex-row gap-2">
                            <div>
                              <Image
                                src={`/assets/images/products/${item.image}`}
                                width={100}
                                height={100}
                                alt=""
                              />
                            </div>
                            <div>
                              <span>
                                {item.name} (x{item.qty})
                              </span>
                              <div className="text-slate-500">
                                {item.specs && (
                                  <div className="text-slate-500">
                                    {Object.keys(item.specs)?.map((attr) => (
                                      <span key={attr} className="d-block">
                                        <strong>{attr}:</strong>{" "}
                                        {item.specs[attr]}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                              <span className="d-block text-red font-bold">
                                EGP{item.qty * item.price}
                              </span>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <table className="checkout-totals">
                  <tbody>
                    <tr>
                      <th>SUBTOTAL</th>
                      <td align="right">EGP{cart?.total}</td>
                    </tr>
                    <tr>
                      <th>SHIPPING</th>
                      <td align="right">Free shipping</td>
                    </tr>
                    {cart?.couponApplied && (
                      <tr>
                        <th>Discount</th>
                        <td align="right">EGP{cart?.couponDiscount}</td>
                      </tr>
                    )}
                    <tr>
                      <th>
                        <span className="font-bold text-lg">TOTAL</span>
                      </th>
                      <td align="right">
                        <span className="font-bold text-lg text-red">
                          EGP
                          {cart?.couponDiscount
                            ? cart?.total + cart?.couponDiscount
                            : cart?.total}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
