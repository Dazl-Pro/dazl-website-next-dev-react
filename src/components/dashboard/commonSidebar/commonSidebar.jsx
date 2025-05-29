import React from "react";

import Nav from "react-bootstrap/Nav";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import FolderIcon from "@mui/icons-material/Folder";
import FolderSpecialIcon from "@mui/icons-material/FolderSpecial";
import ActiveCloseState, { useState } from "react";
import AddBoxIcon from "@mui/icons-material/AddBox";
import PersonIcon from "@mui/icons-material/Person";
import PeopleIcon from "@mui/icons-material/People";
import PostAddIcon from "@mui/icons-material/PostAdd";
import GradingIcon from "@mui/icons-material/Grading";
import TaskIcon from "@mui/icons-material/Task";
import "./commonSidebar.css";
import CommonProfile from "./commonProfile";

const CommonSidebar = ({ callback }) => {
  const userType = localStorage.getItem("userType");

  const handleClick = () => {
    callback();
  };

  return (
    <div className="dashboard-sidebar-main-inner rounded-4">
      <div className="col-inner dashboard-sidebar position-relative h-100">
        <div className="profile-infoo-side px-3 pb-4 d-flex align-items-center">
          <CommonProfile />
        </div>

        {userType === "agent" ? (
          <div className="flex-column">
            <Link
              className={`btn text-start sidebar-links ${
                location.pathname === "/agent/createPhd" ? "active-link" : ""
              }`}
              to="/agent/createPhd"
              onClick={handleClick}
            >
              <span className="btn icon-linkk lh-1 px-2 py-1 btn-primary me-2">
                <AddBoxIcon />
              </span>
              <span className="text-linkk">Create a phd</span>
            </Link>
            <Link
              className={`btn text-start sidebar-links ${
                location.pathname === "/agent/phdproject" ? "active-link" : ""
              }`}
              to="/agent/phdproject"
              onClick={handleClick}
            >
              <span className="btn icon-linkk lh-1 px-2 py-1 btn-primary me-2">
                <TaskIcon />
              </span>
              <span className="text-linkk">Completed phds</span>
            </Link>
            <Link
              className={`btn text-start sidebar-links ${
                location.pathname === "/agent/agentprofile" ? "active-link" : ""
              }`}
              to="/agent/agentprofile"
              onClick={handleClick}
            >
              <span className="btn icon-linkk lh-1 px-2 py-1 btn-primary me-2">
                <PersonIcon />
              </span>
              <span className="text-linkk">Agent Profile</span>
            </Link>
            <Link
              className={`btn text-start sidebar-links ${
                location.pathname === "/agent/createProject"
                  ? "active-link"
                  : ""
              }`}
              to="/agent/createProject"
              onClick={handleClick}
            >
              <span className="btn icon-linkk lh-1 px-2 py-1 btn-primary me-2">
                <PostAddIcon />
              </span>
              <span className="text-linkk">Project Creation</span>
            </Link>
            <Link
              className={`btn text-start sidebar-links ${
                location.pathname === "/agent/saveproject" ? "active-link" : ""
              }`}
              to="/agent/saveproject"
              onClick={handleClick}
            >
              <span className="btn icon-linkk lh-1 px-2 py-1 btn-primary me-2">
                <FolderSpecialIcon />
              </span>
              <span className="text-linkk">Saved phds</span>
            </Link>
            <Link
              className={`btn text-start sidebar-links ${
                location.pathname === "/agent/my-project" ? "active-link" : ""
              }`}
              to="/agent/my-project"
              onClick={handleClick}
            >
              <span className="btn icon-linkk lh-1 px-2 py-1 btn-primary me-2">
                <GradingIcon />
              </span>
              <span className="text-linkk">My project Agent</span>
            </Link>
          </div>
        ) : userType === "professional" ? (
          <div className="flex-column">
            <Link
              className={`btn text-start sidebar-links ${
                location.pathname === "/company/projectOpportunities"
                  ? "active-link"
                  : ""
              }`}
              to="/company/projectOpportunities"
              onClick={handleClick}
            >
              <span className="btn icon-linkk lh-1 px-2 py-1 btn-primary me-2">
                <CreateNewFolderIcon />
              </span>
              <span className="text-linkk">Project Opportunities</span>
            </Link>
            <Link
              className={`btn text-start sidebar-links ${
                location.pathname === "/company/companyProfile"
                  ? "active-link"
                  : ""
              }`}
              to="/company/companyProfile"
              onClick={handleClick}
            >
              <span className="btn icon-linkk lh-1 px-2 py-1 btn-primary me-2">
                <PeopleIcon />
              </span>
              <span className="text-linkk">My Company Profile</span>
            </Link>
          </div>
        ) : (
          <div className="flex-column">
            <Link
              className={`btn text-start sidebar-links ${
                location.pathname === "/homeOwner/create-project"
                  ? "active-link"
                  : ""
              }`}
              to="/homeOwner/create-project"
              onClick={handleClick}
            >
              <span className="btn icon-linkk lh-1 px-2 py-1 btn-primary me-2">
                <CreateNewFolderIcon />
              </span>
              <span className="text-linkk">Project Creation</span>
            </Link>
            <Link
              className={`btn text-start sidebar-links ${
                location.pathname === "/homeOwner/my-project"
                  ? "active-link"
                  : ""
              }`}
              to="/homeOwner/my-project"
              onClick={handleClick}
            >
              <span className="btn icon-linkk lh-1 px-2 py-1 btn-primary me-2">
                <FolderIcon />
              </span>
              <span className="text-linkk">My Projects</span>
            </Link>
            <Link
              className={`btn text-start sidebar-links ${
                location.pathname === "/homeOwner/my-info" ? "active-link" : ""
              }`}
              to="/homeOwner/my-info"
              onClick={handleClick}
            >
              <span className="btn icon-linkk lh-1 px-2 py-1 btn-primary me-2">
                <PersonIcon />
              </span>
              <span className="text-linkk">My Info</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommonSidebar;
