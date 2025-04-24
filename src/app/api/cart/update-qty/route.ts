import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { prisma } from "@/prisma";
import { isCouponStillValid } from "@/lib/models/Cart";
import { ApiLimiter } from "@/lib/models/Api";

//
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
const getupdatedItemPrice = async (item: CartItem) => {
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
  const SECRET = process.env.JWT_SECRET as string;
  const cartToken = (await cookies()).get("cart")?.value as string;
  const data = await request.json();

  try {
    // decode cart from token
    const cartdecoded = jwt.verify(cartToken, SECRET) as jwt.JwtPayload &
      CartType;

    const updatedCart = {} as { [key: string]: any };
    //
    const itemupdate = cartdecoded?.items.find(
      (item: { key: string }) => item.key === data.line
    );

    if (!itemupdate) {
      throw new Error("");
    }

    updatedCart.subTotal = cartdecoded.subTotal;
    // get item price from database and minus its value form total
    const itemprice = await getupdatedItemPrice(itemupdate);
    updatedCart.subTotal -= itemupdate.qty * itemprice;

    // set new qty and price
    itemupdate.qty = data.qty;
    updatedCart.subTotal += itemprice * itemupdate.qty;
    //
    updatedCart.total = updatedCart.subTotal;
    //  check if coupon applied

    if (cartdecoded.couponApplied) {
      const coupon = await isCouponStillValid(cartdecoded);
      if (coupon) {
        updatedCart.couponApplied = true;
        updatedCart.couponCode = coupon.code;
        updatedCart.couponDiscount =
          coupon.type === "fixed"
            ? -coupon?.value
            : -(Number(coupon.value) * Number(updatedCart.subTotal)) / 100;
      } else {
        updatedCart.couponApplied = false;
        updatedCart.couponCode = null;
        updatedCart.couponDiscount = 0;
      }
      updatedCart.total = updatedCart.subTotal + updatedCart.couponDiscount;
    }

    updatedCart.token = jwt.sign({ ...cartdecoded, ...updatedCart }, SECRET);
    //

    return Response.json({
      success: true,
      data: { item: itemupdate, updatedCart },
    });
  } catch (error) {
    console.log(error);

    return Response.json({
      success: false,
      data: "Something went wrong",
    });
  }
}
