import React, { useEffect, useRef } from "react";
import "./customerCreateProject.css";
import Commonproject from "../../commonProject/project";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const CustomerCreateProject = () => {
  const [show, setShow] = React.useState(false);
  const [selectValue, setSelectvalue] = React.useState("");
  const [name, setName] = React.useState("");

  return (
    <div className="py-0 create-project-container-height">
      <div>
        <div className="d-flex border-bottom gap-2">
          <div>
            {show && (
              <button
                className="btn btn-primary btn-sm"
                onClick={() => {
                  setSelectvalue("");
                  setShow(false);
                  localStorage.removeItem("roomselect");
                  localStorage.removeItem("roomId");
                  localStorage.removeItem("value");
                }}
              >
                <ArrowBackIcon />
              </button>
            )}
          </div>
          <h2 className="text-uppercase text-start pb-3 h3">
            Project Creation
          </h2>
        </div>
        <div className="col-md-6">
          <label htmlFor="projectName" className="mt-2">
            Project Name:
          </label>
          <input
            type="text"
            placeholder="Enter project name"
            required
            onChange={(e) => setName(e.target.value)}
            className="form-control mt-2"
          />
          <div className="customer-create-project">
            <Commonproject
              show={show}
              name={name}
              setShow={setShow}
              selectValue={selectValue}
              setSelectvalue={setSelectvalue}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerCreateProject;
