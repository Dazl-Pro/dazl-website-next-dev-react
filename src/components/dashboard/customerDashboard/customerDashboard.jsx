import React from "react";
import PersonIcon from "@mui/icons-material/Person";
import { Link, useNavigate } from "react-router-dom";
import "./customerDashboard.css";
import {
  customerProfile,
  getAgentProfiledata,
  getCompanyProfile,
} from "../../../store/dashboard/dashboardSlice";
import { useDispatch } from "react-redux";

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
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
    <div className="py-0">
      <div className="">
        <div className="homeowners-container">
          <div className="content-container">
            <h1 className="text-uppercase text-start mb-4 pb-4 border-bottom h3">
              HOMEOWNERS
            </h1>
            <div className="dashboard-section shadow-lg bg-white rounded-4 p-4 p-xl-5 text-center">
              <h3 className="text-uppercase text-danger fw-bold ">
                Welcome to Homeowner Dashboard
              </h3>
              Dazl is an online tool designed to connect homeowners with
              licensed and approved* service professionals for their home
              improvement or home repair needs. Dazl identifies affiliate
              service pros that have demonstrated experience in the needed
              service areas and that have a geographic reach that coincides with
              the property's general location. Homeowners determine which
              service pros to communicate with, to seek proposals from, to
              coordinate schedules with, and to engage with, allowing members to
              better control their selections of services and professionals.
              Additionally, approved service providers agree to the Dazl service
              excellence commitment, which provides another layer of project
              delivery confidence. For members seeking inspiration for their
              next improvement projects. With endorsement by NARI and the HBA,
              DAZL was created by a life-long Kansas City residential builder
              who understands the pain points and challenges homeowners
              experience in the search for qualified contractors to entrust with
              one of their greatest investments.
              {/* <span
                style={{ cursor: "pointer" }}
                className="text-primary fw-bold"
                onClick={() => (localStorage.clear(), navigate("/"))}
              >
                Log Out
              </span> */}
              {/* <Link to="/home/customer/create-project"><button style={{color:"white"}} className="cus-btn btn btn-primary mw-200px w-100 mx-1 px-2"><PersonIcon /> Project Creation</button></Link> 
                <Link to="/home/customer/my-project"><button style={{color:"white"}} className="cus-btn btn btn-primary mw-200px w-100 mx-1"><PersonIcon /> My Projects</button></Link> 
                <Link to="/home/customer/my-info"><button style={{color:"white"}} className="cus-btn btn btn-primary mw-200px w-100 mx-1"><PersonIcon />My Info</button></Link>  */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
