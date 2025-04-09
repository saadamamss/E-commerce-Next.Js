"use server";
import { signIn, signOut } from "../../auth";
import { prisma } from "@/prisma";
import bcryptjs from "bcryptjs";
import Jwt from "jsonwebtoken";
import {
  sendResetPasswordEmail,
  sendVerificationEmail,
} from "../helpers/mails";
import { z } from "zod";
import { redirect, RedirectType } from "next/navigation";
export const github_Login = async () => {
  await signIn("github", { redirectTo: "/" });
};

export const logout = async () => {
  await signOut({ redirectTo: "/", redirect: true });
};

const signInSchema = z.object({
  email: z
    .string()
    .min(1, "This field is required")
    .email("Invalid email format"),
  password: z.string().min(1, "This field is required"),
});

// sign in with creds
export const SignInWithCreds = async (perv: any, data: FormData) => {
  //const hashedPassword = await bcrypt.hash(data.get("password") as string, 10);
  const creds = {
    email: data.get("email"),
    password: data.get("password"),
  };

  const validate = signInSchema.safeParse(creds);
  if (!validate.success) {
    return { errors: validate.error.flatten().fieldErrors };
  }

  const user = await prisma.user.findUnique({
    where: { email: creds.email as string },
  });

  if (!user) {
    return { error: 404, msg: "account not found in our records !" };
  }

  // Compare the provided password with the hashed password in the database
  const isValid = await bcryptjs.compare(
    creds.password as string,
    user.password as string
  );

  if (!isValid) {
    return { error: 404, msg: "these credentials are invalid!" };
  }

  try {
    await signIn("credentials", {
      name: user.name,
      email: user.email,
      id: user.id,
      image: user.image ?? "",
      username: user.username ?? "",
      role: user.role,
      redirect: false,
    });
    return { success: true };
  } catch (error) {
    return { error: 500, msg: "Something went wrong" };
  }
};

const signUpSchema = z
  .object({
    name: z
      .string({ required_error: "This field is required" })
      .min(4, "name must be more than 4 letters"),
    email: z
      .string()
      .min(1, "This field is required")
      .email("Invalid email format"),
    password: z.string().min(8, "This field is required"),
    confirmPassword: z.string().min(8, "This field is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "New password and confirm password do not match",
    path: ["confirmPassword"],
  });

//sign up with creds
export const SignUpWithCreds = async (prev: any, data: FormData) => {
  const creds = {
    name: data.get("name"),
    email: data.get("email"),
    password: data.get("password"),
    confirmPassword: data.get("confirmPassword"),
  };

  const validate = signUpSchema.safeParse(creds);
  if (!validate.success) {
    return { errors: validate.error.flatten().fieldErrors };
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        email: creds.email as string,
      },
      select: {
        id: true,
      },
    });

    if (existingUser?.id) {
      return { error: 405, msg: "Email already exists. Login to continue." };
    }

    // hash the password
    const hashedPassword = await bcryptjs.hash(creds.password as string, 10);

    const user = await prisma.user.create({
      data: {
        name: creds.name as string,
        email: creds.email as string,
        password: hashedPassword as string,
      },
    });

    const token = Jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET as string
    );

    await sendVerificationEmail(creds.email as string, token);

    await signIn("credentials", {
      redirect: false,
      name: user.name,
      email: user.email,
      id: user.id,
      image: user.image ?? "",
      username: user.username ?? "",
      role: user.role,
    });

    // Send verification email
    return { success: true };
  } catch (error) {
    return { error: 500, msg: "Something went wrong" };
  }
};

// sign out
export const SignOut = async () => {
  await signOut({ redirect: false });
  redirect("/", RedirectType.replace);
};

const varifyEmail = z.object({
  email: z.string().email(),
});
export const SendResetPassword = async (prev: any, formData: FormData) => {
  const email = formData.get("email") as string;

  const validationResult = varifyEmail.safeParse({ email });

  if (!validationResult.success) {
    console.log(validationResult.error.flatten().fieldErrors);
    return {
      errors: validationResult.error.flatten().fieldErrors,
    };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: email },
    });

    if (user) {
      const token = Jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET as string
      );

      await sendResetPasswordEmail(email as string, token);

      return { success: 200, msg: "we sent an email check your inbox" };
    }
    return { error: 404, msg: "this account not found!" };
  } catch (error) {
    return { error: 500, msg: "somthing went wrong" };
  }
};

const ResetPasswordSchema = z
  .object({
    userId: z.string(),
    oldPassword: z.string(),
    newPassword: z
      .string()
      .min(8, "password cant be less than 8")
      .max(20, "password must be less than 20"),
    confirmPassword: z
      .string()
      .min(8, "password cant be less than 8")
      .max(20, "password must be less than 20"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "New password and confirm password do not match",
    path: ["confirmPassword"],
  });

export const ResetUserPassword = async (prev: any, formData: FormData) => {
  const data = {
    userId: formData.get("userId"),
    oldPassword: formData.get("oldPassword"),
    newPassword: formData.get("newPassword"),
    confirmPassword: formData.get("confirmPassword"),
  };
  const validationResult = ResetPasswordSchema.safeParse(data);

  if (!validationResult.success) {
    console.log(validationResult.error.flatten().fieldErrors);
    return {
      errors: validationResult.error.flatten().fieldErrors,
    };
  }

  try {
    const finduser = await prisma.user.findUnique({
      where: { id: data.userId as string },
      select: { password: true },
    });

    const matched = await bcryptjs.compare(
      data.oldPassword as string,
      finduser?.password as string
    );

    if (matched && finduser) {
      const newpass = await bcryptjs.hash(data.newPassword as string, 10);
      await prisma.user.update({
        where: { id: data.userId as string },
        data: {
          password: newpass,
        },
      });
      return { success: 200, msg: "password changed successfully!" };
    }
    return { error: 401, msg: "password is not valid !" };
  } catch (error) {
    return { error: 500, msg: "somthing went wrong" };
  }
};

/**
  try {
    await signIn("credentials", creds);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "this Credentials not matchd in our records ." };
        default:
          return { error: "Something went wrong" };
      }
    }
  }
 */

//$2b$10$9r2NQqYnzXiKrIU4YZ6unuimEQ/MfDJCV9gz9o3G1mInx8RKO/WZy
