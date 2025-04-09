import { prisma } from "@/prisma";
import Jwt from "jsonwebtoken";
import ResetPassworForm from "./form";
export default async function VerifyEmail({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { token } = await searchParams;

  const decode: any = await new Promise((resolve) =>
    Jwt.verify(
      token as string,
      process.env.JWT_SECRET as string,
      (error, decode) => {
        resolve(decode);
      }
    )
  );

  if (!decode?.userId) {
    return (
      <>
        <h1>Invalid Or Expired Link</h1>
      </>
    );
  }

  return (
    <>
      <ResetPassworForm userId={decode.userId} />
    </>
  );
}
