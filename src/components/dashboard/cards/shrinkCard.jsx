import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./card.css";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

const ShrinkCard = (props) => {
  const { title, index, navigate } = props;
  const location = useLocation();
  const navigateRoute = useNavigate();
  return (
    <>
      <div
        className={`rounded-top-4 cards-dazll z-1 ${
          index == 0 ? "firstCard" : index == 1 ? "secondCard" : "thirdCard"
        } `}
      >
        <div className="imgg-card-inner rounded-4 position-absolute top-0 start-0 w-100 h-100 d-flex align-items-end p-4 text-white">
          <div className="imgg-card-inner1 position-relative z-1 rounded-bottom-0">
            <h6 className="fs-6 underline-red">
              <span className="position-relative z-1">DAZL IS FOR</span>
            </h6>
            <h3 className="text-uppercase">{title}</h3>

            <button
              className="btn btn-light fw-medium d-flex align-items-center"
              onClick={() => navigateRoute(`${navigate}`)}
            >
              SIGN UP <NavigateNextIcon />
            </button>
          </div>
        </div>
      </div>
      {index === 0 && (
        <div
          className=" position-relative z-1 custom-height-card bg-white"
          style={{
            borderBottomLeftRadius: "1rem",
            borderBottomRightRadius: "1rem",
          }}
        >
          <div className="lower-contet-signupp">
            <h5 className=" text-uppercase text-black mb-3">
              for <text className="text-danger">REAL ESTATE PROFESSIONALS</text>{" "}
              Dazl is a hub to:
            </h5>
            <div className="custom-list">
              <p className="mb-2">
                <span className="custom-list-icon">&#x2022;</span> More
                accurately determine listing prices
              </p>
              <p className="mb-2">
                <span className="custom-list-icon">&#x2022;</span> Identify and
                quickly correct property deficiencies using qualified service
                pros
              </p>
              <p className="mb-2">
                <span className="custom-list-icon">&#x2022;</span> Maximize
                sales prices with fewer days-on-market
              </p>
            </div>
          </div>
        </div>
      )}
      {index === 1 && (
        <div
          className=" position-relative z-1 bg-white custom-height-card"
          style={{
            borderBottomLeftRadius: "1rem",
            borderBottomRightRadius: "1rem",
          }}
        >
          <div className="lower-contet-signupp">
            <h5 className=" text-uppercase text-black mb-3">
              for <text className="text-danger">SERVICE PROFESSIONALS</text>{" "}
              Dazl is a hub to:
            </h5>
            <div className="custom-list">
              <p className="mb-2">
                <span className="custom-list-icon">&#x2022;</span> Streamline
                project pipelines and intake processes
              </p>
              <p className="mb-2">
                <span className="custom-list-icon">&#x2022;</span> Selectively
                evaluate project scopes of work
              </p>
              <p className="mb-2">
                <span className="custom-list-icon">&#x2022;</span>{" "}
                Geographically focus project opportunities
              </p>
            </div>
          </div>
        </div>
      )}
      {index === 2 && (
        <div
          className=" position-relative z-1 bg-white custom-height-card"
          style={{
            borderBottomLeftRadius: "1rem",
            borderBottomRightRadius: "1rem",
          }}
        >
          <div className="lower-contet-signupp">
            <h5 className=" text-uppercase text-black mb-3">
              for <text className="text-danger">HOMEOWNERS</text> Dazl is a hub
              to:
            </h5>
            <div className="custom-list">
              <p className="mb-2">
                <span className="custom-list-icon">&#x2022;</span> Resolve tha
                pain points in the search for qualified contractors
              </p>
              <p className="mb-2">
                <span className="custom-list-icon">&#x2022;</span> Connect
                quickly with service pros to
              </p>
              <p className="mb-2">
                <span className="custom-list-icon">&#x2022;</span> Seek project
                inspiration ,discover tips collaborate with service
                professionals
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default ShrinkCard;
