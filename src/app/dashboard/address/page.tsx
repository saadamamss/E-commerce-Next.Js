export default async function AccountAddress() {
  return (
    <div className="col-lg-9">
      <div className="page-content my-account__address">
        <div className="row">
          <div className="col-6">
            <p className="notice">
              The following addresses will be used on the checkout page by
              default.
            </p>
          </div>
          <div className="col-6 text-right">
            <a href="#" className="btn btn-sm btn-info">
              Add New
            </a>
          </div>
        </div>
        <div className="my-account__address-list row">
          <h5>Shipping Address</h5>

          <div className="my-account__address-item col-md-6">
            <div className="my-account__address-item__title">
              <h5>
                Sudhir Kumar <i className="fa fa-check-circle text-success"></i>
              </h5>
              <a href="#">Edit</a>
            </div>
            <div className="my-account__address-item__detail">
              <p>Flat No - 13, R. K. Wing - B</p>
              <p>ABC, DEF</p>
              <p>GHJ, </p>
              <p>Near Sun Temple</p>
              <p>000000</p>
              <br />
              <p>Mobile : 1234567891</p>
            </div>
          </div>
          <hr />
        </div>
      </div>
    </div>
  );
}
