import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch } from "react-redux";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import {
  createphdStepone,
  uploadImage,
} from "../../../../store/dashboard/dashboardSlice";
import { useNavigate } from "react-router-dom";
import { Typography, TextField } from "@material-ui/core";
import { LazyLoadImage } from "react-lazy-load-image-component";
import DeleteIcon from "@mui/icons-material/Delete";

import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";
import "./style.css";

const defaultValues = {
  photos: [{ file: null }],
  firstName: "",
  lastName: "",
  email: "",
  location: "",
};

function valuetext(value) {
  return `${value}°C`;
}

const CreatePhd = () => {
  const [steponeCompleted, setSteponeCompleted] = React.useState(false);
  const dispatch = useDispatch();
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

  const selector = useSelector((state) => state.dashboardSlice);

  const stepOne = selector.data.phdStepOne;

  const navigate = useNavigate();
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

  const {
    fields: photoFields,
    append: appendPhoto,
    remove: removePhoto,
  } = useFieldArray({
    control,
    name: "photos",
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "checkbox_photos",
  });

  useEffect(() => {
    defaultValues?.checkbox_photos?.forEach((photo) => {
      const existingIndex = fields.findIndex(
        (field) =>
          field.indexId === photo.indexId &&
          field.file === photo.file &&
          field.description === photo.description
        // Customize the conditions based on your object structure
      );

      if (existingIndex === -1) {
        append(photo);
      }
    });
  }, []);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  const onSubmit = (value) => {
    setFirstName(value.firstName);
    setLastName(value.lastName);
    setEmail(value.email);
    dispatch(createphdStepone(value))
      .unwrap()
      .then((data) => {
        if (typeof data === "string") {
        } else {
          setSteponeCompleted(true);
          localStorage.setItem("phdUserDetail", JSON.stringify(value));
          localStorage.setItem("midValue", 750);
          localStorage.setItem("maxValue", 1000);
          localStorage.setItem("lowestValue", 500);
          localStorage.removeItem("saved1");
        }
      });
  };

  const [fileValue, setFileValue] = useState(null);
  const [errorBorder2, setErrorborder2] = useState(false);
  const [outerImage, setOuterimage] = React.useState([]);
  const [value, setValuee] = React.useState([500, 1000]);
  const [total, setTotal] = React.useState(750);
  const [loading, setLoading] = React.useState(false);
  const [address, setAddress] = React.useState("");
  const [select, setSelect] = React.useState(false);

  const handleSelect = async (selectedAddress) => {
    try {
      setLoading(true);
      const results = await geocodeByAddress(selectedAddress);
      const latLng = await getLatLng(results[0]);
      setAddress(selectedAddress);
      setValue("location", selectedAddress);
      setCoordinates(latLng);
      setSelect(true);
    } catch (error) {
      console.error("Error selecting address", error);
    } finally {
      setLoading(false); // Ensure loading is set to false regardless of success or failure.
    }
  };

  const handleChangeLocation = (newAddress) => {
    setAddress(newAddress);
    setSelect(false);
  };

  const handleImage = (index, e) => {
    const file = e.target.files[0];
    setFileValue(file);
    setErrorborder2(false);
    const isImage = file && file.type.startsWith("image/");
    clearErrors(`photos[${index}].file`);

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

  const handleChange = (event, newValue) => {
    setValuee(newValue);
    // Calculate the total of the newValue array
    const newMidValue = (newValue[0] + newValue[1]) / 2;
    setTotal(newMidValue);

    localStorage.setItem("midValue", newMidValue);
    localStorage.setItem("maxValue", newValue[1]);
    localStorage.setItem("lowestValue", newValue[0]);
  };
  const letStart = () => {
    navigate("/agent/createPhd/rooms");
  };
  const formattedTotal = () => {
    const absTotal = Math.abs(total); // Handle negative values if needed
    if (absTotal >= 1000) {
      return (absTotal / 1000).toFixed(2) + "M";
    } else {
      return total + "K";
    }
  };

  return (
    <div className="py-0">
      <div className="">
        <div className="">
          <div className="">
            <div className="content-full">
              <h2 className="h3 text-uppercase text-start mb-4 pb-4 border-bottom">
                {steponeCompleted
                  ? "Pre-Listing Home Dionostic"
                  : "PROPERTY ADDRESS and Details"}
              </h2>
              <div className="">
                <h5 className="mb-4">
                  {steponeCompleted && (
                    <>
                      <div className="d-flex justify-content-between align-items-center mb-4">
                        <div>
                          <div className="mb-2 " style={{ fontSize: "24px" }}>
                            Client Name: {firstName} {lastName}
                          </div>
                          <h4>Client Email: {email}</h4>
                        </div>
                        <div className="header-logo me-md-5 me-0">
                          <LazyLoadImage
                            alt="img"
                            src="/images/footerImages/footer.png"
                            width={"70px"}
                          />
                        </div>
                      </div>
                    </>
                  )}
                  <lable className="fs-3">
                    {steponeCompleted
                      ? "Adjust the high and low as needed, based on your knowledge of the area."
                      : "Seller's Information"}
                  </lable>
                </h5>
                {!steponeCompleted ? (
                  <div>
                    <p className="mb-1 fs-5 fw-bold">Client's name and Email</p>
                    <form onSubmit={handleSubmit(onSubmit)}>
                      <div className="row mt-2 mb-2">
                        <div className={`form-row mb-3 col-md-6`}>
                          <Controller
                            name="firstName"
                            control={control}
                            render={({ field }) => (
                              <input
                                {...field}
                                className={`form-control width-input ${
                                  errors.firstName ? "error" : ""
                                }`}
                                placeholder="First Name"
                              />
                            )}
                          />
                        </div>
                        <div className={`form-row mb-3 col-md-6 `}>
                          <Controller
                            name="lastName"
                            control={control}
                            render={({ field }) => (
                              <input
                                {...field}
                                className={`form-control width-input ${
                                  errors.lastName ? "error" : ""
                                }`}
                                placeholder="Last Name"
                              />
                            )}
                          />
                        </div>
                        <div className={`form-row mb-3 col-md-6 `}>
                          <Controller
                            name="email"
                            control={control}
                            render={({ field }) => (
                              <input
                                {...field}
                                className={`form-control width-input ${
                                  errors.email ? "error" : ""
                                }`}
                                placeholder="Email address"
                              />
                            )}
                          />
                        </div>
                        <div
                          className={`form-row mb-3 col-md-6 position-relative`}
                        >
                          <Controller
                            name="location"
                            control={control}
                            defaultValue=""
                            rules={{ required: "Location is required" }}
                            render={({ field }) => (
                              <PlacesAutocomplete
                                value={field.value}
                                onChange={(newValue) => {
                                  setValue("location", newValue);
                                  handleChangeLocation(newValue);
                                }}
                                onSelect={handleSelect}
                              >
                                {({
                                  getInputProps,
                                  suggestions,
                                  getSuggestionItemProps,
                                }) => (
                                  <div>
                                    <input
                                      {...getInputProps({
                                        placeholder: "Enter your address",
                                        className: "location-search-input",
                                      })}
                                      className={`form-control width-input ${
                                        errors.location ? "error" : ""
                                      }`}
                                    />
                                    <div
                                      className={
                                        field.value.length > 0 &&
                                        !loading &&
                                        !select
                                          ? "autocomplete-dropdown-container"
                                          : ""
                                      }
                                    >
                                      {/* {loading && <div>Loading...</div>} */}
                                      {suggestions.map((suggestion, index) => {
                                        const style = {
                                          backgroundColor: suggestion.active
                                            ? "#dc3545"
                                            : "#fff",
                                          color: suggestion.active
                                            ? "white"
                                            : "black",
                                        };
                                        return (
                                          <div
                                            {...getSuggestionItemProps(
                                              suggestion,
                                              {
                                                style,
                                              }
                                            )}
                                            key={index}
                                          >
                                            {suggestion.description}
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                )}
                              </PlacesAutocomplete>
                            )}
                          />
                        </div>
                      </div>
                      <div className="d-flex justify-content-center align-items-center">
                        <button
                          type="submit"
                          className="btn btn-primary mw-200px w-100"
                        >
                          Next
                        </button>
                      </div>
                    </form>
                    <p className="mt-4 mb-0 pt-3 border-top">
                      Your Clients will receive an email from dazlpro.com asking
                      them if they would like to sign up for a free user
                      account. This will allow them to create projects and
                      receive the PHD report.
                    </p>
                  </div>
                ) : (
                  <>
                    <Box sx={{ width: 300 }} className="w-100">
                      {/* <Typography gutterBottom>{total}K</Typography> */}
                      {/* <Typography gutterBottom>{formattedTotal()}</Typography>
                      <Slider
                        getAriaLabel={() => "Temperature range"}
                        value={value}
                        onChange={handleChange}
                        valueLabelDisplay="on"
                        getAriaValueText={valuetext}
                        min={1}
                        max={2000}
                        className="slider-rangee"
                      /> */}
                      
                      <div className="position-relative cs-price-slider-main">
                        <div className="d-flex flex-wrap align-items-center justify-content-between cs-price-ranges">
                          <Typography gutterBottom className="start-n40px">{formattedTotal()}</Typography>
                          <Typography gutterBottom className="end-n40px text-black">{formattedTotal()}</Typography>
                        </div>
                        <Slider defaultValue={20} aria-label="Default" valueLabelDisplay="on" className="cs-price-slider" />
                      </div>
                    </Box>

                    <div className="">
                      <div className="row justify-content-between py-3 text-start">
                        <div className="container">
                          <div className="row">
                            {/* <div className="bg-light p-3 rounded-2 col-8">
                              <div className="row d-flex justify-content-between">
                                <div className={`form-row col-md-4 mb-3`}>
                                  <input
                                    className={` width-input form-control`}
                                    placeholder="Area*"
                                  />
                                </div>
                                <div className={`form-row col-md-4 mb-3`}>
                                  <input
                                    className={` width-input form-control`}
                                    placeholder="Market Ready*"
                                  />
                                </div>
                              </div>
                              <TextField
                                // label={` ${_.name}`}
                                className="text-areamt w-100 form-control"
                                multiline
                                rows={4}
                                variant="outlined"
                                placeholder="Notes*"
                              />
                              <div className="row form-row mt-3">
                                {photoFields.map((item, index) => (
                                  <div className="col-md-6" key={item.id}>
                                    <div className="d-flex align-items-start gap-2">
                                      <input
                                        type="file"
                                        {...register(`photos[${index}].file`)}
                                        className={`form-control mb-3 ${
                                          (errors.photos &&
                                            errors?.photos[index]?.file) ||
                                          errorBorder2
                                            ? "error"
                                            : ""
                                        }`}
                                        onChange={(e) => handleImage(index, e)}
                                      />
                                      {photoFields.length > 1 && (
                                        <button
                                          type="button"
                                          className="btn btn-light bg-light-red border-danger space"
                                          onClick={() => removePhoto(index)}
                                        >
                                          <DeleteIcon />
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                              <div className="d-flex justify-content-start align-items-center mt-2">
                                <button
                                  type="button"
                                  className="btn btn-danger"
                                  onClick={() => appendPhoto({ file: null })}
                                >
                                  Upload more
                                </button>
                              </div>
                            </div> */}
                            <div className="d-grid gap-3 col">
                              {/* <div className="">
                                <div className="col-inner h-100 bg-image-box position-relative rounded-4">
                                  <div className="p-4 h-100 position-relative z-1">
                                    <h5 className="text-uppercase mb-3">
                                      Public Records
                                    </h5>
                                    <div>
                                      <div className="mb-2 d-flex justify-content-between align-items-center">
                                        <span> Lot Size:</span>
                                        <div>
                                          <input
                                            type="number"
                                            value={lotSize}
                                            onChange={(e) =>
                                              setLotSize(e.target.value)
                                            }
                                            className="ms-2"
                                            style={{ maxWidth: "80px" }}
                                          />{" "}
                                          sqft
                                        </div>
                                      </div>
                                      <div className="mb-2 d-flex justify-content-between align-items-center">
                                        {" "}
                                        <span>Property Type:</span>
                                        <input
                                          type="text"
                                          value={propertyType}
                                          onChange={(e) =>
                                            setPropertyType(e.target.value)
                                          }
                                          className="ms-2"
                                        />
                                      </div>
                                      <div className="mb-2 d-flex justify-content-between align-items-center">
                                        <span>Date Updated:</span>

                                        <input
                                          type="date"
                                          value={dateUpdated}
                                          onChange={(e) =>
                                            setDateUpdated(e.target.value)
                                          }
                                          className="ms-2"
                                          style={{ maxWidth: "120px" }}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div> */}
                              {/* <div className="">
                                <div className="col-inner h-100 bg-image-box2 position-relative rounded-4">
                                  <div className="p-4 h-100 position-relative z-1">
                                    <h5 className="text-uppercase mb-3">
                                      HOUSE DETAILS
                                    </h5>
                                    <div className="d-flex flex-wrap">
                                      <p className="mb-2 col-md-6  d-flex justify-content-between align-items-center">
                                        <span>Bathrooms:</span>
                                        <input
                                          type="number"
                                          value={bathrooms}
                                          onChange={(e) =>
                                            setBathrooms(e.target.value)
                                          }
                                          style={{ maxWidth: "60px" }}
                                        />
                                      </p>
                                      <p className="mb-2 col-md-6 ps-md-4 d-flex justify-content-between align-items-center">
                                        <span>Rooms:</span>
                                        <input
                                          type="number"
                                          value={rooms}
                                          onChange={(e) =>
                                            setRooms(e.target.value)
                                          }
                                          style={{ maxWidth: "60px" }}
                                        />
                                      </p>
                                      <p className="mb-2 col-md-6 d-flex justify-content-between align-items-center">
                                        <span>Stories:</span>
                                        <input
                                          type="number"
                                          value={stories}
                                          onChange={(e) =>
                                            setStories(e.target.value)
                                          }
                                          style={{ maxWidth: "60px" }}
                                        />
                                      </p>
                                      <p className="mb-2 col-md-6 ps-md-4 d-flex justify-content-between align-items-center">
                                        <span>Year Built:</span>
                                        <input
                                          type="text"
                                          value={yearBuilt}
                                          onChange={(e) =>
                                            setYearBuilt(e.target.value)
                                          }
                                          style={{ maxWidth: "120px" }}
                                        />
                                      </p>
                                      <p className="mb-2 col-md-6  d-flex justify-content-between align-items-center">
                                        <span>Bed:</span>
                                        <input
                                          type="number"
                                          value={bedrooms}
                                          onChange={(e) =>
                                            setBedrooms(e.target.value)
                                          }
                                          style={{ maxWidth: "60px" }}
                                        />{" "}
                                      </p>
                                      <p className="mb-2 col-md-6 ps-md-4 d-flex justify-content-between align-items-center">
                                        <span>House Size:</span>
                                        <input
                                          type="number"
                                          value={houseSize}
                                          onChange={(e) =>
                                            setHouseSize(e.target.value)
                                          }
                                          style={{ maxWidth: "60px" }}
                                        />{" "}
                                      </p>
                                      <p className="mt-2 col-md-6   d-flex justify-content-between align-items-center">
                                        <span>Style:</span>
                                        <input
                                          type="text"
                                          value={style}
                                          onChange={(e) =>
                                            setStyle(e.target.value)
                                          }
                                          style={{ maxWidth: "120px" }}
                                        />
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div> */}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <button
                      className="btn btn-primary mw-200px w-70 mt-4"
                      style={{ textTransform: "none" }}
                      onClick={letStart}
                    >
                      Let's get Started
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePhd;
