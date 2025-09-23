import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./card.css";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

const ShrinkCard = (props) => {
  const { title, index, navigate } = props;

  const location = useLocation();
  const navigateRoute = useNavigate();
  const [titles, setTitle] = useState("");
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);

  const handleShow = (titles) => {
    setShow(true);
    setTitle(titles);
  };
  return (
    <>
      <div
        className={`rounded-top-4 cards-dazll z-1 ${
          index == 0 ? "firstCard" : index == 1 ? "secondCard" : "thirdCard"
        } `}
      >
        <div className="imgg-card-inner rounded-4 position-absolute top-0 start-0 w-100 h-100 d-flex align-items-end p-4 text-white">
          <div className="imgg-card-inner1 position-relative z-1 rounded-bottom-0">
            <h6 className="fs-6 underline-red">
              <span className="position-relative z-1">DAZL IS FOR</span>
            </h6>
            <h3 className="text-uppercase">{title}</h3>

            <button
              className="btn btn-light fw-medium d-flex align-items-center"
              onClick={() => navigateRoute(`${navigate}`)}
            >
              SIGN UP <NavigateNextIcon />
            </button>
          </div>
        </div>
      </div>
      {index === 0 && (
        <div
          className=" position-relative z-1 custom-height-card bg-white"
          style={{
            borderBottomLeftRadius: "1rem",
            borderBottomRightRadius: "1rem",
          }}
        >
          <div className="lower-contet-signupp">
            <h5 className=" text-uppercase text-black mb-3">
              for <text className="text-danger">REAL ESTATE PROFESSIONALS</text>{" "}
              Dazl is a hub to:
            </h5>
            <div className="custom-list">
              <p className="mb-2">
                <span className="custom-list-icon">&#x2022;</span> More
                accurately determine listing prices
              </p>
              <p className="mb-2">
                <span className="custom-list-icon">&#x2022;</span> Identify and
                quickly correct property deficiencies using qualified service
                pros
              </p>
              <p className="mb-2">
                <span className="custom-list-icon">&#x2022;</span> Maximize
                sales prices with fewer days-on-market
              </p>
              <Button
                className="mb-2"
                variant="primary"
                onClick={() => handleShow("REAL ESTATE PROFESSIONALS")}
              >
                Read More
              </Button>
            </div>
          </div>
        </div>
      )}
      {index === 1 && (
        <div
          className=" position-relative z-1 bg-white custom-height-card"
          style={{
            borderBottomLeftRadius: "1rem",
            borderBottomRightRadius: "1rem",
          }}
        >
          <div className="lower-contet-signupp">
            <h5 className=" text-uppercase text-black mb-3">
              for <text className="text-danger">SERVICE PROFESSIONALS</text>{" "}
              Dazl is a hub to:
            </h5>
            <div className="custom-list">
              <p className="mb-2">
                <span className="custom-list-icon">&#x2022;</span> Streamline
                project pipelines and intake processes
              </p>
              <p className="mb-2">
                <span className="custom-list-icon">&#x2022;</span> Selectively
                evaluate project scopes of work
              </p>
              <p className="mb-2">
                <span className="custom-list-icon">&#x2022;</span>{" "}
                Geographically focus project opportunities
              </p>
              <Button
                className="mb-2"
                variant="primary"
                onClick={() => handleShow("SERVICE PROFESSIONALS")}
              >
                Read More
              </Button>
            </div>
          </div>
        </div>
      )}
      {index === 2 && (
        <div
          className=" position-relative z-1 bg-white custom-height-card"
          style={{
            borderBottomLeftRadius: "1rem",
            borderBottomRightRadius: "1rem",
          }}
        >
          <div className="lower-contet-signupp">
            <h5 className=" text-uppercase text-black mb-3">
              for <text className="text-danger">HOMEOWNERS</text> Dazl is a hub
              to:
            </h5>
            <div className="custom-list">
              <p className="mb-2">
                <span className="custom-list-icon">&#x2022;</span> Resolve tha
                pain points in the search for qualified contractors
              </p>
              <p className="mb-2">
                <span className="custom-list-icon">&#x2022;</span> Connect
                quickly with service pros to
              </p>
              <p className="mb-2">
                <span className="custom-list-icon">&#x2022;</span> Seek project
                inspiration ,discover tips collaborate with service
                professionals
              </p>
              <Button
                className="mb-2"
                variant="primary"
                onClick={() => handleShow("HOMEOWNERS")}
              >
                Read More
              </Button>
            </div>
          </div>
        </div>
      )}
      <Modal
        show={show}
        onHide={handleClose}
        className="myCustomMargin"
        size="xl"
        dialogClassName="modal-90w"
      >
        <Modal.Header>
          <Modal.Title>{titles}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-6 d-flex flex-column align-items-center justify-content-center">
              <div className="circle-container">1</div>
              <h5 className="text-danger">
                {titles === "REAL ESTATE PROFESSIONALS"
                  ? "Diagnostic online tool"
                  : titles === "SERVICE PROFESSIONALS"
                  ? "Real Estate Professionals"
                  : "Choose a service pro"}
              </h5>
              {titles === "REAL ESTATE PROFESSIONALS" && (
                <div className="custom-list">
                  <p>
                    Dazl is a diagnostic online tool designed for sellers'
                    agents to quickly:
                  </p>
                  <div className="mb-2 ">
                    <span className="custom-list-icon">&#x2022;</span> Deploy at
                    the time of a property walk-through
                  </div>
                  <p className="mb-2">
                    <span className="custom-list-icon">&#x2022;</span> Capture
                    standard data points like square footage and the number of
                    bedrooms and bathrooms
                  </p>
                  <p className="mb-2">
                    <span className="custom-list-icon">&#x2022;</span> Record
                    project-specific input surrounding any potential property
                    roadblocks to selling, like carpet conditions, roof repairs,
                    known plumbing issues, or needed general household services.
                  </p>
                </div>
              )}
              <div>
                {titles === "REAL ESTATE PROFESSIONALS"
                  ? "Dazl aggregates the various data points and the information surrounding potential property roadblocks identified during the walk-though. The result is a diagnostic report that takes into account the completion or correction of known issues and better predicts the contract value."
                  : titles === "SERVICE PROFESSIONALS"
                  ? "While conducting the initial walk-through, sellers' agents deploy Dazl to create a report detailing the property's standard data and any identified property roadblocks to selling, like carpet condition, needed roof repairs, known plumbing issues, or general handyman services. Agents can also upload photographs and inspection reports to enable service pros to understand the projects' scopes of work more completely and to submit more accurate estimates on needed improvements or repairs."
                  : "Homeowners determine which service pros to communicate with, to seek proposals from, to coordinate schedules with, amd to engage with, allowing members to better control their selections of servicet ha professionals. Additionally, approved service providers agree to the Dazl service excellence commitment, which provides another layer of project delivery confidence."}
              </div>
            </div>
            <div className="col-6 d-flex flex-column align-items-center justify-content-center">
              <div className="circle-container">2</div>
              <h5 className="text-danger">
                {titles === "REAL ESTATE PROFESSIONALS"
                  ? "Streamlines seller process"
                  : titles === "SERVICE PROFESSIONALS"
                  ? "Homeowners"
                  : "My Info"}
              </h5>
              {titles === "REAL ESTATE PROFESSIONALS" && (
                <div className="custom-list">
                  <p>
                    Also, Dazl allows real estate professionals and their
                    sellers to:
                  </p>
                  <p className="mb-2 ">
                    <span className="custom-list-icon">&#x2022;</span>Create
                    exortable project requests for service that can be sent to
                    prequalified service professionals for feedback and bidding
                  </p>
                  <p className="mb-2">
                    <span className="custom-list-icon">&#x2022;</span>Upload
                    photos that detail the identified issues
                  </p>
                  <p className="mb-2">
                    <span className="custom-list-icon">&#x2022;</span>Engage
                    service providers whose estimates are in line with your
                    client's budget and whose availability has already been
                    confirmed
                  </p>
                  <p className="mb-2">
                    <span className="custom-list-icon">&#x2022;</span>Move
                    through the selling process by reducing seller roadblocks
                  </p>
                  <p className="mb-2">
                    <span className="custom-list-icon">&#x2022;</span>Maximize
                    sales prices with fewer days on the market
                  </p>
                </div>
              )}
              <div>
                {titles === "REAL ESTATE PROFESSIONALS"
                  ? "With endorsement by NARI and the HBA, Dazl was created by a life-long kansas City residential builder who understand the pain points and challenges of keeping projects moving and maximizing every dollar"
                  : titles === "SERVICE PROFESSIONALS"
                  ? "Owners deploy Dazl to upload photos and other documentation to create project requests. As an approved Dazl service provider and member, and based on your geographic preferences and areas of expertise, Dazl will generate service project opportunities for your business to respond to or to decline. With endorsement by NARI and the HBA, Dazl was created by a life-long Kansas City residential builder who understands the pain points and challenges of keeping projects moving and ensuring team members are working consistently."
                  : "For members seeking inspiration for their next improvement projects, Dazl Inspired is an online resource to discover trends and tips, and it is a space to create interest boards for ideas, collaboration, and inspiration during project design and pricing. With endorsement by NARI and the HBA,DAZL was created by a life-long Kansas City residential builder who understands the pain points and challenges homeowners experience in the search for qualified contractors to entrust with one of their greatest investments."}
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default ShrinkCard;
