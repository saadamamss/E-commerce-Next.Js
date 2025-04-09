"use server";
import { auth } from "@/auth";
import { prisma } from "@/prisma";
import { z } from "zod";
import bcryptjs from "bcryptjs";
import { signIn } from "@/auth";
import { verifyCsrfToken } from "../utils/csrfVerify";

const userDetailsUpdateSchema = z
  .object({
    name: z.string().min(1, { message: "Name is required" }).optional(),
    email: z.string().email({ message: "Invalid email address" }).optional(),
    username: z.string().min(1, { message: "Name is required" }).optional(),
    oldPassword: z.string().optional(),
    newPassword: z
      .string()
      .min(8, { message: "New password must be at least 8 characters long" })
      .optional(),
    confirmPassword: z
      .string()
      .min(8, {
        message: "Confirm password must be at least 8 characters long",
      })
      .optional(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "New password and confirm password do not match",
    path: ["confirmPassword"],
  });

export async function SaveChanges(prevstate: any, formData: FormData) {
  const csrfToken = formData.get("csrfToken") as string;
  const verifyCSRF = await verifyCsrfToken(csrfToken);
  if (!csrfToken || !verifyCSRF) {
    return { error: 500, msg: "somthing went wrong!" };
  }
  //
  const changes = JSON.parse(formData.get("changes") as string);
  const validationResult = userDetailsUpdateSchema.safeParse(changes);

  if (!validationResult.success) {
    console.log(validationResult.error.flatten().fieldErrors);
    return {
      errors: validationResult.error.flatten().fieldErrors,
    };
  }

  try {
    const session = await auth();

    const { oldPassword, newPassword, confirmPassword, ...updatedData } =
      changes;

    const user = session?.user?.id;
    if (oldPassword && newPassword && confirmPassword) {
      const finduser = await prisma.user.findUnique({
        where: { id: user },
        select: { password: true },
      });
      const matched = await bcryptjs.compare(
        changes.oldPassword as string,
        finduser?.password as string
      );
      if (matched && finduser) {
        const newpass = await bcryptjs.hash(changes.newPassword as string, 10);
        await prisma.user.update({
          where: { id: user },
          data: {
            password: newpass,
            ...updatedData,
          },
          select: {
            name: true,
            email: true,
            id: true,
            image: true,
            username: true,
            role: true,
          },
        });
      } else {
        return { error: { message: "password is not valid !" } };
      }
    } else {
      const updateduser = await prisma.user.update({
        where: { id: user },
        data: updatedData,
        select: {
          name: true,
          email: true,
          id: true,
          image: true,
          username: true,
          role: true,
        },
      });
      await signIn("credentials", {
        redirect: false,
        name: updateduser.name,
        email: updateduser.email,
        id: updateduser.id,
        image: updateduser.image ?? "",
        username: updateduser.username ?? "",
        role: updateduser.role,
      });
    }

    return { success: true, msg: "user details updated successfully !" };
  } catch (error) {
    return { error: { message: "somthing went wrong!" } };
  }
}
