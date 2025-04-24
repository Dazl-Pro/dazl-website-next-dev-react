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
          <h3 className="text-uppercase  text-danger fw-bold">
            Welcome to Agent Dashboard
          </h3>
          For sellers' agents particularly, we know the work you do requires you
          to pivot quickly and to call on all your resources to craft and
          finalize the deal. Property roadblocks, like needed repairs or
          improvements, can impact the number of days on-market as well as the
          contract value. And it can consume your time and your resources.
          {/* <span
            style={{ cursor: "pointer" }}
            className="text-primary fw-bold"
            onClick={() => (localStorage.clear(), navigate("/"))}
          >
            Log Out
          </span> */}
          {/* <div className="row">
              <div className="col-md-4 mb-4">
                <div className="btn btn-primary w-100" onClick={()=>navigate("/agent/createPhd")} style={{cursor:"pointer"}}>Create a phd</div>
              </div>
              <div className="col-md-4 mb-4">
                <div className="btn btn-primary w-100" onClick={()=>(dispatch(filterProject()),navigate("/agent/phdproject"))} style={{cursor:"pointer"}}>Complete  phd</div>
              </div>
              <div className="col-md-4 mb-4">
                <div className="btn btn-primary w-100" onClick={()=>(dispatch(getAgentProfiledata(userId)),navigate("/agent/agentprofile"))} style={{cursor:"pointer"}}>Agent Profile</div>
              </div>
              <div className="col-md-4 mb-4 mb-md-0">
                <div className="btn btn-primary w-100" onClick={openProject} >Project Creation</div>
              </div>
              <div className="col-md-4 mb-4 mb-md-0">
                <div className="btn btn-primary w-100" onClick={()=>navigate("/agent/saveproject")}>Saved  phd</div>
              </div>
              <div className="col-md-4 mb-0">
                <div className="btn btn-primary w-100" onClick={()=> navigate("/agent/my-project")}>My project Agent</div>
              </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default AgentDashboard;
