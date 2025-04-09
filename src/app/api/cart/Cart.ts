import { prisma } from "@/prisma";
import { Api } from "../routes";
import * as cookie from "react-cookie";

type cartType = {
  items: { key: string; productId: number; variantId: number; qty: number }[];
  couponApplied: boolean;
  couponCode?: string | null;
  couponDiscount?: number;
  subTotal: number;
  total: number;
};
export const addItemToCart = async (
  productId: number,
  variantId: number,
  qty: number
) => {
  const cookObj = new cookie.Cookies();

  const { data } = await Api.post("cart/add", {
    productId,
    variantId,
    qty,
  });

  if (data.success) {
    cookObj.set("cart", data.data.token, { path: "/" });
    return data.data;
  } else {
    throw new Error(data.data);
  }
};

export const updateItemQty = async (line: string, qty: number) => {
  const cookObj = new cookie.Cookies();

  const { data } = await Api.post("cart/update-qty/", { line, qty });
  if (data.success) {
    cookObj.set("cart", data.data.updatedCart.token, { path: "/" });
    return { success: true, data: data.data };
  } else {
    console.log(data);
    return { success: false, data: data.data };
  }
};

export const removeCartItem = async (line: string) => {
  const cookObj = new cookie.Cookies();

  const { data } = await Api.post("cart/remove/", { line });
  if (data.success) {
    cookObj.set("cart", data.data.token, { path: "/" });
    return { success: true, data: data.data };
  } else {
    return { success: false, data: data.data };
  }
};

export const MappingCartItems = async (cart: cartType) => {
  return await Promise.all(
    cart.items.map(async (item) => {
      const iteminfo = await prisma.product.findUnique({
        where: {
          id: item.productId,
        },
        select: {
          id: true,
          name: true,
          slug: true,
          SKU: true,
          price: true,
          images: true,
          quantity: true,
        },
      });
      const variant = await prisma.variants.findUnique({
        where: { id: item.variantId },
        omit: {
          createdAt: true,
          updatedAt: true,
          productId: true,
        },
      });
      return {
        key: item.key,
        productId: iteminfo?.id,
        SKU: variant ? variant.SKU : iteminfo?.SKU,
        name: iteminfo?.name,
        slug: iteminfo?.slug,
        price: variant ? variant.price : iteminfo?.price,
        image: variant
          ? variant.images?.split(",")[0]
          : iteminfo?.images?.split(",")[0],
        variant: variant,
        qty: item.qty,
        availableQty: variant ? variant.quantity : iteminfo?.quantity,
      };
    })
  );
};

export async function isCouponStillValid(cart: any) {
  ///// check is active  or expired
  const coupon = await prisma.coupon.findUnique({
    where: {
      code: cart.couponCode,
      active: true,
      expDate: { gt: new Date() },
      minOrderValue: { lte: cart.subTotal },
    },
  });
  return coupon;
}
