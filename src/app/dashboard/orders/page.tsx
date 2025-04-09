import { prisma } from "@/prisma";
import "../../../../public/assets/css/table.css";
import { auth } from "@/auth";
import Link from "next/link";
export default async function AccountOrders() {
  const session = await auth();
  const orders = await prisma.orders.findMany({
    where: {
      userId: session?.user?.id,
    },
    select: {
      id: true,
      total: true,
      createdAt: true,
      status: true,
      deliveredDate: true,
      _count: {
        select: {
          orderitems: true,
        },
      },
    },
  });

  return (
    <div className="col-lg-9">
      {orders.length ? (
        <>
          <div className="wg-table table-all-user">
            <div className="table-responsive">
              <table className="table table-striped table-bordered text-center">
                <thead>
                  <tr>
                    <th>OrderNo</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Order Date</th>
                    <th>Items</th>
                    <th>Delivered On</th>
                    <th>view</th>
                  </tr>
                </thead>
                <tbody>
                  {orders?.map((order) => (
                    <tr key={order.id}>
                      <td className="text-center">{order.id}</td>
                      <td className="text-center">
                        EGP{order.total.toString()}
                      </td>
                      <td className="text-center">
                        <span
                          className={`badge ${
                            order.status === "canceld"
                              ? "bg-danger"
                              : "bg-success"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="text-center">
                        {order.createdAt.toDateString()}
                      </td>
                      <td className="text-center">{order._count.orderitems}</td>
                      <td>{order.deliveredDate?.toDateString() ?? "-"}</td>
                      <td className="text-center">
                        <div className="list-icon-function view-icon">
                          <div className="item eye">
                            <Link href={`/dashboard/orders/${order.id}`}>
                              <i className="bi bi-eye"></i>
                            </Link>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="divider"></div>
          <div className="flex items-center justify-between flex-wrap gap10 wgp-pagination"></div>
        </>
      ) : (
        <>
          <br />
          <h2>No Order Requested</h2>
        </>
      )}
    </div>
  );
}
