"use server";
import { auth } from "@/auth";
import { prisma } from "@/prisma";
import { getCsrfToken } from "next-auth/react";
import { z } from "zod";
import { verifyCsrfToken } from "../utils/csrfVerify";
const reviewSchema = z.object({
  review: z
    .string()
    .min(10, { message: "Feedback must be at least 10 characters long" })
    .max(500, { message: "Feedback cannot exceed 500 characters" }),
  rate: z
    .number()
    .min(1, { message: "Rating must be at least 1" })
    .max(5, { message: "Rating cannot exceed 5" }),
  productId: z.number({ required_error: "ther is no product!" }),
});

export async function AddReview(prevstate: any, formData: FormData) {
  const csrfToken = formData.get("csrfToken") as string;
  const verifyCSRF = await verifyCsrfToken(csrfToken);
  if (!csrfToken || !verifyCSRF) {
    return { error: 500, msg: "somthing went wrong!" };
  }
  const data = {
    rate: parseInt(formData.get("rate") as string),
    review: formData.get("review"),
    productId: parseInt(formData.get("productId") as string),
  };
  const validationResult = reviewSchema.safeParse(data);

  if (!validationResult.success) {
    return {
      errors: validationResult.error.flatten().fieldErrors,
    };
  }

  try {
    const user = (await auth())?.user;
    if (user) {
      const review = await prisma.reviews.create({
        data: {
          rate: data.rate.toString(),
          review: data.review as string,
          userId: user.id as string,
          productId: data.productId,
        },
        include: {
          user: {
            select: {
              id: true,
              image: true,
              email: true,
              name: true,
            },
          },
        },
      });

      return { success: true, data: review };
    }
    return { error: "you are not authorized!" };
  } catch (error) {
    return { error: "somthing went wrong!" };
  }
}
