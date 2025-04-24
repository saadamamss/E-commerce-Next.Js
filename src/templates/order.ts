export default function OrderTemplateHTML(order: any) {
  return `
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <title>Order Tracking</title>
          <style>
          body,html{margin:0;padding:0;font-family:Arial,sans-serif;background-color:#f4f4f9}.email-container{max-width:600px;margin:0 auto;background-color:#fff;border-radius:8px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,.1)}.header,.tracking-button{background-color:#007bff;text-align:center}.header{color:#fff;padding:20px}.header h1{margin:0;font-size:24px;font-weight:700}.content{padding:20px;color:#333;line-height:1.6}.content p{margin:0 0 20px}.order-details{width:100%;border-collapse:collapse;margin-bottom:20px}.order-details td,.order-details th{padding:10px;text-align:left;border-bottom:1px solid #ddd}table p{margin:0}.order-details th{background-color:#f4f4f9;font-weight:700}.tracking-button{display:inline-block;padding:12px 24px;color:#fff!important;text-decoration:none;border-radius:4px;font-size:16px;font-weight:700}.footer{text-align:center;padding:20px;color:#888;font-size:12px;background-color:#f4f4f9}.footer a{color:#007bff;text-decoration:none}@media (max-width:600px){.email-container{border-radius:0}.header h1{font-size:20px}.tracking-button{width:100%;box-sizing:border-box}}
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="header">
              <h1>Your Order is ${order.status}!</h1>
            </div>

            <div class="content">
              <p>Hello ${order.name},</p>
              <p>${OrderStatusMessage(order.status, {
                trackingLink: order.trackingLink,
                deliveryDate: order.deliveryDate,
                rescheduleLink: order.rescheduleLink,
                reason: order.reason,
              })}</p>

              <table class="order-details">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  ${order.products.map(
                    (item: any) =>
                      `<tr>
                      <td>
                        <span>${item.name}</span>
                        <p>${item.specs}</p>
                      </td>
                      <td>${item.qty}</td>
                      <td>EGP${Number(item.price).toFixed(2)}</td>
                    </tr>`
                  )}
                </tbody>
                <tfoot>
                  <tr>
                    <td
                      colspan="2"
                      style="text-align: right, font-weight:bold"
                    >
                      subTotal:
                    </td>
                    <td>EGP${order.subTotal}</td>
                  </tr>

                  <tr>
                    <td
                      colspan="2"
                      style="text-align: right, font-weight:bold"
                    >
                      Discount:
                    </td>
                    <td>EGP${order.discount}</td>
                  </tr>

                  <tr>
                    <td
                      colspan="2"
                      style="text-align: right, font-weight:bold"
                    >
                      Total:
                    </td>
                    <td>EGP${order.totalPrice}</td>
                  </tr>
                </tfoot>
              </table>

              <p style="text-align: center">
                <a href="${order.trackingLink}" class="tracking-button">
                  Track Your Order
                </a>
              </p>

              <p>
                If the button doesn't work, copy and paste the following link
                into your browser:
              </p>
              <p style="word-break: break-all">${order.trackingLink}</p>

              <p>
                If you have any questions, feel free to contact our support
                team.
              </p>
            </div>

            <div class="footer">
              <p>&copy; 2023 Your Company. All rights reserved.</p>
              <p>
                <a href="${order.supportLink}">Contact Support</a>
              </p>
            </div>
          </div>
        </body>
      </html>`;
}

function OrderStatusMessage(status: string, options: any) {
  switch (status) {
    case "Order Placed":
      return "Thank you for your order! Your order has been placed successfully. We’ll notify you once it’s confirmed and ready for processing.";
    case "Order Confirmed":
      return "Great news! Your order has been confirmed and is being processed. We’ll notify you once it’s ready for shipment.";
    case "Order Processed":
      return "Your order has been processed and is being prepared for shipment. We’ll notify you once it’s on its way.";
    case "Shipped":
      return `Your order has been shipped! Track your package using this link: ${options.trackingLink}. Expected delivery date: ${options.deliveryDate}.`;
    case "Out for Delivery":
      return `Your order is out for delivery and will arrive soon. Track your package here: ${options.trackingLink}.`;
    case "Delivered":
      return "Your order has been delivered! We hope you love it. If you have any questions, feel free to contact us.";
    case "Delivery Attempted":
      return `We attempted to deliver your order, but you were unavailable. Please reschedule delivery here: ${options.rescheduleLink}.`;
    case "Returned to Sender":
      return "Your order could not be delivered and has been returned to the sender. Please contact us for further assistance.";
    case "Cancelled":
      return "Your order has been cancelled. If you have any questions, please contact us.";
    case "Refund Initiated":
      return "Your refund has been initiated. It may take 5-7 business days to process. If you have any questions, contact us.";
    case "Refund Completed":
      return "Your refund has been completed. The amount has been credited to your original payment method. Thank you for shopping with us!";
    case "On Hold":
      return `Your order is on hold due to ${options.reason}. Please check your email for further instructions or contact us.`;
    case "Delayed":
      return `We regret to inform you that your order is delayed due to ${options.reason}. We apologize for the inconvenience and will update you soon.`;
    case "Lost in Transit":
      return "We regret to inform you that your order has been lost in transit. We are investigating and will update you shortly. Please contact us for further assistance.";
    case "Damaged":
      return "We regret to inform you that your order has been damaged during transit. Please contact us for a replacement or refund.";
    default:
      return "We’re processing your order. Thank you for your patience!";
  }
}
