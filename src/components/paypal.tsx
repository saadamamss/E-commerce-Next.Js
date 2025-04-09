"use client";
import { memo, useEffect } from "react";

export default memo(function PaymentSection() {
  useEffect(() => {
    // Load the PayPal SDK script
    window.paypal
      .Buttons({
        createOrder: (data, actions) => {
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  currencyCode: "EUR",
                  value: "10",
                  breakdown: {
                    itemTotal: {
                      currencyCode: "EUR",
                      value: "10",
                    },
                  },
                },
              },
            ],
          });
        },
        onApprove: (data, actions) => {
          return actions.order.capture().then((details) => {
            alert(`Payment completed by ${details.payer.name.given_name}`);
          });
        },

        onError: (err) => {
          console.error("Payment error:", err);
        },
      })
      .render("#paypal-button-container");
  }, []);

  return (
    <div>
      <div id="paypal-button-container"></div>
      <p id="result-message"></p>
    </div>
  );
});
