import { Api } from "@/lib/models/Api";
import { prisma } from "@/prisma";
import jwt from "jsonwebtoken";
//
import * as cookie from "react-cookie";
import getCookies from "../helpers/getCookie";

type cartType = {
  items: { key: string; productId: number; variantId: number; qty: number }[];
  couponApplied: boolean;
  couponCode?: string | null;
  couponDiscount?: number;
  subTotal: number;
  total: number;
};

// =============================================================================
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

// =============================================================================

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

// =============================================================================

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

// =============================================================================

export const MappingCartItems = async (cart: cartType) => {
  if (!cart.items.length) return [];

  const items = await Promise.all(
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
      if (!iteminfo) return null;
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
        productId: iteminfo.id,
        SKU: variant ? variant.SKU : iteminfo.SKU,
        name: iteminfo.name,
        slug: iteminfo.slug,
        price: variant ? variant.price : iteminfo?.price,
        image: variant
          ? variant.images?.split(",")[0]
          : iteminfo.images?.split(",")[0],
        variantId: variant?.id,
        specs: variant ? itemAttributes(variant) : null,
        qty: item.qty,
        availableQty: variant ? variant.quantity : iteminfo.quantity,
      };
    })
  );

  return items.filter((i) => i !== null);
};

const itemAttributes = (item: any) => {
  const { id, SKU, price, images, quantity, ...rest } = item;
  Object.keys(rest).forEach((key) => {
    if (!rest[key]) delete rest[key];
  });

  return Object.keys(rest).length ? rest : null;
};

// =============================================================================

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

// ==================================================
export async function getCart() {
  const cartToken = (await getCookies()).get("cart")?.value as string;

  const cart = await new Promise<string | null>((resolve) => {
    jwt.verify(
      cartToken,
      process.env.JWT_SECRET as string,
      async (err, decode) => {
        if (!err) {
          const cartData = decode as jwt.JwtPayload & cartType;
          const items = await MappingCartItems(cartData);

          resolve(JSON.stringify({ ...cartData, items }));
        }
        resolve(null);
      }
    );
  });

  return cart;
}
