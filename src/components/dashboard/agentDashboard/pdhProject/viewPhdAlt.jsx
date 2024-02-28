import React, { useEffect, useState } from "react";

import "./style.css";

import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import { useForm, useFieldArray, Controller } from "react-hook-form";
import { Typography, TextField } from "@material-ui/core";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  bidStatusUpdate,
  viewPhdAlt,
} from "../../../../store/dashboard/dashboardSlice";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { styled } from "@mui/material/styles";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";
import SendIcon from "@mui/icons-material/Send";
import { Toastify } from "../../../../services/toastify/toastContainer";
import {
  createphdStepone,
  uploadImage,
} from "../../../../store/dashboard/dashboardSlice";

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

const ViewPhdAlt = () => {
  const dispatch = useDispatch();
  const { itemId } = useParams();
  const selector = useSelector((state) => state.dashboardSlice);
  const viewPhdData = selector?.data?.viewPhdAlt;

  const defaultValues = {
    photos: [{ file: null }],
    firstName: "",
    lastName: "",
    email: "",
    location: "",
  };

  const schema = yup.object().shape({
    firstName: yup.string().required("First Name is required").trim(),
    lastName: yup.string().required("Last Name is required").trim(),
    email: yup
      .string()
      .email("Please enter valid email address")
      .required("Email is required")
      .trim(),
    location: yup.string().required("Location is required").trim(),
  });

  useEffect(() => {
    dispatch(viewPhdAlt({ id: itemId, value: "open" }));
  }, [itemId]);

  const {
    control,
    reset,
    register,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm({
    defaultValues,
    resolver: yupResolver(schema),
  });

  const [progressBar, setProgressBar] = React.useState(
    viewPhdData?.[0]?.phd_price
  );
  const [allStatus, setStatus] = React.useState(["Bid", "D.I.Y", "Pass"]);
  const [progressBarpre, setProgressbarpre] = React.useState(
    viewPhdData?.[0]?.pre_price
  );

  const [fileValue, setFileValue] = useState(null);
  const [errorBorder2, setErrorborder2] = useState(false);
  const [outerImage, setOuterimage] = React.useState([]);
  const [currentStatus, setCurrentStatus] = useState("Pass");

  const mainPrice = viewPhdData?.[0]?.phd_price;
  const onchangeStatus = (status, room) => {
    dispatch(
      bidStatusUpdate({
        id: viewPhdData[0]?.project_id,
        status: status,

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

  const {
    fields: photoFields,
    append: appendPhoto,
    remove: removePhoto,
  } = useFieldArray({
    control,
    name: "photos",
  });

  const handleImage = (index, e) => {
    const file = e.target.files[0];
    setFileValue(file);
    setErrorborder2(false);
    const isImage = file && file.type.startsWith("image/");
    clearErrors(`photos[${index}].file`);
    console.log("isImage", isImage);
    if (!isImage) {
      setError(`photos[${index}].file`, {
        type: "manual",
        message: "Invalid file type. Please select a valid image.",
      });
    } else {
      const formData = new FormData();
      formData.append("image", file);
      dispatch(uploadImage(formData))
        .unwrap()
        .then((res) => {
          const responseImage = res.image;

          const featuresIdDataIndex = outerImage.findIndex(
            (item) => item === responseImage
          );
          if (featuresIdDataIndex !== -1) {
            setOuterimage((prevData) => {
              const newArray = [...prevData];
              const existingObject = { ...newArray[featuresIdDataIndex] };
              existingObject.images = [...existingObject.images, responseImage];
              newArray[featuresIdDataIndex] = existingObject;
              return newArray;
            });
          } else {
            setOuterimage((prevData) => [...prevData, responseImage]);
          }
        });
    }
  };

  console.log(currentStatus);
  const sendEmail = () => {
    Toastify({
      data: "success",
      msg: "Project shared via Email  successfully",
    });
  };
  console.log("viewPhdData:", viewPhdData);
  if (!viewPhdData || viewPhdData.length === 0) {
    // Return a fallback or handle the case when viewPhdData is undefined or empty
    console.log("No data available");
    return <div>No data available</div>;
  }

  return (
    <>
      <div className="py-0">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-6">
              <div className="popup1 cs-dialogg-container px-4 pb-4">
                <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom pt-4">
                  <h3>PHD Report Summary</h3>

                  <div className="header-logo pe-4 me-4">
                    <LazyLoadImage
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
                    <>
                      <div key={index} className="pb-3">
                        <p className="report-detaill d-flex flex-lg-nowrap flex-wrap flex-column flex-md-row align-items-md-center justify-content-between align-items-start">
                          <span className="fw-bold">Homeowners Name: </span>
                          <span className="w-50">
                            {items?.customer?.first_name +
                              " " +
                              items?.customer?.last_name}
                          </span>
                        </p>
                        <p className="report-detaill d-flex flex-lg-nowrap flex-wrap flex-column flex-md-row align-items-md-center justify-content-between align-items-start">
                          <span className="fw-bold">Email Address:</span>{" "}
                          <span className="w-50">{items?.customer?.email}</span>
                        </p>
                        <p className="report-detaill d-flex flex-lg-nowrap flex-wrap flex-column flex-md-row align-items-md-center justify-content-between align-items-start mb-0">
                          <span className="fw-bold">Property Address: </span>
                          <span className="w-50">{items?.house?.address}</span>
                        </p>
                      </div>
                      <div className="report-detaill d-flex flex-lg-nowrap flex-wrap flex-column flex-md-row align-items-md-center justify-content-between align-items-start mb-0">
                        <h3>Dazl Value:</h3>
                        <h3 className="w-50">${viewPhdData[0].phd_price}</h3>
                      </div>
                      <div className="col mb-4">
                        {/* <div className=" d-flex flex-column mb-3">
                          <h3 className="">Property Details</h3>
                          <div className="bg-light-red rounded-3 p-3 h-100">
                            <p className="mb-2 d-flex justify-content-between">
                              {" "}
                              <span>Bed:</span>{" "}
                              <span>{items?.house?.bedrooms}</span>
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
                            {/* <p> Rooms: {items?.house?.bathrooms}</p> }
                          </div>
                        </div> */}
                        <div className=" d-flex flex-column">
                          <div className="bg-light-red rounded-3 p-3 h-100">
                            <h3 className="">
                              Updated house details and condition
                            </h3>
                            {items?.roominfo.map((ele, index) => {
                              return (
                                <div key={index}>
                                  <div className="d-flex align-items-center justify-content-between mt-3">
                                    <div className="fw-bolder">
                                      {ele?.room_name}
                                    </div>
                                    <div className="text-danger">
                                      {ele?.status}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      <div className="my-3 progress-slidee p-4 bg-light-red rounded-2">
                        <h3 className="text-center d-flex ">
                          Buyer Road Blocks
                        </h3>
                        {items?.roominfo?.map((e, index) => {
                          return (
                            <div
                              key={index}
                              className="border border-dark p-3 mt-3 bg-white"
                            >
                              <div className="d-flex align-items-center justify-content-between mb-3">
                                <div className="d-flex gap-1 align-items-center">
                                  Area:
                                  <div className="fw-bolder">
                                    {e?.room_name}
                                  </div>
                                </div>
                                <div className="text-danger">{e?.status}</div>
                              </div>
                              {e?.feature?.map((eleInner, eleindex) => {
                                return (
                                  <div key={eleindex}>
                                    <div className="fw-bolder mb-1 ms-2">
                                      {eleInner.feature_name}:
                                    </div>
                                    <div className="border d-flex align-items-center ps-2 py-3 mb-3 ">
                                      <div>{eleInner?.imageDesc}</div>
                                    </div>
                                    <div className="container ps-0 mb-3">
                                      <div className="d-flex gap-1">
                                        {eleInner?.images?.map(
                                          (image, imageIndex) => (
                                            <div key={imageIndex}>
                                              <a
                                                href={image}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                              >
                                                <LazyLoadImage
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

                              <div style={{ display: "flex", gap: "10px" }}>
                                {allStatus.map((status) => (
                                  <label
                                    key={status}
                                    className="custom-radio-label"
                                  >
                                    <input
                                      type="radio"
                                      name={`status-${index}`}
                                      onChange={() => {
                                        onchangeStatus(
                                          status,

                                          e.room_id
                                        );
                                        setCurrentStatus(status);
                                      }}
                                    />
                                    <span className="ps-2">{status}</span>
                                  </label>
                                ))}
                              </div>
                              {currentStatus !== "Pass" && (
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
                              )}
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
                        <div className="value border border-dark p-3 mb-4">
                          <h3>PHD Value/Score</h3>
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
                        <div className="border border-dark p-3">
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
            </div>
            <div className="col-md-6 position-relative form-contact-right">
              <img
                src="/images/contactImages/contact-img-1.jpg"
                alt=""
                className="position-absolute top-0 start-0 w-100 h-100 object-fit-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewPhdAlt;
