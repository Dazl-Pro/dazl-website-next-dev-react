import React, { useState } from "react";
import EditPhd from "./editPhd";
import CommonRoomform from "../../commonForm/commonRoomForm";
import "./style.css";

const EditAddRoom = () => {
  const [show, setShow] = useState(true);
  const [selectValue, setSelectvalue] = React.useState("");

  return (
    <div className="py-0 rooms-container-height d-block min-vh-auto">
      <div className="content-full">
        <h3 className="mb-4 pb-4 border-bottom">Edit PHD and Project </h3>
        <div>
          {show && (
            <EditPhd setShow={setShow} setSelectvalue={setSelectvalue} />
          )}
          {!show && (
            <>
              <div className="">
                <h4>Add Room </h4>
                <div className="customer-create-project">
                  <CommonRoomform
                    setShow={setShow}
                    selectValue={selectValue}
                    setSelectvalue={setSelectvalue}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditAddRoom;
