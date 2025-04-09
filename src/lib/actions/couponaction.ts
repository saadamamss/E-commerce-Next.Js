"use server";

import { prisma } from "@/prisma";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
export async function ApplyCoupon(prev: any, formdata: FormData) {
  const SECRET = process.env.JWT_SECRET as string;
  const cartToken = (await cookies()).get("cart")?.value as string;
  const coupon_code = formdata.get("coupon_code") as string;

  if (!coupon_code) {
    return { error: "coupon code is required" };
  }
  const coupon = await prisma.coupon.findUnique({
    where: {
      code: coupon_code,
      active: true,
    },
  });
  if (!coupon) {
    return { error: "coupon code is invalid" };
  }
  if (coupon.expDate < new Date()) {
    return { error: "coupon code is expired" };
  }

  try {
    const cartdecoded = jwt.verify(cartToken, SECRET) as jwt.JwtPayload;

    if (cartdecoded?.total < Number(coupon.minOrderValue)) {
      return { error: `increase the order value to ${coupon.minOrderValue}` };
    }

    const updatedCart = {} as { [key: string]: any };
    updatedCart.couponApplied = true;
    updatedCart.couponCode = coupon.code;
    updatedCart.couponDiscount =
      coupon.type === "fixed"
        ? -coupon?.value
        : -(Number(coupon.value) * Number(cartdecoded.subTotal)) / 100;

    updatedCart.total = cartdecoded.subTotal + updatedCart.couponDiscount;
    updatedCart.token = jwt.sign({ ...cartdecoded, ...updatedCart }, SECRET);
    

    return {
      success: true,
      data: updatedCart,
    };

  } catch (error) {
    return { error: "Failed to apply coupon!, Please try again." };
  }
}
