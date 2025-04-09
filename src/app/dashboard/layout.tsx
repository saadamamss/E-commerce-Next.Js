import Layout from "@/components/HeaderFooterLayout";
import { SignOut } from "@/lib/actions/auth";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactElement;
}) {
  return (
    <Layout>
      <main className="pt-90">
        <div className="mb-4 pb-4"></div>
        <section className="my-account container">
          <h2 className="page-title">My Account</h2>
          <div className="row">
            <div className="col-lg-3">
              <ul className="account-nav">
                <li>
                  <Link href="/dashboard" className="menu-link menu-link_us-s">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard/orders"
                    className="menu-link menu-link_us-s"
                  >
                    Orders
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard/address"
                    className="menu-link menu-link_us-s"
                  >
                    Addresses
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard/account-details"
                    className="menu-link menu-link_us-s"
                  >
                    Account Details
                  </Link>
                </li>
                <li>
                  <form action={SignOut}>
                    <button type="submit" className="block m-0 menu-link menu-link_us-s">
                      Logout
                    </button>
                  </form>
                </li>
              </ul>
            </div>

            {children}
          </div>
        </section>
      </main>
    </Layout>
  );
}
