import React from "react";
import { useDispatch } from "react-redux";
import {
  customerProfile,
  filterProject,
  getAgentProfiledata,
  getCompanyProfile,
} from "../../../store/dashboard/dashboardSlice";
import { useNavigate } from "react-router";

const AgentDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const userType = localStorage.getItem("userType");
  React.useEffect(() => {
    if (userType === "agent") {
      dispatch(getAgentProfiledata(userId));
    } else if (userType === "professional") {
      dispatch(getCompanyProfile(userId));
    } else {
      dispatch(customerProfile());
    }
  }, [userId]);

  return (
    <div className="py-0 min-vh-60">
      <div className="container-full">
        <h2 className="text-uppercase text-start mb-4 pb-4 border-bottom h3">
          welcome to Agent Dashboard
        </h2>
        <div className="text-start shadow-lg bg-white rounded-4 p-4 p-xl-5 text-center">
          <h3 className="text-uppercase text-danger fw-bold">
            Welcome to Agent Dashboard
          </h3>
          <p className="mb-0">
            At DAZL, we're here to help you
            <strong> maximize your seller’s home value</strong>, and{" "}
            <strong> reduce time on the market</strong>. By streamlining the
            process and
            <strong> eliminating buyer roadblocks</strong>, you can focus on
            getting top dollar for your listings—fast and efficiently.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AgentDashboard;
