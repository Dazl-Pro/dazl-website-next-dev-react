import React from "react";
import "./footer.css";
import { LazyLoadImage } from "react-lazy-load-image-component";
import WorkspacesIcon from "@mui/icons-material/Workspaces";
import FacebookIcon from "@mui/icons-material/Facebook";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import XIcon from "@mui/icons-material/X";
import InstagramIcon from "@mui/icons-material/Instagram";
import PinterestIcon from "@mui/icons-material/Pinterest";
import YouTubeIcon from "@mui/icons-material/YouTube";
import { NavLink, Link, useNavigate } from "react-router-dom";
const Footer = () => {
  const token = localStorage.getItem("token");
  const userType = localStorage.getItem("userType");
  const routeNavigate = useNavigate();
  const scrollToTopAndNavigate = () => {
    window.scrollTo(0, 0);
  };
  return (
    <div className="footer bg-black text-white">
      <div className="footer-topp bg-dark py-3">
        <div className="foter-top-info container">
          <div className="d-flex flex-wrap align-items-center gap-3 justify-content-center">
            <div className="text-center">
              Dazl is a proud member of{" "}
              <LazyLoadImage
                alt="img"
                src="/images/headerImages/01-NARI-logo-placeholder.png"
                width={"40px"}
              />{" "}
              and{" "}
              <LazyLoadImage
                alt="img"
                src="/images/headerImages/01-HBA-logo-placeholder.png"
                width={"100px"}
              />
              , our local housing authorities.
            </div>
          </div>
        </div>
      </div>
      <div className="footer-inner py-5">
        <div className="logo-footer ms-5 mb-5">
          <LazyLoadImage
            alt="img"
            src="/images/footerImages/footer.png"
            width={"80px"}
          />
        </div>
        <div className="footer-linkss container heading-font fw-bold">
          <ul className="navbar-nav flex-row gap-3 flex-wrap justify-content-md-between justify-content-center gap-md-1  align-items-center">
            <WorkspacesIcon className="text-primary"></WorkspacesIcon>
            <li className="nav-item">
              <Link
                className="nav-link text-uppercase py-0 py-md-2"
                to="/"
                onClick={scrollToTopAndNavigate}
              >
                {token ? "DAZL ON TREND" : "Home"}
              </Link>
            </li>
            {/* <WorkspacesIcon className='text-primary'></WorkspacesIcon> */}
            {/* <li className="nav-item"><NavLink className="nav-link text-uppercase py-0 py-md-2" to='/blogs'>Blogs</NavLink></li> */}
            <WorkspacesIcon className="text-primary"></WorkspacesIcon>
            <li className="nav-item">
              <Link
                className="nav-link text-uppercase py-0 py-md-2"
                to={
                  token
                    ? userType === "agent"
                      ? "/home/agent"
                      : userType === "professional"
                      ? "/home/professional"
                      : "/home/customer"
                    : "/termsandconditions"
                }
                onClick={scrollToTopAndNavigate}
              >
                {token ? "DASHBOARD" : "TERMS & CONDITIONS"}
              </Link>
            </li>
            <WorkspacesIcon className="text-primary"></WorkspacesIcon>
            <li className="nav-item">
              <Link
                className="nav-link text-uppercase py-0 py-md-2"
                to="/contact-us"
                onClick={scrollToTopAndNavigate}
              >
                CONTACT US
              </Link>
            </li>
            {token ? (
              <>
                {" "}
                <WorkspacesIcon className="text-primary"></WorkspacesIcon>
                <li
                  className="nav-item"
                  onClick={() => (localStorage.clear(), routeNavigate("/"))}
                >
                  <Link
                    className="nav-link text-uppercase py-0 py-md-2"
                    onClick={scrollToTopAndNavigate}
                  >
                    Log out
                  </Link>
                </li>
              </>
            ) : (
              <>
                <WorkspacesIcon className="text-primary"></WorkspacesIcon>
                <li className="nav-item">
                  <Link
                    className="nav-link text-uppercase py-0 py-md-2"
                    to="/login-users"
                    onClick={scrollToTopAndNavigate}
                  >
                    Log in
                  </Link>
                </li>
                <WorkspacesIcon className="text-primary"></WorkspacesIcon>
                <li className="nav-item">
                  <Link
                    className="nav-link text-uppercase py-0 py-md-2"
                    to="/signup-users"
                    onClick={scrollToTopAndNavigate}
                  >
                    Sign up
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
      <div className="footer-bottomm bg-primary py-3">
        <div className="footer-bottomm-inner container d-flex flex-wrap align-items-center justify-content-md-between justify-content-center gap-1 gap-md-0">
          <p className="mb-0">
            <small>Company Dazl © 2024. All Rights Reserved</small>
          </p>
          <div className="social-links-footer d-flex gap-1">
            <a href="" target="_blank" className="social-icon-item">
              <FacebookIcon></FacebookIcon>
            </a>
            <a href="" target="_blank" className="social-icon-item">
              <LinkedInIcon></LinkedInIcon>
            </a>
            <a href="" target="_blank" className="social-icon-item">
              <XIcon></XIcon>
            </a>
            <a href="" target="_blank" className="social-icon-item">
              <InstagramIcon></InstagramIcon>
            </a>
            <a href="" target="_blank" className="social-icon-item">
              <PinterestIcon></PinterestIcon>
            </a>
            <a href="" target="_blank" className="social-icon-item">
              <YouTubeIcon></YouTubeIcon>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
