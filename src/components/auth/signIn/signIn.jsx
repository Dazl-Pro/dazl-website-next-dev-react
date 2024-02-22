import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./signIn.css"; // Import your CSS file for styling
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
const cardData = [
  {
    bgImage: "/images/shrinkCardimages/realtorBG.jpg",
    link: "/login/realtor",
    title: "DAZL IS FOR",
    subTitle: "real estate pros",
    login: "Log-In",
    pTitle: "REAL ESTATE PROFESSIONALS",
    p1: "For sellers' agents particularly, we know the work you do requires you to pivot quickly and to call on all your resources to craft and finalize the deal. Property roadblocks, like needed repairs or improvements, can impact the number of days on-market as well as the contract value. And it can consume your time and your resources.",
  },

  {
    bgImage: "/images/shrinkCardimages/proBG.jpg",
    link: "/login/professional",
    title: "DAZL IS FOR",
    subTitle: "service pros",
    login: "Log-In",
    pTitle: "SERVICE PROFESSIONALS",
    p1: "Dazl is an online tool that enables service pros to streamline their project requests and to evaluate opportunities more selectively. Dazl's project opportunity pipeline is populated through two channels:",
  },

  {
    bgImage: "/images/shrinkCardimages/customerBG.jpg",
    link: "/login/customer",
    title: "DAZL IS FOR",
    subTitle: "homeowners",
    login: "Log-In",
    pTitle: "HOMEOWNERS",
    p1: "Working in concert with sellers' agents, Dazl is an online tool designed to connect homeowners with licensed and approved* Missouri and Kansas service professionals for their home improvement or home repair needs. Based on project-specific details captured during the walk-thru, including photos and reports that itemize specific needs, Dazl identifies affiliate service pros that have demonstrated experience in the needed service areas and that have a geographic reach that coincides with the property's general location.",
  },
];

const SignIn = () => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [title, setTitle] = useState("");

  const handleClose = () => setShow(false);
  const handleShow = (title) => {
    setShow(true);
    setTitle(title);
  };
  return (
    <div className="login-all-type">
      <div className="card-container container py-5">
        {cardData.map((item, index) => (
          <div className="card border-0 shadow p-0 rounded-4" key={index}>
            <div
              className="card-image "
              style={{ backgroundImage: `url(${item?.bgImage})` }}
            >
              <div className="image-overlay position-absolute bottom-0 start-0 p-4 text-white w-100 h-100 d-flex align-items-end">
                <div>
                  <h6 className="pTitle fs-6 underline-red text-uppercase">
                    <span>{item?.title}</span>
                  </h6>
                  <h2 className="card-title text-uppercase">
                    {item?.subTitle}
                  </h2>
                  <button
                    className="read-more-button btn btn-light fw-medium text-uppercase mt-3 d-flex align-items-center"
                    onClick={() => navigate(item?.link)}
                  >
                    {item?.login} <NavigateNextIcon />
                  </button>
                </div>
              </div>
            </div>
            <div className="card-content">
              <h5 className="card-subtitle text-uppercase text-black mb-3">
                for <text className="text-danger">{item?.pTitle}</text> Dazl is
                a hub to:
              </h5>
              <div className="custom-list">
                <p className="mb-2">
                  <span className="custom-list-icon">&#x2022;</span> {item?.p1}
                </p>
                <Button
                  variant="primary"
                  onClick={() => handleShow(item.pTitle)}
                >
                  Read More
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Modal
        show={show}
        onHide={handleClose}
        className="myCustomMargin"
        size="xl"
        dialogClassName="modal-90w"
      >
        <Modal.Header>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-6 d-flex flex-column align-items-center justify-content-center">
              <div className="circle-container">1</div>
              <h5 className="text-danger">
                {title === "REAL ESTATE PROFESSIONALS"
                  ? "Diagnostic online tool"
                  : title === "SERVICE PROFESSIONALS"
                  ? "Real Estate Professionals"
                  : "Choose a service pro"}
              </h5>
              {title === "REAL ESTATE PROFESSIONALS" && (
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
                {title === "REAL ESTATE PROFESSIONALS"
                  ? "Dazl aggregates the various data points and the information surrounding potential property roadblocks identified during the walk-though. The result is a diagnostic report that takes into account the completion or correction of known issues and better predicts the contract value."
                  : title === "SERVICE PROFESSIONALS"
                  ? "While conducting the initial walk-through, sellers' agents deploy Dazl to create a report detailing the property's standard data and any identified property roadblocks to selling, like carpet condition, needed roof repairs, known plumbing issues, or general handyman services. Agents can also upload photographs and inspection reports to enable service pros to understand the projects' scopes of work more completely and to submit more accurate estimates on needed improvements or repairs."
                  : "Homeowners determine which service pros to communicate with, to seek proposals from, to coordinate schedules with, amd to engage with, allowing members to better control their selections of servicet ha professionals. Additionally, approved service providers agree to the Dazl service excellence commitment, which provides another layer of project delivery confidence."}
              </div>
            </div>
            <div className="col-6 d-flex flex-column align-items-center justify-content-center">
              <div className="circle-container">2</div>
              <h5 className="text-danger">
                {title === "REAL ESTATE PROFESSIONALS"
                  ? "Streamlines seller process"
                  : title === "SERVICE PROFESSIONALS"
                  ? "Homeowners"
                  : "My Info"}
              </h5>
              {title === "REAL ESTATE PROFESSIONALS" && (
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
                {title === "REAL ESTATE PROFESSIONALS"
                  ? "With endorsement by NARI and the HBA, Dazl was created by a life-long kansas City residential builder who understand the pain points and challenges of keeping projects moving and maximizing every dollar"
                  : title === "SERVICE PROFESSIONALS"
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
    </div>
  );
};

export default SignIn;
