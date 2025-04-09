import { auth } from "@/auth";
import Link from "next/link";

export default async function Dashboard() {
  const session = await auth();
  const user = session?.user;

  return (
    <div className="col-lg-9">
      <div className="page-content my-account__dashboard">
        <p>
          Hello <strong>{user?.name}</strong>
        </p>
        <p>
          From your account dashboard you can view your{" "}
          <Link className="unerline-link" href="/dashboard/orders">
            recent orders
          </Link>
          , manage your{" "}
          <Link className="unerline-link" href="/dashboard/address">
            shipping addresses
          </Link>
          , and{" "}
          <Link className="unerline-link" href="/dashboard/account-details">
            edit your password and account details.
          </Link>
        </p>
      </div>
    </div>
  );
}
