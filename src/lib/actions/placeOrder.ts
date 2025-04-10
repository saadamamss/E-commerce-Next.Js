"use server";

import { cookies } from "next/headers";
import { z } from "zod";
import jwt from "jsonwebtoken";
import { prisma } from "@/prisma";
import { auth } from "@/auth";
import { sendOrderTracking } from "../helpers/mails";
import { verifyCsrfToken } from "../utils/csrfVerify";

// Define the schema for form validation
const orderSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email({ message: "Invalid email" }),
  phone: z.string({ required_error: "Phone is required" }),
  name: z
    .string({ required_error: "Name is required" })
    .max(50, { message: "Name must be 50 characters or fewer" }),
  country: z.string({ required_error: "Country is required" }),
  city: z.string({ required_error: "City is required" }),
  province: z.string({ required_error: "Province is required" }),
  address_1: z.string({ required_error: "Address line 1 is required" }),
  address_2: z.string({ required_error: "Address line 2 is required" }),
  zipCode: z.string({ required_error: "Zip code is required" }),
  payment_method: z.enum(["DBT", "COD", "PAYPAL"], {
    message: "Please choose a valid payment method",
  }),
});

// Helper function to decode and validate the cart token
function decodeCartToken(cartToken: string) {
  try {
    const decodedCart = jwt.verify(
      cartToken,
      process.env.JWT_SECRET as string
    ) as jwt.JwtPayload;
    if (!decodedCart?.items || !Array.isArray(decodedCart.items)) {
      throw new Error("Invalid cart data.");
    }
    return decodedCart;
  } catch (error) {
    throw new Error("Invalid cart token.");
  }
}

// Helper function to map cart items
function mapCartItems(
  cartItems: { productId: number; variantId: number; qty: number }[]
) {
  return cartItems.map((item) => ({
    productId: item.productId,
    variantId: item.variantId,
    qty: item.qty,
  }));
}

export async function PlaceOrder(prevState: any, formData: FormData) {
  const csrfToken = formData.get("csrfToken") as string;
  const verifyCSRF = await verifyCsrfToken(csrfToken);
  if (!csrfToken || !verifyCSRF) {
    return { error: 500, msg: "somthing went wrong!" };
  }
  // Extract form data
  const formDataObject = {
    email: formData.get("email")?.toString(),
    name: formData.get("name")?.toString(),
    phone: formData.get("phone")?.toString(),
    country: formData.get("country")?.toString(),
    city: formData.get("city")?.toString(),
    province: formData.get("province")?.toString(),
    address_1: formData.get("address_1")?.toString(),
    address_2: formData.get("address_2")?.toString(),
    zipCode: formData.get("zipCode")?.toString(),
    payment_method: formData.get("payment_method")?.toString(),
  };

  // Validate form data
  const validationResult = orderSchema.safeParse(formDataObject);

  if (!validationResult.success) {
    return {
      errors: validationResult.error.flatten().fieldErrors,
    };
  }

  const validatedData = validationResult.data;

  // Check if cart exists
  const cookieStore = await cookies();
  const cartToken = cookieStore.get("cart")?.value;

  if (!cartToken) {
    return {
      error: "Cart not found. Please try again.",
    };
  }

  try {
    // Verify and decode the cart token
    const decodedCart = decodeCartToken(cartToken);

    // Get user ID from session
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return {
        error: "User not authenticated.",
      };
    }

    // Map cart items
    const orderItems = mapCartItems(decodedCart.items);

    // Create the order in the database
    const order = await prisma.$transaction(async (prisma) => {
      // Create the order
      const order = await prisma.orders.create({
        data: {
          subTotal: decodedCart.total,
          discount: decodedCart.couponDiscount,
          total: decodedCart.total,
          shipCost: null,
          status: "Pending",
          name: validatedData.name,
          email: validatedData.email,
          phone: validatedData.phone,
          city: validatedData.city,
          province: validatedData.province,
          country: validatedData.country,
          address_1: validatedData.address_1,
          address_2: validatedData.address_2,
          zipCode: validatedData.zipCode,
          userId: userId,
          transaction: {
            create: {
              mode: "pending",
              status: "cod",
              userId: userId,
            },
          },
          diffshipping: {
            create: {
              name: validatedData.name,
              email: validatedData.email,
              phone: validatedData.phone,
              city: validatedData.city,
              province: validatedData.province,
              country: validatedData.country,
              address_1: validatedData.address_1,
              address_2: validatedData.address_2,
              zipCode: validatedData.zipCode,
            },
          },
          orderitems: {
            createMany: {
              data: orderItems,
            },
          },
        },
        include: {
          orderitems: {
            select: {
              qty: true,
              product: { select: { name: true } },
              variant: true,
            },
          },
        },
      });

      // Update variant quantities
      for (const item of orderItems) {
        await prisma.variants.update({
          where: { id: item.variantId },
          data: {
            quantity: {
              decrement: item.qty,
            },
          },
        });
      }

      return order;
    });

    if (!order) {
      return {
        error: "Failed to place order.",
      };
    }

    // Clear the cart cookie
    cookieStore.delete("cart");

    // Create an order confirmation token
    const orderToken = jwt.sign(
      { orderId: order.id },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "1h", // Token expires in 1 hour
      }
    );
    cookieStore.set("orderconfirm", orderToken, {
      httpOnly: false,
      sameSite: "strict",
      maxAge: 3600, // 1 hour
    });

    await sendOrderTracking(validatedData.email, order);

    return { success: true };
  } catch (error) {
    console.log(error);
    return {
      error: "Something went wrong. Please try again.",
    };
  }
}
