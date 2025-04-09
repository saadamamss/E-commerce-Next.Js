import { auth } from "@/auth";
import AccountDetailsForm from "./form";
import { getSession } from "next-auth/react";

export default async function AccoutDetails() {
  // const session = await auth();
  // const user = session?.user as
  //   | { name: string; email: string; username: string; id: string }
  //   | undefined;


  return (
    <>
      <AccountDetailsForm  />
    </>
  );
}
