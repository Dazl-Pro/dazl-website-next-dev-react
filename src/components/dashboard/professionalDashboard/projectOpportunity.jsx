import React, { useEffect, useState } from "react";
import "./professional.css";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardBody } from "reactstrap";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { Toastify } from "../../../services/toastify/toastContainer";
import {
  viewServicePhd,
  sendMailHomeOwner,
  deleteProfessionalProjects,
} from "../../../store/dashboard/dashboardSlice";
import "./style.css";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
const ProjectOpportunity = () => {
  const dispatch = useDispatch();
  const { id } = useParams();

  const [data, setData] = useState(null);
  console.log("----Data", data?.projectopportunities?.[0]?.is_interested);
  const [showModal, setShowModal] = useState(false);
  const [isModalOptionSelected, setIsModalOptionSelected] = useState(false);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [checkboxName, setCheckboxName] = useState("");

  const [showModal2, setShowModal2] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState(null);
  const [selectedRoomIds, setSelectedRoomIds] = useState(null);

  const navigate = useNavigate();

  const openModal = (image) => {
    setSelectedImage(image);
  };

  const closeModal = () => {
    setSelectedImage(null);
    setIsViewerOpen(false);
  };
  useEffect(() => {
    dispatch(viewServicePhd(id))
      .unwrap()
      .then((res) => {
        setData(res.reports.original.final);
      });
  }, [id]);

  const handleSendMail = (interested) => {
    dispatch(
      sendMailHomeOwner({
        projectId: id,
        isInterested: interested,
        homeOwnerMail: data.customer.email,
        homeOwnerName: data.customer.first_name + " " + data.customer.last_name,
      })
    );
    Toastify({
      data: "success",
      msg: "Response Sent successfully",
    });
    // } else {
    //   console.log("No room selected or room IDs are missing");
    // }
  };

  const deleteProject = (ids, project_id) => {
    dispatch(
      deleteProfessionalProjects({
        roomId: ids,
        project_id: project_id,
      })
    );
    navigate("/company/projectOpportunities");
    if (dispatch) {
      Toastify({
        data: "success",
        msg: "Project delete  successfully",
      });
      return;
    }
  };

  const handleButtonClick = (interested) => {
    // setInterested();
    handleSendMail(interested);
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);

    // Options for formatting the date
    const options = { year: "numeric", month: "long", day: "numeric" };

    // Format the date
    return date.toLocaleDateString("en-US", options);
  };

  return (
    <div className="py-0">
      <div className="">
        <h2 className="text-uppercase text-start pb-2 border-bottom h3">
          Project opportunity
        </h2>
      </div>
      <div className="pt-4">
        <div className="row">
          <div className="col-inner h-100 bg-image-box2  position-relative rounded-4">
            <div className="p-4 h-100 position-relative z-1">
              <p className="report-detaill d-flex flex-lg-nowrap flex-wrap flex-column flex-md-row align-items-md-center justify-content-between align-items-start">
                <span className="fw-semibold">Homeowners Name: </span>
                <span className="w-50">
                  {data?.customer?.first_name + " " + data?.customer?.last_name}
                </span>
              </p>
              {data?.customer?.house?.address && (
                <p className="report-detaill d-flex flex-lg-nowrap flex-wrap flex-column flex-md-row align-items-md-center justify-content-between align-items-start mb-0">
                  <span className="fw-semibold">Property Address: </span>
                  <span className="w-50">{data?.customer?.house?.address}</span>
                </p>
              )}
              <div className="report-detaill d-flex flex-lg-nowrap flex-wrap flex-column flex-md-row align-items-md-center justify-content-between align-items-start mb-0">
                <h3>Created At:</h3>
                <h3 className="w-50">
                  {formatDate(data?.customer?.updated_at)}
                </h3>
              </div>
            </div>
          </div>

          {/* *************  interest card */}

          <div className="row p-4">
            <Card className="shadow-lg m-2 p-4 border-0 bg-danger text-white ">
              <CardBody>
                <h5 className="mb-3">Are you interested?</h5>
                <div className="d-flex flex-column gap-3">
                  <label className="d-flex align-items-center">
                    <input
                      type="checkbox"
                      checked={checkboxName === "yes"}
                      onChange={() => {
                        // setInterested(true);
                        setCheckboxName((prev) => {
                          const newValue = prev === "yes" ? "" : "yes";
                          if (newValue === "yes") {
                            handleButtonClick(true);
                          }
                          return newValue;
                        });
                      }}
                    />
                    <span className="fw-bold fs-6 ms-2">YES</span>, I'm
                    interested.
                  </label>

                  <label className="d-flex align-items-center">
                    <input
                      type="checkbox"
                      checked={checkboxName === "no"}
                      onChange={() => {
                        // setInterested(false);
                        setCheckboxName((prev) => {
                          const newValue = prev === "no" ? "" : "no";
                          if (newValue === "no") {
                            handleButtonClick(false);
                          }
                          return newValue;
                        });
                      }}
                    />
                    <span className="fw-bold fs-6 ms-2">NO</span>, I'm not
                    interested.
                  </label>
                </div>
              </CardBody>
            </Card>
          </div>

          {/* **************************** */}

          <div className="pt-3 flex w-full">
            {data?.roominfo.map((room, index) => (
              <div key={index} className="mb-4 col-lg-12">
                <div className="flex-grow-1 mx-2 bg-custom-red-col bg-white shadow p-3 rounded-4 ">
                  <div className="d-flex  align-items-center justify-content-between ">
                    <h3 className="fw-semibold font-18">
                      {index + 1}.) {room?.room_name}
                    </h3>
                    <h5 className="text-danger mb-0 me-md-4 me-2 font-16">
                      {room?.status}
                    </h5>
                  </div>

                  <div></div>
                  <div className="ps-0 mb-4 mt-2">
                    <div key={index}>
                      <div className="d-flex gap-1 flex-wrap"></div>
                    </div>
                  </div>
                  {room?.feature?.length !== 0 &&
                    room?.feature[0]?.feature_name !== "" && (
                      <div
                        key={index}
                        className="p-3 mt-3 bg-white"
                        style={{
                          border: "1px solid",
                          borderColor: "#666",
                          borderRadius: "10px",
                          margin: "10px",
                        }}
                      >
                        {room?.feature?.map((eleInner, eleindex) => {
                          return (
                            <div key={eleindex}>
                              <h3 className=" mb-2 ms-2">
                                {eleInner.feature_name}:
                              </h3>
                              <div className="border d-flex align-items-center ps-2 py-3 mb-3 ">
                                <div>{eleInner?.imageDesc}</div>
                              </div>
                              <div className="ps-0 mb-3">
                                <div className="d-flex gap-1">
                                  {eleInner?.images?.map(
                                    (image, imageIndex) => (
                                      <div key={imageIndex}>
                                        {/* <div
                                          onClick={() => {
                                            setIsViewerOpen(true);
                                          }}
                                        > */}
                                        <img
                                          alt="img"
                                          src={image}
                                          className="object-fit-cover border"
                                          width={"100px"}
                                          height={"100px"}
                                          onClick={() => {
                                            setSelectedImageUrl(image);
                                            setShowModal2(true);
                                          }}
                                        />
                                        {/* </div> */}
                                        {/* {selectedImage === image && (
                                          <ModalImage
                                            small={image}
                                            large={image}
                                            alt="Full Size"
                                            hideDownload={true}
                                            isOpen={isViewerOpen}
                                            onClose={closeModal}
                                            className="m-2 object-fit-cover border"
                                            style={{
                                              maxWidth: "100%",
                                              maxHeight: "100%",
                                              width: "auto",
                                              height: "auto",
                                            }}
                                          />
                                        )} */}
                                      </div>
                                    )
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                  <div className="row ">
                    <div className="col-md-3 text-end">
                      <Modal
                        show={showModal}
                        onHide={() => setShowModal(false)}
                        centered
                      >
                        <Modal.Header closeButton>
                          <Modal.Title>Delete Project</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                          <div className="text-center fs-5">
                            Are you sure you want to delete this project?
                          </div>
                        </Modal.Body>
                        <Modal.Footer>
                          <Button
                            variant="primary"
                            onClick={() => {
                              deleteProject(room.room_id, data.project_id);
                              setShowModal(false);
                            }}
                            checked={isModalOptionSelected}
                            onChange={(e) =>
                              setIsModalOptionSelected(e.target.checked)
                            }
                            className="px-4"
                          >
                            Yes
                          </Button>
                          <Button
                            variant="secondary"
                            onClick={() => {
                              handleSendMail();
                              setShowModal(false);
                            }}
                            checked={isModalOptionSelected}
                            onChange={(e) =>
                              setIsModalOptionSelected(e.target.checked)
                            }
                            className="px-4"
                          >
                            No
                          </Button>
                        </Modal.Footer>
                      </Modal>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Modal show={showModal2} onHide={() => setShowModal2(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Show Image</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <img
            // src={img}
            src={selectedImageUrl}
            alt="Modal Image"
            style={{
              width: "60%",
              height: "50%",
              margin: "0 auto",
              display: "flex",
            }}
          />
        </Modal.Body>
        <Modal.Footer>
          {/* <Button variant="secondary" onClick={() => setShowModal2(false)}>
            Close
          </Button> */}
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ProjectOpportunity;
