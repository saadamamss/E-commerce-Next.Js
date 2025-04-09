"use client";

import Image from "next/image";
import { useAppContext } from "../AppProvider";
import ItemQty from "./components/ItemQty";
import { useCallback } from "react";
import CartItemRemove from "./components/CartItemRemove";
import CouponForm from "./components/CouponForm";
import Link from "next/link";

function CartPage() {
  const { cart } = useAppContext();
  if (!cart) {
    return (
      <main className="pt-90">
        <div className="mb-4 pb-4"></div>
        <div className="container">
          <div className="flex justify-center items-center border-2 py-5 rounded-md">
            <div>
              <h2>Your cart is empty</h2>
              <br />
              <Link href="/shop" className="btn bg-black text-white">
                continue shopping
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  //
  const itemAttributes = useCallback((item: any): string[] => {
    const { id, SKU, price, images, quantity, ...rest } = item;
    Object.keys(rest).forEach((key) => {
      if (!rest[key]) delete rest[key];
    });

    return Object.keys(rest);
  }, []);

  return (
    <main className="pt-90">
      <div className="mb-4 pb-4"></div>
      <section className="shop-checkout container">
        <h3 className="page-title">Cart Details</h3>
        <div className="checkout-steps">
          <span className="checkout-steps__item active">
            <span className="checkout-steps__item-number">01</span>
            <span className="checkout-steps__item-title">
              <span>Shopping Bag</span>
              <em>Manage Your Items List</em>
            </span>
          </span>
          <span className="checkout-steps__item">
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

        <div className="shopping-cart">
          <div className="cart-table__wrapper">
            <table className="cart-table">
              <thead>
                <tr>
                  <th colSpan={2}>Product</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Subtotal</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {cart?.items.map((item) => (
                  <tr key={item.key} id={`line_item_${item.key}`}>
                    <td>
                      <div className="shopping-cart__product-item">
                        <Image
                          loading="lazy"
                          src={`/assets/images/products/${item.image}`}
                          width="120"
                          height="120"
                          alt=""
                        />
                      </div>
                    </td>
                    <td>
                      <div className="shopping-cart__product-item__detail">
                        <h4>{item.name}</h4>

                        <div className="text-slate-500">
                          {itemAttributes(item.variant)?.map((attr) => (
                            <span key={attr} className="d-block">
                              <strong>{attr}:</strong> {item.variant[attr]}
                            </span>
                          ))}
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="shopping-cart__product-price">
                        {Number(item.price)}
                      </span>
                    </td>

                    <td>
                      <ItemQty
                        quantity={item.qty}
                        line={item.key}
                        maxQty={item.variant.quantity}
                      />
                    </td>
                    <td>{Number(item.price * item.qty).toFixed(2)}</td>
                    <td>
                      <CartItemRemove line={item.key} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="cart-table-footer">
              <CouponForm />
            </div>
          </div>
          <div className="shopping-cart__totals-wrapper">
            <div className="sticky-content">
              <div className="shopping-cart__totals">
                <h3>Cart Totals</h3>
                <table className="cart-totals">
                  <tbody>
                    <tr>
                      <th>Estimated total</th>
                      <td>
                        <span className="shopping-cart__total">
                          EGP{cart.subTotal.toFixed(2)}
                        </span>
                      </td>
                    </tr>

                    {cart.couponApplied && (
                      <>
                        <tr>
                          <th>Coupon Discount</th>
                          <td>EGP{cart?.couponDiscount?.toFixed(2)}</td>
                        </tr>

                        <tr className="text-sky-600">
                          <th>Cart Total</th>
                          <td>EGP{cart.total.toFixed(2)}</td>
                        </tr>
                      </>
                    )}

                    <tr>
                      <td colSpan={2}>
                        Taxes, and shipping calculated at checkout.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="mobile_fixed-btn_wrapper">
                <div className="button-wrapper container">
                  <Link
                    href="/checkout"
                    className="btn btn-primary btn-checkout"
                  >
                    PROCEED TO CHECKOUT
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default CartPage;
