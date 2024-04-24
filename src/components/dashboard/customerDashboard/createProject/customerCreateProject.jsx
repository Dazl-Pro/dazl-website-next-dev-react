import React, { useEffect, useRef } from "react";
import "./customerCreateProject.css";
import Commonproject from "../../commonProject/project";

const CustomerCreateProject = () => {
  const [show, setShow] = React.useState(false);

  return (
    <div className="py-0 create-project-container-height">
      <div>
        <div className="d-flex border-bottom gap-2">
          <div>
            <button className="btn btn-primary btn-sm">yo</button>
          </div>
          <h2 className="text-uppercase text-start pb-4 h3">
            Project opportunities
          </h2>
        </div>
        <div className="">
          <div className="customer-create-project">
            <Commonproject show={show} setShow={setShow} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerCreateProject;
