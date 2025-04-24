import nodemailer from "nodemailer";
import OrderTemplateHTML from "@/templates/order";
import PasswordResetHTML from "@/templates/password-reset";
import VerficationEmailHTML from "@/templates/verification-email";
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
    html: VerficationEmailHTML(data),
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
    html: PasswordResetHTML(data),
  });
}

export async function sendOrderTracking(email: string, order: any) {
  const data = {
    name: order.name,
    orderId: order.id,
    products: order.orderitems.map((item: any) => ({
      name: item.product.name,
      qty: item.qty,
      price: item.price,
      specs: Object.values(item.specs).join(","),
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
    html: OrderTemplateHTML(data),
  });
}