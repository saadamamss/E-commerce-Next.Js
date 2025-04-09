import { cookies } from "next/headers";
import jwt, { JwtPayload } from "jsonwebtoken";
import { isCouponStillValid, MappingCartItems } from "../Cart";
import { ApiLimiter } from "../../routes";

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

const generateRandomKey = (): string =>
  Math.floor(Math.random() * 1000000 + 1).toString(16);

const createNewCart = (data: {
  productId: number;
  variantId: number;
  qty: number;
}): CartType => ({
  items: [
    {
      key: generateRandomKey(),
      productId: data.productId,
      variantId: data.variantId,
      qty: data.qty,
    },
  ],
  couponApplied: false,
  couponCode: undefined,
  couponDiscount: 0,
  subTotal: 0,
  total: 0,
});

const calculateSubtotal = async (items: any[]) =>
  items.reduce(
    (total, item) => total + Number(item.price) * Number(item.qty),
    0
  );

const applyCouponDiscount = async (
  cart: CartType,
  subtotal: number
): Promise<void> => {
  if (!cart.couponApplied) return;

  const coupon = await isCouponStillValid(cart);
  if (coupon) {
    cart.couponDiscount =
      coupon.type === "fixed"
        ? -coupon.value
        : -(Number(coupon.value) * subtotal) / 100;
  } else {
    cart.couponApplied = false;
    cart.couponCode = null;
    cart.couponDiscount = 0;
  }
};

export async function POST(request: Request) {
  const access = await ApiLimiter(request);
  if (!access) {
    return Response.json({ error: "Too many requests" }, { status: 429 });
  }

  const SECRET = process.env.JWT_SECRET as string;
  const data = await request.json();
  const cartToken = (await cookies()).get("cart")?.value;

  try {
    const cart = await new Promise<CartType>((resolve) => {
      if (!cartToken) {
        resolve(createNewCart(data));
        return;
      }

      jwt.verify(cartToken, SECRET, (err, decoded) => {
        if (err) {
          resolve(createNewCart(data));
          return;
        }

        const cartData = decoded as JwtPayload & CartType;
        const existingItem = cartData.items.find(
          (item: CartItem) =>
            item.productId === data.productId &&
            item.variantId === data.variantId
        );

        if (existingItem) {
          existingItem.qty += data.qty;
        } else {
          cartData.items.push({
            key: generateRandomKey(),
            productId: data.productId,
            variantId: data.variantId,
            qty: data.qty,
          });
        }

        resolve(cartData);
      });
    });

    const mappedItems = await MappingCartItems(cart);
    const subtotal = await calculateSubtotal(mappedItems);

    cart.subTotal = subtotal;
    cart.total = subtotal + (cart.couponDiscount || 0);

    await applyCouponDiscount(cart, subtotal);

    const responseData = {
      items: mappedItems,
      couponApplied: cart.couponApplied,
      couponCode: cart.couponCode,
      couponDiscount: cart.couponDiscount,
      subTotal: cart.subTotal,
      total: cart.total,
      token: jwt.sign(cart, SECRET),
    };

    return Response.json({ success: true, data: responseData });
  } catch (error) {
    console.error("Cart processing error:", error);
    return Response.json({
      success: false,
      data: "Something went wrong",
    });
  }
}

/*
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { isCouponStillValid, MappingCartItems } from "../Cart";
import { ApiLimiter } from "../../routes";
type cartType = {
  items: { key: string; productId: number; variantId: number; qty: number }[];
  couponApplied: boolean;
  couponCode?: string | null;
  couponDiscount?: number;
  subTotal: number;
  total: number;
};
export async function POST(request: Request) {
  const access = await ApiLimiter(request);
  
  if (!access) {
    return Response.json({ error: "Too many requests" }, { status: 429 });
  }

  // 
  const SECRET = process.env.JWT_SECRET as string;
  const data = await request.json();
  const cartToken = (await cookies()).get("cart")?.value as string;
  try {
    const cart = await new Promise<cartType>((resolve) => {
      jwt.verify(cartToken, SECRET, (err, decode) => {
        if (!err) {
          const newdecode = decode as jwt.JwtPayload;
          const exist = newdecode?.items.find(
            (i: { productId: string; variantId: string }) =>
              i.productId == data.productId && i.variantId == data.variantId
          );
          if (exist) {
            exist.qty += data.qty;
          } else {
            newdecode?.items.push({
              key: Math.floor((Math.random()*1000000)+1).toString(16),
              productId: data.productId,
              variantId: data.variantId,
              qty: data.qty,
            });
          }
          resolve(newdecode as cartType);
        } else {
          resolve({
            items: [
              {
                key: Math.floor((Math.random()*1000000)+1).toString(16),
                productId: data.productId,
                variantId: data.variantId,
                qty: data.qty,
              },
            ],
            couponApplied: false,
            couponCode: undefined,
            couponDiscount: 0,
            subTotal: 0,
            total: 0,
          });
        }
      });
    });

    const mapped = await MappingCartItems(cart);
    const subtotalPrice = mapped.reduce((total, item) => {
      return total + Number(item.price) * Number(item.qty);
    }, 0);
    cart.subTotal = subtotalPrice;
    cart.total = subtotalPrice;
    if (cart.couponDiscount) {
      cart.total += cart.couponDiscount;
    }
    if (cart.couponApplied) {
      const coupon = await isCouponStillValid(cart);
      if (coupon) {
        cart.couponDiscount =
          coupon.type === "fixed"
            ? -coupon?.value
            : -(Number(coupon.value) * subtotalPrice) / 100;
      } else {
        cart.couponApplied = false;
        cart.couponCode = null;
        cart.couponDiscount = 0;
      }
    }

    const clearedCart = {
      items: mapped,
      couponApplied: cart.couponApplied,
      couponCode: cart.couponCode,
      couponDiscount: cart.couponDiscount,
      subTotal: cart.subTotal,
      total: cart.total,
      token: jwt.sign(cart, SECRET),
    };

    return Response.json({ success: true, data: clearedCart });
  } catch (error) {
    error = "somthing went wrong";
    return Response.json({ success: false, data: error });
  }
}
*/
