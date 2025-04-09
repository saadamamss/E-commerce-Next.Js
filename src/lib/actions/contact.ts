"use server";

import { prisma } from "@/prisma";
import { z } from "zod";
import { verifyCsrfToken } from "../utils/csrfVerify";

const contactFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  comment: z.string().min(1, "Message is required"),
});

export async function contactFormAction(prev: any, formData: FormData) {
  const csrfToken = formData.get("csrfToken") as string;
  const verifyCSRF = await verifyCsrfToken(csrfToken);
  if (!csrfToken || !verifyCSRF) {
    return { error: 500, msg: "somthing went wrong!" };
  }

  const formValues = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    comment: formData.get("comment") as string,
  };

  // Validate the form data using Zod
  const result = contactFormSchema.safeParse(formValues);

  if (!result.success) {
    // If validation fails, set the errors in the state
    return { errors: result.error.flatten().fieldErrors };
  }

  try {
    await prisma.messages.create({
      data: formValues,
    });

    return { success: 200, msg: "message set successfully" };
  } catch (error) {
    return { error: 500, msg: "Somthing went wrong!" };
  }
}
