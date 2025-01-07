/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useRef } from "react";

import "./style.css";

import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate, useLocation } from "react-router-dom";

import Masonry from "@mui/lab/Masonry";
import SaveIcon from "@mui/icons-material/Save";
import Slider from "@mui/material/Slider";
import {
  bidStatusUpdate,
  mailPdf,
  viewPhdAlt,
} from "../../../../store/dashboard/dashboardSlice";
import { styled } from "@mui/material/styles";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";
import SendIcon from "@mui/icons-material/Send";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { Toastify } from "../../../../services/toastify/toastContainer";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Box, Typography } from "@mui/material";
import { Formik, Field, Form, ErrorMessage, FieldArray } from "formik";
// import { useParams, useNavigate } from "react-router-dom";

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

const ViewPhdAlt = ({
  ele,
  index,
  // allStatus,
  // onchangeStatus,
  // setCurrentStatus,
}) => {
  // const marks = [
  //   {
  //     value: 1,
  //     toolTip: "They walk in and first impression is Hell Naw! Walk Away...!",
  //   },
  //   {
  //     value: 2,
  //     toolTip: "Ok we can work with this...",
  //   },
  //   {
  //     value: 3,
  //     toolTip: "I've seen worst...",
  //   },
  //   {
  //     value: 4,
  //     toolTip: "Market Ready!",
  //   },
  //   {
  //     value: 5,
  //     toolTip: "This is Nice!",
  //   },
  //   {
  //     value: 6,
  //     toolTip: "Oh yeah... This looks good!",
  //   },
  //   {
  //     value: 7,
  //     toolTip: "Wow this has it all!",
  //   },
  //   {
  //     value: 8,
  //     toolTip: "I have to have this for myself!",
  //   },
  // ];
  const componentRef = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { itemId } = useParams();
  const selector = useSelector((state) => state.dashboardSlice);
  const viewPhdData = selector?.data?.viewPhdAlt;
  const [errorBorder1, setErrorborder1] = useState(false);
  const [input, setInput] = React.useState({
    phd_description: "",
    options: "",
    level: "",
  });
  // console.log(viewPhdData);
  // console.log(viewPhdData?.[0]?.roominfo?.[0]?.status);
  const initialStatus = viewPhdData?.[0]?.roominfo?.[0]?.status;
  // const roomStatuses = viewPhdData?.[0]?.roominfo?.map((room) => ({
  //   status: room.status,
  // }));

  // console.log(roomStatuses);
  // const [val, setVal] = useState(() => {
  //   // Assuming viewPhdData?.[0]?.roominfo contains the necessary data for initial values
  //   const initialValues = {};
  //   viewPhdData?.[0]?.roominfo?.forEach((room) => {
  //     // room.feature.forEach((f) => {
  //     initialValues[f.feature_id] = f.status; // Initial value from the database
  //     // });
  //   });
  //   console.log(initialValues);
  //   return initialValues;
  // });

  const [val, setVal] = useState(1);

  // const handleChangee = (_, newValue) => {
  //   setVal(newValue);
  //   setInput({ ...input, ["level"]: newValue });
  //   setErrorborder1(false);
  // };

  // useEffect(() => {
  //   const handleBackNavigation = (e) => {
  //     e.preventDefault(); // Prevent default back navigation
  //     navigate("/agent/createPhd"); // Redirect to the desired page
  //   };

  //   window.addEventListener("popstate", handleBackNavigation); // Listen for back navigation

  //   return () => {
  //     window.removeEventListener("popstate", handleBackNavigation); // Cleanup event listener
  //   };
  // }, [navigate]);

  useEffect(() => {
    dispatch(viewPhdAlt({ id: itemId, value: "open" }));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemId]);
  // useEffect(() => {
  // if (viewPhdData?.[0]?.roominfo) {
  //   // Map through the roominfo array and extract the status
  //   const initialValues = viewPhdData[0].roominfo.map(
  //     (room) => room.status || 0
  //   );
  //   val(initialValues);
  // }
  // }, [viewPhdData]);
  const [progressBar, setProgressBar] = React.useState(
    viewPhdData?.[0]?.phd_price
  );
  const [allStatus, setStatus] = React.useState(["Bid", "D.I.Y", "Pass"]);
  const [progressBarpre, setProgressbarpre] = React.useState(
    viewPhdData?.[0]?.pre_price
  );

  const [pdfGenerating, setPdfGenerating] = useState(false);

  const [currentStatus, setCurrentStatus] = useState("Pass");

  const [progressBars, setProgressBars] = useState({});

  useEffect(() => {
    if (viewPhdData?.[0]?.roominfo) {
      const initialProgressBars = {};

      // Iterate over each room
      viewPhdData[0]?.roominfo?.forEach((room) => {
        // Iterate over each feature in the room
        room.feature.forEach((feature) => {
          initialProgressBars[feature?.feature_id] = feature?.phd_price;
        });
      });

      setProgressBars(initialProgressBars);
    }
  }, [viewPhdData]);

  const handleChangee = (newValue) => {
    setVal(newValue); // Update the slider's local value
    // If you're also tracking progressBars, you might want to update it as well
    // console.log("Progressssssssssssss", progressBars);
    // const updatedProgressBars = { ...progressBars };
    // updatedProgressBars[feature_id] = newValue;
    // setProgressBars(updatedProgressBars);
  };
  console.log(viewPhdData);
  const temp =
    viewPhdData &&
    viewPhdData[0] &&
    viewPhdData[0].roominfo &&
    viewPhdData[0].roominfo.map((item) => item.status).flat();

  // const value = viewPhdData[0]?.roominfo.map((item) => item.feature).flat();
  // console.log(value);
  // const value1 = value.map((item) => item.bid_status).flat();
  // console.log(value1);

  const initialValues = {
    sliders: temp,
    // bidder: value1,
  };
  console.log(initialValues);
  console.log("initail values", initialValues);
  const handleSliderChange = (setFieldValue, index, newValue) => {
    setFieldValue(`sliders.${index}`, newValue);
  };
  const mainPrice = viewPhdData?.[0]?.phd_price;
  // console.log(mainPrice);
  // const onchangeStatus = (status, room, feature_id) => {
  //   dispatch(
  //     bidStatusUpdate({
  //       id: viewPhdData[0]?.project_id,
  //       status: status,
  //       room: room,
  //       feature_id: feature_id,
  //     })
  //   )
  //     .unwrap()
  //     .then(() => {
  //       dispatch(viewPhdAlt({ id: itemId, value: "open" }))
  //         .unwrap()
  //         .then(() => {
  //           const updatedProgressBars = { ...progressBars };

  //           viewPhdData[0].roominfo.forEach((room) => {
  //             room.feature.forEach((feature) => {
  //               if (feature.feature_id === feature_id) {
  //                 if (status === "Bid") {
  //                   updatedProgressBars[feature_id] = Number(mainPrice) + 100;
  //
  //                 } else if (status === "Pass") {
  //                   updatedProgressBars[feature_id] =
  //                     Number(mainPrice) - 100000;
  //                 } else if (status === "D.I.Y") {
  //                   updatedProgressBars[feature_id] = Number(mainPrice);
  //
  //                 }
  //               }
  //             });
  //           });
  //           setProgressBars(updatedProgressBars);
  //         });
  //     });
  // };

  const onchangeStatus = (
    status,
    room,
    feature_id,
    index,
    currentValue,
    setValue
  ) => {
    dispatch(
      bidStatusUpdate({
        id: viewPhdData[0]?.project_id,
        status: status,
        room: room,
        feature_id: feature_id,
      })
    )
      .unwrap()
      .then(() => {
        dispatch(viewPhdAlt({ id: itemId, value: "open" }))
          .unwrap()
          .then(() => {
            console.log(typeof currentValue);
            console.log(temp);
            let updatedValue = temp[index];
            console.log(updatedValue, "upodated value");
            if (typeof updatedValue === "string") {
              updatedValue = parseInt(updatedValue);
            }

            if (status === "Bid") {
              updatedValue += 25;
            } else if (status === "D.I.Y") {
              updatedValue += 1;
            } else if (status === "Pass") {
              console.log("Pass: No change");
            }
            setValue(`sliders.${index}`, updatedValue);

            // updatedValue = Number(updatedValue);
            // if (isNaN(updatedValue)) updatedValue = 0;

            // setVal((prevValues) => ({
            //   ...prevValues,
            //   [feature_id]: updatedValue,
            // }));

            console.log("After update:", updatedValue);
            setVal(updatedValue);
          });
      });
  };

  // const initialValues = ele?.feature.reduce((acc, feature) => {
  //   acc[feature.feature_id] = 0; // Or set initial value based on existing state
  //   return acc;
  // }, {});
  const convertToPdf = async () => {
    if (!componentRef.current) return;

    // Temporarily store the current JSX
    const originalContent = componentRef.current.innerHTML;

    // Remove the buttons from the DOM
    const downloadPdfButton = document.getElementById("downloadPdfButton");
    const sendEmailButton = document.getElementById("sendEmailButton");
    downloadPdfButton.remove();
    sendEmailButton.remove();

    // Generate the PDF
    const input = componentRef.current;
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: [input.offsetWidth, input.offsetHeight],
    });

    try {
      const canvas = await html2canvas(input, { useCORS: true });
      const imgData = canvas.toDataURL("image/png");
      pdf.addImage(imgData, "PNG", 0, 0, input.offsetWidth, input.offsetHeight);

      // Dispatch the mailPdf action with name, email, and PDF File object
      const pdfBlob = pdf.output("blob");

      dispatch(
        mailPdf({
          firstName: viewPhdData[0].customer.first_name,
          lastName: viewPhdData[0].customer.last_name,
          email: viewPhdData[0].customer.email,
          pdfData: pdfBlob,
        })
      );
      componentRef.current.innerHTML = originalContent;
    } catch (error) {
      console.error("Error generating PDF:", error);
      componentRef.current.innerHTML = originalContent;
    }
    Toastify({
      data: "success",
      msg: "Project shared via Email  successfully",
    });
  };

  const downloadPdf = async () => {
    // const componentRef = useRef(null);

    if (!componentRef.current) return;

    setPdfGenerating(true);

    // Temporarily store the current JSX

    // Generate the PDF
    const input = componentRef.current;
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: [input.offsetWidth, input.offsetHeight],
    });

    try {
      setButtonsVisibility(false);
      const canvas = await html2canvas(input, { useCORS: true });
      const imgData = canvas.toDataURL("image/png");
      const timestamp = new Date().toISOString().replace(/[-T:\.Z]/g, "");
      pdf.addImage(imgData, "PNG", 0, 0, input.offsetWidth, input.offsetHeight);

      // Save the PDF file
      pdf.save(`phd_report_${timestamp}.pdf`);

      // Restore original content
      componentRef.current.innerHTML = originalContent;
    } catch (error) {
      console.error("Error generating PDF:", error);
      // Restore original content on error
      componentRef.current.innerHTML = originalContent;
    } finally {
      // Ensure buttons are restored
      setButtonsVisibility(true);
      setPdfGenerating(false);
    }
  };
  //   if (!componentRef.current) return;

  //   // Temporarily store the current JSX
  //   const originalContent = componentRef.current.innerHTML;

  //   // Remove the buttons from the DOM
  //   const downloadPdfButton = document.getElementById("downloadPdfButton");
  //   const sendEmailButton = document.getElementById("sendEmailButton");
  //   downloadPdfButton.remove();
  //   sendEmailButton.remove();

  //   // Generate the PDF
  //   const input = componentRef.current;
  //   const pdf = new jsPDF({
  //     orientation: "portrait",
  //     unit: "pt",
  //     format: [input.offsetWidth, input.offsetHeight],
  //   });

  //   try {
  //     const canvas = await html2canvas(input, { useCORS: true });
  //     const imgData = canvas.toDataURL("image/png");
  //     pdf.addImage(imgData, "PNG", 0, 0, input.offsetWidth, input.offsetHeight);

  //     // Dispatch the mailPdf action with name, email, and PDF File object
  //     const pdfBlob = pdf.output("blob");

  //     dispatch(
  //       mailPdf({
  //         firstName: viewPhdData[0].customer.first_name,
  //         lastName: viewPhdData[0].customer.last_name,
  //         email: viewPhdData[0].customer.email,
  //         pdfData: pdfBlob,
  //       })
  //     );
  //     componentRef.current.innerHTML = originalContent;
  //   } catch (error) {
  //     console.error("Error generating PDF:", error);
  //     componentRef.current.innerHTML = originalContent;
  //   }
  // };

  const setButtonsVisibility = (visible) => {
    const downloadPdfButton = document.getElementById("downloadPdfButton");
    const sendEmailButton = document.getElementById("sendEmailButton");
    if (downloadPdfButton)
      downloadPdfButton.style.display = visible ? "block" : "none";
    if (sendEmailButton)
      sendEmailButton.style.display = visible ? "block" : "none";
  };

  // console.log(viewPhdData[0]?.roominfo[0]?.room_id);

  return (
    <div className="center-content p-3">
      <div className="background-image"></div>
      <div
        className="popup1 cs-dialogg-container px-md-4 px-2 pb-md-4 pb-2 w-100 bg-white w-300 rounded-4"
        ref={componentRef}
      >
        <div className="d-flex justify-content-between align-items-center pb-3 border-bottom pt-4">
          <h2 className="fw-normal">PHD Report Summary</h2>

          <div className=" pe-4 me-4">
            <img
              alt="img"
              src="/images/footerImages/footer.png"
              width={"70px"}
            />
          </div>
        </div>

        {viewPhdData?.map((items, index) => {
          const dateString = items?.house?.updated_at;
          const dateObject = new Date(dateString);
          //   setprogressbar(parseInt(items?.phd_price))
          const year = dateObject.getFullYear();
          return (
            <div key={index}>
              <div className="col-inner h-100 bg-image-box2  position-relative rounded-4 mt-4">
                <div className="p-4 h-100 position-relative z-1">
                  <p className="report-detaill d-flex flex-lg-nowrap flex-wrap flex-column flex-md-row align-items-md-center justify-content-between align-items-start">
                    <span className="fw-semibold">Homeowners Name: </span>
                    <span className="w-50">
                      {items?.customer?.first_name +
                        " " +
                        items?.customer?.last_name}
                    </span>
                  </p>
                  <p className="report-detaill d-flex flex-lg-nowrap flex-wrap flex-column flex-md-row align-items-md-center justify-content-between align-items-start">
                    <span className="fw-semibold">Email Address:</span>{" "}
                    <span className="w-50">{items?.customer?.email}</span>
                  </p>
                  <p className="report-detaill d-flex flex-lg-nowrap flex-wrap flex-column flex-md-row align-items-md-center justify-content-between align-items-start mb-0">
                    <span className="fw-semibold">Property Address: </span>
                    <span className="w-50">{items?.house?.address}</span>
                  </p>
                  <div className="report-detaill d-flex flex-lg-nowrap flex-wrap flex-column flex-md-row align-items-md-center justify-content-between align-items-start mb-0">
                    <h3>Dazl Value:</h3>
                    <h3 className="w-50">${viewPhdData[0]?.phd_price}</h3>
                  </div>
                </div>
              </div>
              <div
                className=" shadow p-3 rounded-4 mt-4"
                style={{ backgroundColor: "#000" }}
              >
                <h3 className="text-white">
                  Updated House Details And Condition:-
                </h3>
                <Masonry columns={{ xs: 1, sm: 1, md: 1 }} spacing={2}>
                  {items?.roominfo.map((ele, index) => {
                    const roomId = ele?.room_id;
                    const imagesGroup = items?.images?.filter(
                      (image) => image?.room_id === roomId
                    );
                    return (
                      <div key={index} className="mb-4 col-sm-12">
                        <div className="flex-grow-1 mx-2 bg-custom-red-col bg-white shadow p-3 rounded-4">
                          <div className="border border-rounded p-2">
                            <div className="d-flex align-items-center justify-content-between">
                              <h3 className="fw-semibold font-18">
                                {ele?.room_name}
                              </h3>
                            </div>

                            <div>
                              {
                                items.images.filter(
                                  (image) => image?.room_id === roomId
                                )[0]?.description
                              }
                            </div>

                            <div className="ps-0 mb-4 mt-2">
                              <div key={index}>
                                <div className="d-flex gap-1 flex-wrap">
                                  {/* Display images for the current room_id */}
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
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>

                            <Formik initialValues={initialValues}>
                              {({ values, setFieldValue, errors }) => {
                                console.log(
                                  values.sliders,
                                  values.sliders[index]
                                );
                                return (
                                  <Form>
                                    {ele?.feature?.length !== 0 &&
                                      ele?.feature[0]?.feature_name !== "" && (
                                        <div
                                          className="p-3 mt-3 bg-white"
                                          style={{ margin: "10px" }}
                                        >
                                          <div className="slider-container position-relative p-3">
                                            <Field name={`sliders.${index}`}>
                                              {({ field }) => (
                                                <Slider
                                                  {...field}
                                                  value={values.sliders[index]}
                                                  onChange={
                                                    (e, value) => {}
                                                    //   setFieldValue(
                                                    //     `sliders.${index}`,
                                                    //     value
                                                    //   )
                                                  }
                                                  valueLabelDisplay="auto"
                                                  valueLabelFormat={(value) =>
                                                    `${value}`
                                                  }
                                                  min={0}
                                                  max={100}
                                                  // value={
                                                  //   values.sliders?.[
                                                  //     ele.feature_id
                                                  //   ] || 0
                                                  // } // Bind value to Formik state, defaulting to 0
                                                  // valueLabelDisplay="on"
                                                  // min={0}
                                                  // max={110}
                                                  // onChange={(e, newValue) =>
                                                  //   handleSliderChange(
                                                  //     setFieldValue,
                                                  //     ele.feature_id,
                                                  //     newValue
                                                  //   )
                                                  // }
                                                  className="cs-price-slider"
                                                />
                                              )}
                                            </Field>
                                          </div>
                                          <Box
                                            sx={{
                                              display: "flex",
                                              justifyContent: "space-between",
                                            }}
                                          >
                                            <Typography
                                              variant="body2"
                                              // onClick={() =>
                                              //   handleSliderChange(
                                              //     setFieldValue,
                                              //     index,
                                              //     1
                                              //   )
                                              // }
                                              sx={{ cursor: "pointer" }}
                                            >
                                              NEEDS DAZL
                                            </Typography>
                                            <Typography
                                              variant="body2"
                                              // onClick={() =>
                                              //   handleSliderChange(
                                              //     setFieldValue,
                                              //     index,
                                              //     35
                                              //   )
                                              // }
                                              sx={{ cursor: "pointer" }}
                                            >
                                              MARKET READY
                                            </Typography>
                                            <Typography
                                              variant="body2"
                                              // onClick={() =>
                                              //   handleSliderChange(
                                              //     setFieldValue,
                                              //     index,
                                              //     35
                                              //   )
                                              // }
                                              sx={{ cursor: "pointer" }}
                                            >
                                              DAZLING
                                            </Typography>
                                            <Typography
                                              variant="body2"
                                              // onClick={() =>
                                              //   handleSliderChange(
                                              //     setFieldValue,
                                              //     index,
                                              //     110
                                              //   )
                                              // }
                                              sx={{ cursor: "pointer" }}
                                            >
                                              DAZL PLUS
                                            </Typography>
                                          </Box>
                                          {errors.sliders && (
                                            <div className="text-primary">
                                              Please Select Impressions Value*
                                            </div>
                                          )}
                                          <h3 className="text-center d-flex mb-3 mt-1">
                                            Buyer Road Blocks:
                                          </h3>
                                          <div className="row flex-wrap justify-space-between abvc">
                                            {ele?.feature?.map(
                                              (eleInner, eleindex) => (
                                                <div
                                                  className="col-md-4 border-0 border-end"
                                                  key={eleindex}
                                                >
                                                  <h5 className="mb-2 ms-2">
                                                    {eleInner.feature_name}:
                                                  </h5>
                                                  <div className="border d-flex align-items-center ps-2 py-3 mb-3">
                                                    <div>
                                                      {eleInner?.imageDesc}
                                                    </div>
                                                  </div>
                                                  <div className="ps-0 mb-3">
                                                    <div className="d-flex gap-1 flex-wrap">
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
                                                                width="100px"
                                                                height="100px"
                                                              />
                                                            </a>
                                                          </div>
                                                        )
                                                      )}
                                                    </div>
                                                  </div>
                                                  {/* Status radio buttons */}
                                                  <div
                                                    style={{
                                                      display: "flex",
                                                      gap: "10px",
                                                      paddingBottom: "10px",
                                                      marginBottom: "10px",
                                                    }}
                                                  >
                                                    {allStatus.map((status) => (
                                                      <label
                                                        key={status}
                                                        className="custom-radio-label"
                                                      >
                                                        <input
                                                          type="radio"
                                                          name={`status-${index}-${eleindex}-${status}`}
                                                          checked={
                                                            eleInner.bid_status ===
                                                            status
                                                          }
                                                          onChange={() => {
                                                            onchangeStatus(
                                                              status,
                                                              ele.room_id,
                                                              eleInner.feature_id,
                                                              index,
                                                              values.sliders[
                                                                index
                                                              ],
                                                              setFieldValue
                                                            );
                                                            // setFieldValue(
                                                            //   `sliders.${index}`,

                                                            // );
                                                            setCurrentStatus(
                                                              status
                                                            );
                                                          }}
                                                        />
                                                        <span>{status}</span>
                                                      </label>
                                                    ))}
                                                  </div>
                                                </div>
                                              )
                                            )}
                                          </div>
                                        </div>
                                      )}
                                  </Form>
                                );
                              }}
                            </Formik>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </Masonry>
              </div>

              <div className="progress-slidee mt-4 bg-white shadow py-3 px-2 rounded-4 d-flex flex-wrap">
                <div className="mb-3 col-12">
                  <div className="border border-dark flex-grow-1 mx-2 p-2">
                    <h3>Preliminary Value/Score</h3>
                    <div>
                      <div className="d-flex justify-content-between mt-3 mb-2">
                        <p className="mb-0">$200k</p>
                        <p className="mb-0">
                          $
                          {progressBarpre
                            ? (progressBarpre / 1000).toFixed(1) + "k"
                            : "2M"}
                        </p>
                        <p className="mb-0">$2M</p>
                      </div>
                      <BorderLinearProgress
                        variant="determinate"
                        value={(progressBarpre / 1800000) * 100}
                      />
                    </div>
                  </div>
                </div>
                <div className="mb-3 col-12">
                  <div className="border border-dark flex-grow-1 mx-2 p-2">
                    <h3>phd Value/Score</h3>
                    <div>
                      <div className="d-flex justify-content-between mt-3 mb-2">
                        <p className="mb-0">$200k</p>
                        <p className="mb-0">
                          ${" "}
                          {progressBarpre
                            ? (progressBarpre / 1000).toFixed(1) + "k"
                            : "2M"}
                        </p>
                        <p className="mb-0">$2M</p>
                      </div>
                      <BorderLinearProgress
                        variant="determinate"
                        value={(progressBarpre / 1800000) * 100}
                      />
                    </div>
                  </div>
                </div>
                <div className="mb-3 col-12">
                  <div className="border border-dark flex-grow-1 mx-2 p-2">
                    <h3>DAZL Value/Score</h3>
                    <div>
                      <div className="d-flex justify-content-between mt-3 mb-2">
                        <p className="mb-0">$200k</p>
                        <p className="mb-0">
                          $
                          {progressBar
                            ? (progressBar / 1000).toFixed(1) + "k"
                            : "2M"}
                        </p>
                        <p className="mb-0">$2M</p>
                      </div>
                      <BorderLinearProgress
                        variant="determinate"
                        value={(progressBar / 1800000) * 100}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="progress-slidee mt-4 bg-white shadow py-3 px-3 rounded-4 d-flex flex-wrap">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                    alignItems: "center",
                  }}
                >
                  <div style={{ fontWeight: "bold", fontSize: 30 }}>
                    Service Pro Replies:
                  </div>
                  <div style={{ fontWeight: "bold", fontSize: 20 }}>
                    You have{" "}
                    {viewPhdData?.[0]?.projectOpportunityReplies.length} replies
                  </div>
                </div>
                {viewPhdData?.[0]?.projectOpportunityReplies.map(
                  (opportunity, index) => (
                    <div
                      key={index}
                      className="mb-3 col-12 d-flex border border-dark flex-grow-1 px-3 py-2"
                    >
                      <div className="col-5">
                        <div>
                          {opportunity?.professional?.first_name}{" "}
                          {opportunity?.professional?.last_name}
                        </div>
                        <div>
                          {opportunity?.professional?.company_street_address},{" "}
                          {opportunity?.professional?.company_city},{" "}
                          {opportunity?.professional?.state},{" "}
                          {opportunity?.professional?.zip_code}
                        </div>
                        <div>{opportunity?.professional?.email}</div>
                        <div>{opportunity?.professional?.phone_number}</div>
                        <div>
                          <a href={`/profile/${opportunity?.professional_id}`}>
                            View Profile
                          </a>
                        </div>
                      </div>
                      <div className="col-6">
                        <div>Re: Address</div>
                        <div className="mt-1 gap-4">
                          <div className="d-flex gap-1">
                            <div>
                              <input
                                type="checkbox"
                                id="checkbox"
                                checked={opportunity.is_interested === 1}
                              />
                            </div>
                            <span className="fw-bold fs-6"> YES </span>, I'm
                            interseted.
                          </div>
                          <div className="d-flex gap-1">
                            <div>
                              <input
                                type="checkbox"
                                id="checkbox"
                                checked={opportunity.is_interested !== 1}
                              />
                            </div>
                            <span className="fw-bold fs-6"> NO </span>, I'm not
                            interseted.{" "}
                          </div>
                        </div>
                        <div className="d-flex gap-1 flex-wrap">
                          <div style={{ fontWeight: "bold" }}>Message: </div>
                          <div>{opportunity.message}</div>
                        </div>
                      </div>
                      <div
                        className="col-1"
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            marginBottom: 8,
                          }}
                        >
                          <div
                            style={{
                              backgroundColor: "red",
                              padding: 4,
                              borderRadius: "50%", // Set borderRadius to 50% for a circular shape
                              width: 40, // Specify width (adjust as needed)
                              height: 40, // Specify height (adjust as needed)
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <SendIcon />
                          </div>
                          <div>Reply</div>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                          }}
                        >
                          <div
                            style={{
                              backgroundColor: "lightblue",
                              padding: 4,
                              borderRadius: "50%", // Set borderRadius to 50% for a circular shape
                              width: 40, // Specify width (adjust as needed)
                              height: 40, // Specify height (adjust as needed)
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <SaveIcon />
                          </div>
                          <div>Save</div>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
              <div className="d-flex justify-content-end gap-4">
                <button
                  id="downloadPdfButton"
                  type="submit"
                  className="d-flex items-center btn btn-primary mt-4 mb-2 gap-2"
                  onClick={downloadPdf}
                  disabled={pdfGenerating}
                >
                  {pdfGenerating ? "Generating PDF..." : "Download Pdf"}{" "}
                  <PictureAsPdfIcon />
                </button>
                <button
                  id="sendEmailButton"
                  type="submit"
                  className="d-flex items-center btn btn-primary mt-4 mb-2 gap-2"
                  onClick={convertToPdf}
                >
                  Send {<SendIcon />}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ViewPhdAlt;
