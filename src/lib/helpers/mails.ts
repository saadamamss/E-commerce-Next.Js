import nodemailer from "nodemailer";

import handlebars from "handlebars";
import fs from "fs";
import path from "path";
// Read the template file

var transporter = nodemailer.createTransport({
  service: "gmail",
  host: process.env.MAIL_HOST,
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export async function sendVerificationEmail(email: string, token: string) {
  const data = {
    name: email,
    verificationLink: `http://localhost:3000/verify-email?token=${token}`,
    supportLink: "https://example.com/support",
  };

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Verify your email",
    html: HTML_Template("verification-email", data),
  });
}

export async function sendResetPasswordEmail(email: string, token: string) {
  const data = {
    name: email,
    resetLink: `http://localhost:3000/reset-password?token=${token}`,
    expirationTime: 24, // Link expiration time in hours
    supportLink: "https://example.com/support",
  };

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Reset Your Password",
    html: HTML_Template("password-reset", data),
  });
}

export async function sendOrderTracking(email: string, order: any) {
  const data = {
    name: order.name,
    orderId: order.id,
    products: order.orderitems.map((item) => ({
      name: item.product.name,
      qty: item.qty,
      variant: item.varinat,
    })),
    status: order.status,
    subTotal: order.subTotal,
    totalPrice: order.total,
    discount: order.discount,
    deliveryDate: new Date().toDateString(),
    reason: "",
    trackingLink: "http://localhost:3000/dashboard/orders/" + order.id,
    supportLink: "https://example.com/support",
  };

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Tracking Your Order",
    html: HTML_Template("order", data),
  });
}

function HTML_Template(htmltemp: string, data: any) {
  const templatePath = path.join("src/handlebars", `${htmltemp}.handlebars`);
  const source = fs.readFileSync(templatePath, "utf8");
  // Compile the template
  const template = handlebars.compile(source);

  // Render the template with data
  return template(data);
}

// Register the custom helper
handlebars.registerHelper("orderStatusMessage", function (status, options) {
  switch (status) {
    case "Order Placed":
      return "Thank you for your order! Your order has been placed successfully. We’ll notify you once it’s confirmed and ready for processing.";
    case "Order Confirmed":
      return "Great news! Your order has been confirmed and is being processed. We’ll notify you once it’s ready for shipment.";
    case "Order Processed":
      return "Your order has been processed and is being prepared for shipment. We’ll notify you once it’s on its way.";
    case "Shipped":
      return `Your order has been shipped! Track your package using this link: ${options.hash.trackingLink}. Expected delivery date: ${options.hash.deliveryDate}.`;
    case "Out for Delivery":
      return `Your order is out for delivery and will arrive soon. Track your package here: ${options.hash.trackingLink}.`;
    case "Delivered":
      return "Your order has been delivered! We hope you love it. If you have any questions, feel free to contact us.";
    case "Delivery Attempted":
      return `We attempted to deliver your order, but you were unavailable. Please reschedule delivery here: ${options.hash.rescheduleLink}.`;
    case "Returned to Sender":
      return "Your order could not be delivered and has been returned to the sender. Please contact us for further assistance.";
    case "Cancelled":
      return "Your order has been cancelled. If you have any questions, please contact us.";
    case "Refund Initiated":
      return "Your refund has been initiated. It may take 5-7 business days to process. If you have any questions, contact us.";
    case "Refund Completed":
      return "Your refund has been completed. The amount has been credited to your original payment method. Thank you for shopping with us!";
    case "On Hold":
      return `Your order is on hold due to ${options.hash.reason}. Please check your email for further instructions or contact us.`;
    case "Delayed":
      return `We regret to inform you that your order is delayed due to ${options.hash.reason}. We apologize for the inconvenience and will update you soon.`;
    case "Lost in Transit":
      return "We regret to inform you that your order has been lost in transit. We are investigating and will update you shortly. Please contact us for further assistance.";
    case "Damaged":
      return "We regret to inform you that your order has been damaged during transit. Please contact us for a replacement or refund.";
    default:
      return "We’re processing your order. Thank you for your patience!";
  }
});
