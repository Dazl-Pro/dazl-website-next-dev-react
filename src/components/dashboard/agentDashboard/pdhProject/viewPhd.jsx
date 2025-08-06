import React from "react";
import Dialog from "@mui/material/Dialog";
import "./style.css";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch, useSelector } from "react-redux";
import {
  bidStatusUpdate,
  closeViewPhd,
} from "../../../../store/dashboard/dashboardSlice";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { styled } from "@mui/material/styles";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";
import SendIcon from "@mui/icons-material/Send";
import { Toastify } from "../../../../services/toastify/toastContainer";

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor:
      theme.palette.grey[theme.palette.mode === "light" ? 200 : 800],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: theme.palette.mode === "light" ? "#1a90ff" : "#308fe8",
  },
}));

const ViewPhd = () => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const selector = useSelector((state) => state.dashboardSlice);
  const viewPhdData = selector?.data?.viewPhd;
  const show = selector.data.show;
  const dispatch = useDispatch();

  // Assuming you want to set initialProgressBar to phdPrice for each room

  const [progressBar, setProgressBar] = React.useState(
    viewPhdData[0]?.phd_price
  );
  const [status, setStatus] = React.useState(["Bid", "D.I.Y", "Pass"]);
  const [progressBarpre, setProgressbarpre] = React.useState(
    viewPhdData[0]?.pre_price
  );
  const mainPrice = viewPhdData[0]?.phd_price;
  const onchangeStatus = (status, feature, room, index) => {
    dispatch(
      bidStatusUpdate({
        id: viewPhdData[0].project_id,
        status: status,
        feature: feature,
        room: room,
      })
    )
      .unwrap()
      .then((response) => {
        if (status == "Bid") {
          setProgressBar(Number(mainPrice) + 100000);
        }
        if (status == "Pass") {
          setProgressBar(Number(mainPrice) - 100000);
        }
        if (status == "D.I.Y") {
          setProgressBar(Number(mainPrice));
        }
      });
  };

  const sendEmail = () => {
    Toastify({
      data: "success",
      msg: "Project shared via Email  successfully",
    });
  };

  return (
    <>
      <Dialog
        fullScreen={fullScreen}
        open={show}
        onClose={() => dispatch(closeViewPhd(false))}
        aria-labelledby="responsive-dialog-title"
        className="bg-light-red cs-dialogg"
      >
        <div className="cs-dialogg-close">
          <CloseIcon onClick={() => dispatch(closeViewPhd(false))} />
        </div>

        <div className="popup1 cs-dialogg-container px-4 pb-4">
          <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom pt-4">
            <h3>PHD Report Summary</h3>

            <div className="d-flex align-items-center flex-column header-logo pe-4 me-4">
              <div
                className="small text-danger font-italic text-decoration-underline"
                style={{ fontStyle: "italic" }}
              >
                Powered by:
              </div>
              <LazyLoadImage
                alt="img"
                src="/images/footerImages/00-DAZL-logo-main.png"
                width={"70px"}
              />
            </div>
          </div>

          {viewPhdData.map((items, index) => {
            const dateString = items?.house?.updated_at;
            const dateObject = new Date(dateString);
            //   setprogressbar(parseInt(items?.phd_price))
            const year = dateObject.getFullYear();
            return (
              <>
                <div className="pb-3">
                  <p className="report-detaill d-flex flex-lg-nowrap flex-wrap flex-column flex-md-row align-items-md-center align-items-start">
                    <span className="fw-bold">Homeowners Name:</span>{" "}
                    <span className="ms-4">
                      {items?.customer?.first_name +
                        " " +
                        items?.customer?.last_name}
                    </span>
                  </p>
                  <p className="report-detaill d-flex flex-lg-nowrap flex-wrap flex-column flex-md-row align-items-md-center align-items-start">
                    <span className="fw-bold">Email Address:</span>{" "}
                    <span className="ms-5 ps-3">{items?.customer?.email}</span>
                  </p>
                  <p className="report-detaill d-flex flex-lg-nowrap flex-wrap flex-column flex-md-row align-items-md-center align-items-start mb-0">
                    <span className="fw-bold">Property Address: </span>
                    <span className="ms-4 ps-3">{items?.house?.address}</span>
                  </p>
                </div>
                <div className="report-detaill d-flex flex-lg-nowrap flex-wrap flex-column flex-md-row align-items-md-center align-items-start mb-0">
                  <h3>Dazl Value:</h3>
                  <h3 className="ms-4 ps-3">${viewPhdData[0].phd_price}</h3>
                </div>
                <div className="row mb-4">
                  <div className="col-md-6 d-flex flex-column">
                    <h3 className="">Property Details</h3>
                    <div className="bg-light-red rounded-3 p-3 h-100">
                      <p className="mb-2 d-flex justify-content-between">
                        {" "}
                        <span>Bed:</span> <span>{items?.house?.bedrooms}</span>
                      </p>
                      <p className="mb-2 d-flex justify-content-between">
                        {" "}
                        <span>Year:</span>{" "}
                        <span>{items?.house?.year_built}</span>
                      </p>
                      <p className="mb-2 d-flex justify-content-between">
                        {" "}
                        <span>Lot Size:</span>{" "}
                        <span>{items?.house?.lot_size}sqft</span>
                      </p>
                      <p className="mb-2 d-flex justify-content-between">
                        {" "}
                        <span>Property Type:</span>{" "}
                        <span>{items?.house?.foundation_type}</span>
                      </p>
                      <p className="mb-2 d-flex justify-content-between">
                        {" "}
                        <span>Date Updated:</span> <span>{year}</span>
                      </p>
                      <p className="mb-0 d-flex justify-content-between">
                        {" "}
                        <span>Bathrooms:</span>
                        <span> {items?.house?.bathrooms}</span>
                      </p>
                      {/* <p> Rooms: {items?.house?.bathrooms}</p> */}
                    </div>
                  </div>
                  <div className="col-md-6 d-flex flex-column">
                    <h3 className="">Room/Area Details</h3>
                    <div className="bg-light-red rounded-3 p-3 h-100">
                      <div className="border d-flex justify-content-center align-items-center flex-column my-2">
                        <p className="fw-bolder">Selling Advantage Notes</p>
                        <p>{items?.description}</p>
                      </div>
                      {items?.roominfo.map((ele, index) => {
                        return (
                          <div key={index}>
                            <div className="d-flex align-items-center justify-content-between">
                              <div className="fw-bolder">{ele?.room_name}</div>
                              <div className="text-danger">{ele?.status}</div>
                            </div>
                            <div className="d-flex align-items-center mt-2 mb-3">
                              <div className="fw-bolder">
                                {items?.roomtypedata?.[index]?.feature?.name}
                              </div>
                              :{" "}
                              {
                                items?.roomtypedata?.[index]?.feature_options
                                  ?.name
                              }
                            </div>
                          </div>
                        );
                      })}

                      <div className="container ps-0">
                        <div className="d-flex gap-1">
                          {items?.images.map((imageItem, index) => {
                            return (
                              <div key={index}>
                                <div>
                                  <a
                                    href={imageItem?.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <LazyLoadImage
                                      alt="img"
                                      src={imageItem?.url}
                                      className="object-fit-cover border"
                                      width={"100px"}
                                      height={"100px"}
                                    />
                                  </a>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="my-3 progress-slidee p-4 bg-light-red rounded-2">
                  <h3 className="text-center">
                    Buyer Road Blocks or Recommendations
                  </h3>
                  {items?.roominfo?.map((e, index) => {
                    return (
                      <div key={index}>
                        {e?.feature?.map((eleInner, eleindex) => {
                          return (
                            <div
                              key={index}
                              className="border border-dark p-3 mt-3 bg-white"
                            >
                              <h6 className="fw-bolder">
                                {eleInner?.feature_name}
                              </h6>
                              <p className="fst-normal">
                                Comments:{eleInner?.imageDesc}
                              </p>
                              <div style={{ display: "flex", gap: "10px" }}>
                                {status.map((status) => (
                                  <label
                                    key={status}
                                    className="custom-radio-label"
                                  >
                                    <input
                                      type="radio"
                                      name={`status-${eleindex}`}
                                      onChange={() =>
                                        onchangeStatus(
                                          status,
                                          eleInner.feature_id,
                                          e.room_id,
                                          eleindex
                                        )
                                      }
                                    />

                                    <span className="ps-2">{status}</span>
                                  </label>
                                ))}
                              </div>
                              <div className="d-flex justify-content-between mt-3 mb-2">
                                <p className="mb-0">$200k</p>
                                <p className="mb-0">
                                  ${(progressBar / 1000).toFixed(1) + "k"}
                                </p>
                                <p className="mb-0">$2M</p>
                              </div>
                              <BorderLinearProgress
                                variant="determinate"
                                value={(progressBar / 1800000) * 100}
                              />
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
                <div className="progress-slidee">
                  <div className="border border-dark p-3 mb-4">
                    <h3>Preliminary Value/Score</h3>
                    <div>
                      <div className="d-flex justify-content-between mt-3 mb-2">
                        <p className="mb-0">$200k</p>
                        <p className="mb-0">
                          ${(progressBarpre / 1000).toFixed(1) + "k"}
                        </p>
                        <p className="mb-0">$2M</p>
                      </div>
                      <BorderLinearProgress
                        variant="determinate"
                        value={(progressBarpre / 1800000) * 100}
                      />
                    </div>
                  </div>
                  <div className="value border border-dark p-3 mb-4">
                    <h3>PHD Value/Score</h3>
                    <div>
                      <div className="d-flex justify-content-between mt-3 mb-2">
                        <p className="mb-0">$200k</p>
                        <p className="mb-0">
                          ${(progressBarpre / 1000).toFixed(1) + "k"}
                        </p>
                        <p className="mb-0">$2M</p>
                      </div>
                      <BorderLinearProgress
                        variant="determinate"
                        value={(progressBarpre / 1800000) * 100}
                      />
                    </div>
                  </div>
                  {/* <div className="border border-dark p-3">
                    <h3>DAZL Value/Score</h3>
                    <div>
                      <div className="d-flex justify-content-between mt-3 mb-2">
                        <p className="mb-0">$200k</p>
                        <p className="mb-0">
                          ${(progressBar / 1000).toFixed(1) + "k"}
                        </p>
                        <p className="mb-0">$2M</p>
                      </div>
                      <BorderLinearProgress
                        variant="determinate"
                        value={(progressBar / 1800000) * 100}
                      />
                    </div>
                  </div> */}
                  <div className="d-flex justify-content-end ">
                    <button
                      type="submit"
                      className="d-flex items-center btn btn-primary mt-4 mb-2 gap-2"
                      onClick={sendEmail}
                    >
                      Send {<SendIcon />}
                    </button>
                  </div>
                </div>
              </>
            );
          })}
        </div>
      </Dialog>
    </>
  );
};

export default ViewPhd;
