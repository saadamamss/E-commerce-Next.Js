import { auth } from "@/auth";
import { redirect, RedirectType } from "next/navigation";

export default async function SignInLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (session) {
    redirect("/", RedirectType.replace);
  }

  return <>{children}</>;
}
