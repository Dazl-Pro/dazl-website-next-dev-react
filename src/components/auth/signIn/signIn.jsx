import React from "react";
import { useNavigate } from "react-router-dom";
import "./signIn.css"; // Import your CSS file for styling
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
const cardData = [
  {
    bgImage: "/images/shrinkCardimages/realtorBG.jpg",
    link: "/login/realtor",
    title: "DAZL IS FOR",
    subTitle: "real estate pros",
    login: "Log-In",
    pTitle: "for REAL ESTATE PROFESSIONALS Dazl is a hub to:",
    p1: "More accurately determine listing prices",
    p2: "Identify and quickly correct property deficiencies using qualified service pros",
    p3: "Maximize sales prices with fewer days-on-market",
  },

  {
    bgImage: "/images/shrinkCardimages/proBG.jpg",
    link: "/login/professional",
    title: "DAZL IS FOR",
    subTitle: "service pros",
    login: "Log-In",
    pTitle: "for SERVICE PROFESSIONALS Dazl is a hub to:",
    p1: "Streamline project pipelines and intake processes",
    p2: " Selectively evaluate project scopes of work",
    p3: "Geographically focus project opportunities",
  },

  {
    bgImage: "/images/shrinkCardimages/customerBG.jpg",
    link: "/login/customer",
    title: "DAZL IS FOR",
    subTitle: "homeowners",
    login: "Log-In",
    pTitle: "for HOMEOWNERS Dazl is a hub to:",
    p1: "Resolve tha pain points in the search for qualified contractors",
    p2: " Connect quickly with service pros to",
    p3: "Seek project inspiration ,discover tips collaborate with service professionals",
  },
];

const SignIn = () => {
  const navigate = useNavigate();
  return (
    <div className="login-all-type">
      <div className="card-container container py-5">
        {cardData.map((item, index) => (
          <div className="card border-0 shadow p-0 rounded-4" key={index}>
            <div
              className="card-image "
              style={{ backgroundImage: `url(${item?.bgImage})` }}
            >
              <div className="image-overlay position-absolute bottom-0 start-0 p-4 text-white w-100 h-100 d-flex align-items-end">
                <div>
                  <h6 className="pTitle fs-6 underline-red text-uppercase">
                    <span>{item?.title}</span>
                  </h6>
                  <h2 className="card-title text-uppercase">
                    {item?.subTitle}
                  </h2>
                  <button
                    className="read-more-button btn btn-light fw-medium text-uppercase mt-3 d-flex align-items-center"
                    onClick={() => navigate(item?.link)}
                  >
                    {item?.login} <NavigateNextIcon />
                  </button>
                </div>
              </div>
            </div>
            <div className="card-content">
              <h5 className="card-subtitle text-uppercase text-black mb-3">
                {item?.pTitle}
              </h5>
              <div className="custom-list">
                <p className="mb-2">
                  <span className="custom-list-icon">&#x2022;</span> {item?.p1}
                </p>
                <p className="mb-2">
                  <span className="custom-list-icon">&#x2022;</span> {item?.p2}
                </p>
                <p className="mb-2">
                  <span className="custom-list-icon">&#x2022;</span> {item?.p3}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SignIn;
