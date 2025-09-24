import React from "react";
import "./sections.css";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import BuildCircleIcon from "@mui/icons-material/BuildCircle";
import ScoreIcon from "@mui/icons-material/Score";

const SectionTwo = () => {
  return (
    <div className="bg-light-red py-5 real-estate-collab-sec">
      <div className="container">
        <h2 className="text-danger text-center mb-4 mw-560px mx-auto">
          DAZL IS A <span className="text-dark">RESIDENTIAL REAL ESTATE</span>{" "}
          COLLABORATION HUB TO:
        </h2>
        <div className="row">
          <div className="col-md-4 mb-4">
            <div className="col-inner shadow rounded-4 p-4 h-100 text-center bg-white points-collab-inner">
              <AccessTimeFilledIcon className="fs-50px text-primary icon-collab-sec"></AccessTimeFilledIcon>
              <h5 className="mb-0 mt-3 text-red-100 para-font fw-bold">
                Gain real-time, property specific intelligence and insight
              </h5>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="col-inner shadow rounded-4 p-4 h-100 text-center bg-white points-collab-inner">
              <LocalOfferIcon className="fs-50px text-primary icon-collab-sec"></LocalOfferIcon>
              <h5 className="mb-0 mt-3 para-font fw-bold">
                Eliminate roadblocks preventing competitive buyer offers
              </h5>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="col-inner shadow rounded-4 p-4 h-100 text-center bg-white points-collab-inner">
              <BuildCircleIcon className="fs-50px text-primary icon-collab-sec"></BuildCircleIcon>
              <h5 className="mb-0 mt-3 para-font fw-bold">
                Connect with verified home repair and improvement professionals
              </h5>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-4 mb-4">
            <div className="col-inner shadow rounded-4 p-4 h-100 text-center bg-white points-collab-inner">
              <MonetizationOnIcon className="fs-50px text-primary icon-collab-sec"></MonetizationOnIcon>
              <h5 className="mb-0 mt-3 para-font fw-bold">
                Maximize home sales prices
              </h5>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="col-inner shadow rounded-4 p-4 h-100 text-center bg-white points-collab-inner">
              <CalendarMonthIcon className="fs-50px text-primary icon-collab-sec"></CalendarMonthIcon>
              <h5 className="mb-0 mt-3 para-font fw-bold">
                Minimize number of days on market
              </h5>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="col-inner shadow rounded-4 p-4 h-100 text-center bg-white points-collab-inner">
              <ScoreIcon className="fs-50px text-primary icon-collab-sec"></ScoreIcon>
              <h5 className="mb-0 mt-3 para-font fw-bold">
                Get tuned into market trends
              </h5>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SectionTwo;
