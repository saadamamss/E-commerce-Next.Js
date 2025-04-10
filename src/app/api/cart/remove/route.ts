import { cookies } from "next/headers";
import { isCouponStillValid } from "@/lib/models/Cart";
import jwt from "jsonwebtoken";
import { prisma } from "@/prisma";
import { ApiLimiter } from "@/lib/models/Api";

type CartItem = {
  key: string;
  productId: number;
  variantId: number;
  qty: number;
};

type CartType = {
  items: CartItem[];
  couponApplied: boolean;
  couponCode?: string | null;
  couponDiscount?: number;
  subTotal: number;
  total: number;
};
const getRemovedItemPrice = async (item: CartItem) => {
  if (item.variantId) {
    const variant = await prisma.variants.findUnique({
      where: { id: item.variantId },
      select: {
        price: true,
      },
    });
    return Number(variant?.price);
  } else {
    const product = await prisma.product.findUnique({
      where: { id: item.productId },
      select: {
        price: true,
      },
    });
    return Number(product?.price);
  }
};

export async function POST(request: Request) {
  const access = await ApiLimiter(request);

  if (!access) {
    return Response.json({ error: "Too many requests" }, { status: 429 });
  }

  const cartToken = (await cookies()).get("cart")?.value as string;
  const data = await request.json();
  const SECRET = process.env.JWT_SECRET as string;

  try {
    const cartdecoded = jwt.verify(cartToken, SECRET) as jwt.JwtPayload &
      CartType;
    const removedItem = cartdecoded?.items.find(
      (item: { key: string }) => item.key == data.line
    );

    if (!removedItem) {
      throw new Error("");
    }

    const itemPrice = await getRemovedItemPrice(removedItem);
    cartdecoded.items = cartdecoded?.items.filter(
      (item: { key: string }) => item.key !== data.line
    );

    cartdecoded.subTotal -= itemPrice * removedItem.qty;
    cartdecoded.total = cartdecoded.subTotal;
    //
    if (cartdecoded.couponApplied) {
      const coupon = await isCouponStillValid(cartdecoded);
      if (coupon) {
        cartdecoded.couponDiscount =
          coupon.type === "fixed"
            ? -coupon?.value
            : -(Number(coupon.value) * cartdecoded.subTotal) / 100;
      } else {
        cartdecoded.couponApplied = false;
        cartdecoded.couponCode = null;
        cartdecoded.couponDiscount = 0;
      }
      cartdecoded.total = cartdecoded.subTotal + cartdecoded.couponDiscount;
    }

    cartdecoded.token = jwt.sign(cartdecoded, SECRET);

    const updatedCart = JSON.parse(JSON.stringify(cartdecoded));
    delete updatedCart.items;

    return Response.json({ success: true, data: updatedCart });
  } catch (error) {
    error = "somthing went wrong";
    return Response.json({ success: false, data: error });
  }
}
