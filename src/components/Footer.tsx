import Image from "next/image";
import Link from "next/link";
import WishlistCount from "./WishlistCount";

export default function Footer() {
  return (
    <>
      <hr className="mt-5 text-secondary" />
      <footer className="footer footer_type_2">
        <div className="footer-middle container">
          <div className="row row-cols-lg-5 row-cols-2">
            <div className="footer-column footer-store-info col-12 mb-4 mb-lg-0">
              <div className="logo">
                <Link href="index.html">
                  <Image
                    src="/assets/images/logo.png"
                    alt="SurfsideMedia"
                    className="logo__image d-block"
                    width={250}
                    height={150}
                  />
                </Link>
              </div>
              <p className="footer-address">
                123 Beach Avenue, Surfside City, CA 00000
              </p>
              <p className="m-0">
                <strong className="fw-medium">contact@surfsidemedia.in</strong>
              </p>
              <p>
                <strong className="fw-medium">+1 000-000-0000</strong>
              </p>

              <ul className="social-links list-unstyled d-flex flex-wrap mb-0">
                <li>
                  <Link href="#" className="footer__social-link d-block">
                    <svg
                      className="svg-icon svg-icon_facebook"
                      width="9"
                      height="15"
                      viewBox="0 0 9 15"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <use href="#icon_facebook" />
                    </svg>
                  </Link>
                </li>
                <li>
                  <Link href="#" className="footer__social-link d-block">
                    <svg
                      className="svg-icon svg-icon_twitter"
                      width="14"
                      height="13"
                      viewBox="0 0 14 13"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <use href="#icon_twitter" />
                    </svg>
                  </Link>
                </li>
                <li>
                  <Link href="#" className="footer__social-link d-block">
                    <svg
                      className="svg-icon svg-icon_instagram"
                      width="14"
                      height="13"
                      viewBox="0 0 14 13"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <use href="#icon_instagram" />
                    </svg>
                  </Link>
                </li>
                <li>
                  <Link href="#" className="footer__social-link d-block">
                    <svg
                      className="svg-icon svg-icon_youtube"
                      width="16"
                      height="11"
                      viewBox="0 0 16 11"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M15.0117 1.8584C14.8477 1.20215 14.3281 0.682617 13.6992 0.518555C12.5234 0.19043 7.875 0.19043 7.875 0.19043C7.875 0.19043 3.19922 0.19043 2.02344 0.518555C1.39453 0.682617 0.875 1.20215 0.710938 1.8584C0.382812 3.00684 0.382812 5.46777 0.382812 5.46777C0.382812 5.46777 0.382812 7.90137 0.710938 9.07715C0.875 9.7334 1.39453 10.2256 2.02344 10.3896C3.19922 10.6904 7.875 10.6904 7.875 10.6904C7.875 10.6904 12.5234 10.6904 13.6992 10.3896C14.3281 10.2256 14.8477 9.7334 15.0117 9.07715C15.3398 7.90137 15.3398 5.46777 15.3398 5.46777C15.3398 5.46777 15.3398 3.00684 15.0117 1.8584ZM6.34375 7.68262V3.25293L10.2266 5.46777L6.34375 7.68262Z" />
                    </svg>
                  </Link>
                </li>
                <li>
                  <Link href="#" className="footer__social-link d-block">
                    <svg
                      className="svg-icon svg-icon_pinterest"
                      width="14"
                      height="15"
                      viewBox="0 0 14 15"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <use href="#icon_pinterest" />
                    </svg>
                  </Link>
                </li>
              </ul>
            </div>

            <div className="footer-column footer-menu mb-4 mb-lg-0">
              <h6 className="sub-menu__title text-uppercase">Company</h6>
              <ul className="sub-menu__list list-unstyled">
                <li className="sub-menu__item">
                  <Link
                    href="about-2.html"
                    className="menu-link menu-link_us-s"
                  >
                    About Us
                  </Link>
                </li>
                <li className="sub-menu__item">
                  <Link href="#" className="menu-link menu-link_us-s">
                    Careers
                  </Link>
                </li>
                <li className="sub-menu__item">
                  <Link href="#" className="menu-link menu-link_us-s">
                    Affiliates
                  </Link>
                </li>
                <li className="sub-menu__item">
                  <Link
                    href="blog_list1.html"
                    className="menu-link menu-link_us-s"
                  >
                    Blog
                  </Link>
                </li>
                <li className="sub-menu__item">
                  <Link
                    href="contact-2.html"
                    className="menu-link menu-link_us-s"
                  >
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>

            <div className="footer-column footer-menu mb-4 mb-lg-0">
              <h6 className="sub-menu__title text-uppercase">Shop</h6>
              <ul className="sub-menu__list list-unstyled">
                <li className="sub-menu__item">
                  <Link href="shop2.html" className="menu-link menu-link_us-s">
                    New Arrivals
                  </Link>
                </li>
                <li className="sub-menu__item">
                  <Link href="shop3.html" className="menu-link menu-link_us-s">
                    Accessories
                  </Link>
                </li>
                <li className="sub-menu__item">
                  <Link href="shop4.html" className="menu-link menu-link_us-s">
                    Men
                  </Link>
                </li>
                <li className="sub-menu__item">
                  <Link href="shop5.html" className="menu-link menu-link_us-s">
                    Women
                  </Link>
                </li>
                <li className="sub-menu__item">
                  <Link href="shop1.html" className="menu-link menu-link_us-s">
                    Shop All
                  </Link>
                </li>
              </ul>
            </div>

            <div className="footer-column footer-menu mb-4 mb-lg-0">
              <h6 className="sub-menu__title text-uppercase">Help</h6>
              <ul className="sub-menu__list list-unstyled">
                <li className="sub-menu__item">
                  <Link href="#" className="menu-link menu-link_us-s">
                    Customer Service
                  </Link>
                </li>
                <li className="sub-menu__item">
                  <Link
                    href="account_dashboard.html"
                    className="menu-link menu-link_us-s"
                  >
                    My Account
                  </Link>
                </li>
                <li className="sub-menu__item">
                  <Link
                    href="store_location.html"
                    className="menu-link menu-link_us-s"
                  >
                    Find a Store
                  </Link>
                </li>
                <li className="sub-menu__item">
                  <Link href="#" className="menu-link menu-link_us-s">
                    Legal & Privacy
                  </Link>
                </li>
                <li className="sub-menu__item">
                  <Link href="#" className="menu-link menu-link_us-s">
                    Gift Card
                  </Link>
                </li>
              </ul>
            </div>

            <div className="footer-column footer-menu mb-4 mb-lg-0">
              <h6 className="sub-menu__title text-uppercase">Categories</h6>
              <ul className="sub-menu__list list-unstyled">
                <li className="sub-menu__item">
                  <Link href="#" className="menu-link menu-link_us-s">
                    Shirts
                  </Link>
                </li>
                <li className="sub-menu__item">
                  <Link href="#" className="menu-link menu-link_us-s">
                    Jeans
                  </Link>
                </li>
                <li className="sub-menu__item">
                  <Link href="#" className="menu-link menu-link_us-s">
                    Shoes
                  </Link>
                </li>
                <li className="sub-menu__item">
                  <Link href="#" className="menu-link menu-link_us-s">
                    Bags
                  </Link>
                </li>
                <li className="sub-menu__item">
                  <Link href="#" className="menu-link menu-link_us-s">
                    Shop All
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="container d-md-flex align-items-center">
            <span className="footer-copyright me-auto">
              ©2024 Surfside Media
            </span>
            <div className="footer-settings d-md-flex align-items-center">
              <Link href="privacy-policy.html">Privacy Policy</Link>{" "}
              &nbsp;|&nbsp;{" "}
              <Link href="terms-conditions.html">Terms &amp; Conditions</Link>
            </div>
          </div>
        </div>
      </footer>

      <footer className="footer-mobile container w-100 px-5 d-md-none bg-body">
        <div className="row text-center">
          <div className="col-4">
            <Link
              href="/"
              className="footer-mobile__link d-flex flex-column align-items-center"
            >
              <svg
                className="d-block"
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <use href="#icon_home" />
              </svg>
              <span>Home</span>
            </Link>
          </div>

          <div className="col-4">
            <Link
              href="/shop"
              className="footer-mobile__link d-flex flex-column align-items-center"
            >
              <svg
                className="d-block"
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <use href="#icon_hanger" />
              </svg>
              <span>Shop</span>
            </Link>
          </div>

          <div className="col-4">
            <Link
              href="/wishlist"
              className="footer-mobile__link d-flex flex-column align-items-center"
            >
              <div className="position-relative">
                <svg
                  className="d-block"
                  width="18"
                  height="18"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <use href="#icon_heart" />
                </svg>
                <WishlistCount />
              </div>
              <span>Wishlist</span>
            </Link>
          </div>
        </div>
      </footer>

      <div id="scrollTop" className="visually-hidden end-0"></div>
    </>
  );
}
