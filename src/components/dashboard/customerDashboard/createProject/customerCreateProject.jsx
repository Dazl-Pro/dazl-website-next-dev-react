import React, { useEffect, useRef } from "react";
import "./customerCreateProject.css";
import Commonproject from "../../commonProject/project";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const CustomerCreateProject = () => {
  const [show, setShow] = React.useState(false);
  const [selectValue, setSelectvalue] = React.useState("");

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
            Project opportunities
          </h2>
        </div>
        <div className="">
          <div className="customer-create-project">
            <Commonproject
              show={show}
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
