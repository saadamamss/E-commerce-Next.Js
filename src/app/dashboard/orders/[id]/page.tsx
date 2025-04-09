import { prisma } from "@/prisma";
import "../../../../../public/assets/css/ordertble.css";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import CancelOrderForm from "./CancelOrder";
export default async function OrderDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const order = await prisma.orders.findUnique({
    where: { id: parseInt(id) },

    include: {
      orderitems: {
        select: {
          id: true,
          qty: true,
          product: {
            select: {
              name: true,
              brand: {
                select: { name: true },
              },
            },
          },
          varinat: {
            select: {
              price: true,
              attr_1: true,
              attr_2: true,
              attr_3: true,
              images: true,
            },
          },
        },
      },
      diffshipping: true,
      transaction: true,
    },
  });
  if (!order) {
    return notFound();
  }

  return (
    <div className="col-lg-9">
      <div className="wg-box mt-5 mb-5">
        <div className="row">
          <div className="col-6">
            <h5>Ordered Details</h5>
          </div>
          <div className="col-6 text-right">
            <Link className="btn btn-sm btn-danger" href="/dashboard/orders">
              Back
            </Link>
          </div>
        </div>
        <div className="table-responsive">
          <table className="table table-striped table-bordered table-transaction">
            <tbody>
              <tr>
                <th>Order No</th>
                <td>{order.id}</td>
                <th>Mobile</th>
                <td>{order.phone}</td>
                <th>Pin/Zip Code</th>
                <td>{order.zipCode}</td>
              </tr>
              <tr>
                <th>Order Date</th>
                <td>{order.createdAt.toDateString()}</td>
                <th>Delivered Date</th>
                <td>{order.deliveredDate?.toDateString()}</td>
                <th>Canceled Date</th>
                <td>{order.deliveredDate?.toDateString()}</td>
              </tr>
              <tr>
                <th>Order Status</th>
                <td colSpan={5}>
                  <span
                    className={`badge ${
                      order.status === "canceld" ? "bg-danger" : "bg-success"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="wg-box wg-table table-all-user">
        <div className="row">
          <div className="col-6">
            <h5>Ordered Items</h5>
          </div>
          <div className="col-6 text-right"></div>
        </div>
        <div className="table-responsive">
          <table className="table table-striped table-bordered">
            <thead>
              <tr>
                <th>Name</th>
                <th className="text-center">Price</th>
                <th className="text-center">Quantity</th>
                <th className="text-center">brand</th>
                <th className="text-center">Return Status</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {order.orderitems.map((item) => (
                <tr key={item.id}>
                  <td className="pname">
                    <div className="image">
                      <Image
                        src={`/assets/images/products/${
                          item.varinat.images?.split(",")[0]
                        }`}
                        width={100}
                        height={100}
                        alt=""
                        className="image"
                      />
                    </div>

                    <div className="name">
                      <Link
                        href="http://localhost:8000/shop/product1"
                        target="_blank"
                        className="body-title-2"
                      >
                        {item.product.name}
                      </Link>
                      {item.varinat && (
                        <p className="mb-0">
                          {item.varinat.attr_1} , {item.varinat.attr_2} ,{" "}
                          {item.varinat.attr_3}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="text-center">
                    EGP{item.varinat.price.toString()}
                  </td>
                  <td className="text-center">{item.qty}</td>
                  <td className="text-center">{item.product.brand?.name}</td>
                  <td className="text-center">No</td>
                  <td className="text-center">
                    <a
                      href="http://localhost:8000/shop/product1"
                      target="_blank"
                    >
                      <div className="list-icon-function view-icon">
                        <div className="item eye">
                          <i className="fa fa-eye"></i>
                        </div>
                      </div>
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="divider"></div>
      <div className="flex items-center justify-between flex-wrap gap10 wgp-pagination"></div>

      <div className="wg-box mt-5">
        <h5>Shipping Address</h5>
        <div className="row mx-0">
          <div className="my-account__address-item col-md-6">
            <div className="my-account__address-item__detail">
              <p>{order.name}</p>
              <p>
                {order.address_1},{order.address_1}
              </p>
              <p>{order.city}</p>
              <p>{order.province}</p>
              <p>{order.country}</p>
              <br />
              <p>Phone : {order.phone}</p>
            </div>
          </div>

          {order.diffshipping && (
            <div className="my-account__address-item col-md-6">
              <div className="my-account__address-item__detail">
                <p>{order.diffshipping.name}</p>
                <p>
                  {order.diffshipping.address_1},{order.diffshipping.address_1}
                </p>
                <p>{order.diffshipping.city}</p>
                <p>{order.diffshipping.province}</p>
                <p>{order.diffshipping.country}</p>
                <br />
                <p>Phone : {order.diffshipping.phone}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="wg-box mt-5">
        <h5>Transactions</h5>
        <div className="table-responsive">
          <table className="table table-striped table-bordered table-transaction">
            <tbody>
              <tr>
                <th>Subtotal</th>
                <td>EGP{order.subTotal.toString()}</td>
                <th>Tax</th>
                <td>EGP0</td>
                <th>Discount</th>
                <td>EGP{order.discount?.toString()}</td>
              </tr>
              <tr>
                <th>Total</th>
                <td>EGP{order.total.toString()}</td>
                <th>Payment Mode</th>
                <td>{order.transaction?.mode}</td>
                <th>Status</th>
                <td>
                  <span className="badge bg-success">
                    {order.transaction?.status}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/*  */}
      <div className="wg-box mt-5 text-right">
        {order.status === "canceld" ? (
          <p className="text-red text-left mb-0">This Order Canceled!</p>
        ) : (
          <CancelOrderForm orderId={order.id} />
        )}
      </div>
    </div>
  );
}

/**

  deleverd date
  return status
  variantId instead of attrs

 */
