import React, { useEffect, useState } from "react";
import "./professional.css";
import SendIcon from "@mui/icons-material/Send";
import { useDispatch, useSelector } from "react-redux";

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
import ModalImage from "react-modal-image";
const ProjectOpportunity = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  // console.log(id);

  const [data, setData] = useState(null);
  // const [roomIds, setRoomIds] = useState([]);
  // const [message, setMessage] = useState("");
  const [interested, setInterested] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isModalOptionSelected, setIsModalOptionSelected] = useState(false);
  const [delShow, setDelShow] = React.useState(false);
  const [chooseShow, setChooseShow] = React.useState(false);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const [showModal2, setShowModal2] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState(null);
  const [selectedRoomIds, setSelectedRoomIds] = useState(null);

  const navigate = useNavigate();
  // console.log(message);

  const openModal = (image) => {
    setSelectedImage(image);
    // setIsViewerOpen(true);
  };

  // const closeViewer = () => {
  //   setSelectedImage(null);
  //   setIsViewerOpen(false);
  // };
  const closeModal = () => {
    setSelectedImage(null);
    setIsViewerOpen(false);
  };
  useEffect(() => {
    dispatch(viewServicePhd(id))
      .unwrap()
      .then((res) => {
        console.log(res.reports.original.final);
        console.log(res.reports.original.final.roominfo[0].room_id);
        // const roomIdsArray = res.reports.original.final.roominfo
        //   .map((item) => item.room_id)
        //   .flat();
        // console.log(roomIdsArray);
        // setRoomIds(roomIdsArray);
        setData(res.reports.original.final);
      });
  }, [id]);

  // const handleSendMail = () => {
  //   if (selectedRoomIds.length === 0) {
  //     console.log("No rooms selected.");
  //     return; // Prevent dispatch if no rooms are selected
  //   }
  //   dispatch(
  //     sendMailHomeOwner({
  //       projectId: selectedRoomIds,
  //       // message,
  //       isInterested: interested,
  //       homeOwnerMail: data.customer.email,
  //       homeOwnerName: data.customer.first_name + " " + data.customer.last_name,
  //     })
  //   );
  //   if (dispatch) {
  //     Toastify({
  //       data: "success",
  //       msg: "Response Sent  successfully",
  //     });
  //     return;
  //   }
  //   // navigate("/company/projectOpportunities");
  // };

  const handleSendMail = (ids) => {
    // console.log(ids);
    if (ids) {
      dispatch(
        sendMailHomeOwner({
          projectId: id, // Use selected room id
          roomId: ids,
          isInterested: true,
          homeOwnerMail: data.customer.email,
          homeOwnerName:
            data.customer.first_name + " " + data.customer.last_name,
        })
      );
      Toastify({
        data: "success",
        msg: "Response Sent successfully",
      });
    } else {
      console.log("No room selected or room IDs are missing");
    }
  };

  // const deleteProject = (project_id) => {
  //   console.log("-----------", project_id);
  //   dispatch(
  //     deleteProfessionalProjects({
  //       project_id: project_id,
  //     })
  //   );
  //   navigate("/company/projectOpportunities");
  //   if (dispatch) {
  //     Toastify({
  //       data: "success",
  //       msg: "Project delete  successfully",
  //     });
  //     return;
  //   }
  // };
  const deleteProject = (ids) => {
    console.log("-----------", ids);
    dispatch(
      deleteProfessionalProjects({
        roomId: ids,
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
  const handleAnotherClick = (ids) => {
    if (isModalOptionSelected) {
      handleSendMail(ids);
    }
    setShowModal(true);
  };

  const handleButtonClick = (ids, interested) => {
    console.log("Button clicked, interested:", interested);
    // Call the appropriate function based on the value of 'interested'
    if (interested === true) {
      handleSendMail(ids);
    } else if (interested === false) {
      setShowModal(true);
      handleAnotherClick(ids);
    }
  };
  // const handleButtonClick = (roomId, isInterested = true) => {
  //   setSelectedRoomIds((prevSelectedRoomIds) => {
  //     if (isInterested) {
  //       // Add the roomId if it's not already in the list
  //       handleSendMail();
  //       return [...prevSelectedRoomIds, roomId];
  //     } else {
  //       // Remove the roomId from the list if it's already there
  //       return prevSelectedRoomIds.filter((id) => id !== roomId);
  //     }
  //   });
  // };
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
              {/* <p className="report-detaill d-flex flex-lg-nowrap flex-wrap flex-column flex-md-row align-items-md-center justify-content-between align-items-start">
                <span className="fw-semibold">Email Address:</span>{" "}
                <span className="w-50">{data?.customer?.email}</span>
              </p> */}
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

                  <div>
                    {/* {
                      room?.images?.filter(
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
                    {/* <div className="col-md-3">
                      <div className="inner-text">
                        <label htmlFor="checkbox" className="fw-bold fs-3">
                          Your Response
                        </label>
                      </div>
                    </div> */}
                    <div className="col-md-6">
                      <div className="inner-text pt-3 flex gap-4">
                        <div>
                          <div className="gap-2">
                            <input
                              type="checkbox"
                              id="checkbox"
                              // checked={interested === true}
                              // checked={selectedRoomIds(room.room_id)}
                              // onChange={() => {
                              //   // setInterested(true);
                              //   handleButtonClick();
                              // }}
                              // onChange={() => handleCheckboxChange(room.room_id)}
                              // onClick={() => setShowModal(false)}
                              onChange={() => {
                                setSelectedRoomIds(room.room_id); // Set the room_id of the selected room
                                handleButtonClick(room.room_id, true);
                              }}
                            />
                            <span className="fw-bold fs-6"> YES </span>, I'm
                            interseted.
                            <input
                              type="checkbox"
                              id="checkbox"
                              // checked={interested === false}
                              // onChange={() => setInterested(false)}

                              // onClick={() => setShowModal(true)}
                              // checked={isModalOptionSelected}
                              // onChange={(e) => setIsModalOptionSelected(e.target.checked)}
                              onChange={() => {
                                setSelectedRoomIds(room.room_id); // Set the room_id of the selected room
                                handleButtonClick(room.room_id, false);
                              }}
                            />
                            <span className="fw-bold fs-6"> NO </span>, I'm not
                            interseted.{" "}
                          </div>
                        </div>
                        {/* <div>
                          <input
                            type="checkbox"
                            id="checkbox"
                            // checked={interested === false}
                            // onChange={() => setInterested(false)}

                            // onClick={() => setShowModal(true)}
                            // checked={isModalOptionSelected}
                            // onChange={(e) => setIsModalOptionSelected(e.target.checked)}
                            onChange={() => {
                              setSelectedRoomIds(room.room_id); // Set the room_id of the selected room
                              handleButtonClick(room.room_id, false);
                            }}
                          />
                          <span className="fw-bold fs-6"> NO </span>, I'm not
                          interseted.{" "}
                        </div> */}
                      </div>
                    </div>
                    <div className="col-md-3 text-end">
                      {/* <button
                        className="inner-text send-message d-flex align-items-center gap-2"
                        // onClick={handleSendMail}
                        onClick={handleButtonClick}
                      >
                        Send
                        <SendIcon />
                      </button> */}
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
                              deleteProject(room.room_id);
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
        {/* <div
          className=" border-top p-3 mt-4 w-100 bg-lightgrey rounded message-box"
          id="MessageBox"
        > */}
        {/* <div className="row ">
            <div className="col-md-3">
              <div className="inner-text">
                <label htmlFor="checkbox" className="fw-bold fs-3">
                  Your Response
                </label>
              </div>
            </div> */}
        {/* <div className="col-md-6">
              <div className="inner-text pt-3 flex gap-4"> */}
        {/* <div>
                  <input
                    type="checkbox"
                    id="checkbox"
                    checked={interested === true}
                    onChange={() => setInterested(true)}
                    // onClick={() => setShowModal(false)}
                  />
                  <span className="fw-bold fs-6"> YES </span>, I'm interseted.
                </div> */}
        {/* <div>
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
                </div> */}
        {/* </div>
            </div> */}
        {/* <div className="col-md-3 text-end">
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
            </div> */}
        {/* </div> */}

        {/* </div> */}
      </div>
      {/* <div className="message-box pt-4 " id="messageBox">
            <label htmlFor="message ">
              <span className="fw-bold fs-5">Message:</span>
            </label>
            <input
              type="text"
              id="message"
              onChange={(e) => setMessage(e.target.value)}
            />
          </div> */}
      <Modal show={showModal2} onHide={() => setShowModal2(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Show Image</Modal.Title>
          {/* <Button variant="link" onClick={() => handleDownload(image)}>
            Download
          </Button> */}
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
