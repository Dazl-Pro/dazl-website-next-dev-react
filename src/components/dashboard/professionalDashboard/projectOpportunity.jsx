import React, { useEffect, useState } from "react";
import "./professional.css";
import SendIcon from "@mui/icons-material/Send";
import { useDispatch, useSelector } from "react-redux";
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
  const [message, setMessage] = useState("");
  const [interested, setInterested] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isModalOptionSelected, setIsModalOptionSelected] = useState(false);

  console.log(message);

  useEffect(() => {
    dispatch(viewServicePhd(id))
      .unwrap()
      .then((res) => {
        console.log(res.reports.original.final);
        setData(res.reports.original.final);
      });
  }, [id]);

  const handleSendMail = () => {
    dispatch(
      sendMailHomeOwner({
        projectId: id,
        message,
        isInterested: interested,
        homeOwnerMail: data.customer.email,
        homeOwnerName: data.customer.first_name + " " + data.customer.last_name,
      })
    );
    if (dispatch) {
      Toastify({
        data: "success",
        msg: "Response Sent  successfully",
      });
      return;
    }
  };

  const deleteProject = (project_id) => {
    dispatch(
      deleteProfessionalProjects({
        project_id: project_id,
      })
    );
    if (dispatch) {
      Toastify({
        data: "success",
        msg: "Project delete  successfully",
      });
      return;
    }
  };

  const handleAnotherClick = () => {
    if (isModalOptionSelected) {
      handleSendMail();
    }
    setShowModal(true);
  };

  const handleButtonClick = () => {
    if (interested === true) {
      handleSendMail();
    } else if (interested === false) {
      setShowModal(true);
      handleAnotherClick();
    }
  };

  console.log(data);

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
              <p className="report-detaill d-flex flex-lg-nowrap flex-wrap flex-column flex-md-row align-items-md-center justify-content-between align-items-start">
                <span className="fw-semibold">Email Address:</span>{" "}
                <span className="w-50">{data?.customer?.email}</span>
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
          <div className="pt-3 flex w-full">
            {data?.roominfo.map((room, index) => (
              <div key={index} className="mb-4 col-md-6">
                <div className="flex-grow-1 mx-2 bg-custom-red-col bg-white shadow p-3 rounded-4">
                  <div className="d-flex  align-items-center justify-content-between">
                    <h3 className="fw-semibold font-18">
                      {index + 1}.) {room?.room_name}
                    </h3>
                    <h5 className="text-danger mb-0 me-md-4 me-2 font-16">
                      {room?.status}
                    </h5>
                  </div>
                  <div>
                    {/* {
                          items?.images?.filter(
                            (image) => image.room_id === roomId
                          )[0]?.description
                        } */}
                  </div>
                  <div className="ps-0 mb-4 mt-2">
                    <div key={index}>
                      <div className="d-flex gap-1 flex-wrap">
                        {/*
                            {imagesGroup?.map((image, imageIndex) => (
                              <div key={imageIndex}>
                                {image?.url && (
                                  <a
                                    href={image.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <img
                                      alt="img"
                                      src={image.url}
                                      className="object-fit-cover border"
                                      width={"100px"}
                                      height={"100px"}
                                    />
                                  </a>
                                )}{" "}
                              </div>
                            ))} */}
                      </div>
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
                                <div>{eleInner?.inspectionNotes}</div>
                              </div>
                              <div className="ps-0 mb-3">
                                <div className="d-flex gap-1">
                                  {eleInner?.images?.map(
                                    (image, imageIndex) => (
                                      <div key={imageIndex}>
                                        <a
                                          href={image}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                        >
                                          <img
                                            alt="img"
                                            src={image}
                                            className="object-fit-cover border"
                                            width={"100px"}
                                            height={"100px"}
                                          />
                                        </a>
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
                </div>
              </div>
            ))}
          </div>

          {/* <div className="col-md-4">
            <div className="colinner-image text-end">
              <img
                src="/src/assets/image.jpg"
                className=" img-fluid rounded"
              ></img>
            </div>
            <p className="pt-3  text-end">Lorem ipsum dolor sit amet.</p>
          </div> */}
        </div>
        <div
          className=" border-top p-3 mt-4 w-100 bg-lightgrey rounded message-box"
          id="MessageBox"
        >
          <div className="row ">
            <div className="col-md-3">
              <div className="inner-text">
                <label htmlFor="checkbox" className="fw-bold fs-3">
                  Your Response
                </label>
              </div>
            </div>
            <div className="col-md-6">
              <div className="inner-text pt-3 flex gap-4">
                <div>
                  <input
                    type="checkbox"
                    id="checkbox"
                    checked={interested === true}
                    onChange={() => setInterested(true)}
                    // onClick={() => setShowModal(false)}
                  />
                  <span className="fw-bold fs-6"> YES </span>, I'm interseted.
                </div>
                <div>
                  <input
                    type="checkbox"
                    id="checkbox"
                    checked={interested === false}
                    onChange={() => setInterested(false)}

                    // onClick={() => setShowModal(true)}
                    // checked={isModalOptionSelected}
                    // onChange={(e) => setIsModalOptionSelected(e.target.checked)}
                  />
                  <span className="fw-bold fs-6"> NO </span>, I'm not
                  interseted.{" "}
                </div>
              </div>
            </div>
            <div className="col-md-3 text-end">
              <button
                className="inner-text send-message d-flex align-items-center gap-2"
                // onClick={handleSendMail}
                onClick={handleButtonClick}
              >
                Send
                <SendIcon />
              </button>
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
                      deleteProject(data.project_id);
                      setShowModal(false);
                    }}
                    checked={isModalOptionSelected}
                    onChange={(e) => setIsModalOptionSelected(e.target.checked)}
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
                    onChange={(e) => setIsModalOptionSelected(e.target.checked)}
                    className="px-4"
                  >
                    No
                  </Button>
                </Modal.Footer>
              </Modal>
            </div>
          </div>
          <div className="message-box pt-4 " id="messageBox">
            <label htmlFor="message ">
              <span className="fw-bold fs-5">Message:</span>
            </label>
            <input
              type="text"
              id="message"
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectOpportunity;
