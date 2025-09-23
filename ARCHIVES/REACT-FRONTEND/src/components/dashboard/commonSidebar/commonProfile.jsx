import React from "react";
import { useSelector } from "react-redux";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "./commonSidebar.css";

const CommonProfile = () => {
  const userType = localStorage.getItem("userType");
  const selector = useSelector((state) => state.dashboardSlice);
  const agentData = selector.data.agentData;
  const companydata = selector.data.companydata;
  const customerData = selector.data.customerData;

  let Name;

  if (userType === "agent") {
    Name = `${agentData?.first_name || ""} ${agentData?.last_name || ""}`;
  } else if (userType === "professional") {
    Name = companydata?.name || "";
  } else {
    Name = `${customerData?.first_name || ""} ${customerData?.last_name || ""}`;
  }

  return (
    <div className="d-flex align-items-center">
      <div>
        <LazyLoadImage
          alt="img"
          src="/images/sectionFourimage/01-Blog-Image.jpg"
          className="rounded-pill"
          width={"50px"}
          height={"50px"}
        />
      </div>
      <div className="ps-3 fw-bold profile-infoo-side-name">
        <p className="mb-0 text-white">{Name}</p>
      </div>
    </div>
  );
};

export default CommonProfile;
