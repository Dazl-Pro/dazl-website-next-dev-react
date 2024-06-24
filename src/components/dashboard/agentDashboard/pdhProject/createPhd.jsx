import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch } from "react-redux";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import { createphdStepone } from "../../../../store/dashboard/dashboardSlice";
import { useNavigate } from "react-router-dom";
import { Typography, TextField } from "@material-ui/core";
import { LazyLoadImage } from "react-lazy-load-image-component";
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

const CreatePhd = () => {
  const [steponeCompleted, setSteponeCompleted] = React.useState(false);
  const dispatch = useDispatch();
  const schema = yup.object().shape({
    firstName: yup
      .string()
      .required("First Name is required")
      .min(3, "First Name have atleast 3 character")
      .trim(),
    lastName: yup
      .string()
      .required("Last Name is required")
      .min(3, "First Name have atleast 3 character")

      .trim(),
    email: yup
      .string()
      .email("Please enter valid email address")
      .required("Email is required")
      .trim(),
    location: yup
      .string()
      .required("Location is required")
      .min(3, "First Name have atleast 3 character")
      .trim(),
  });

  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues,
    resolver: yupResolver(schema),
  });

  const { fields, append } = useFieldArray({
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

  const [loading, setLoading] = React.useState(false);
  const [select, setSelect] = React.useState(false);
  const [address, setAddress] = React.useState("");

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
    setSelect(false);
    setAddress(newAddress);
    setValue("location", newAddress);
  };

  const handleChange = (event, newValue) => {
    if (!isNaN(newValue)) {
      // Check if newValue is a valid number
      setSliderValue(newValue);
    }
  };
  const handleLowValueChange = (e) => {
    const newValue = parseFloat(e.target.value); // Parse input value as a float
    if (!isNaN(newValue) && newValue >= 0 && newValue <= 1000) {
      // Check if the parsed value is a valid number and not negative
      setLowValue(newValue); // Set the new low value
    }
    // You can add an optional else condition to handle negative numbers or invalid input
  };

  // const handleMaxValueChange = (e) => {
  //   const newValue = parseFloat(e.target.value);
  //   setMaxValue(newValue);
  //   // Update slider value if it's outside the new lowValue-maxValue range
  //   if (sliderValue !== null && sliderValue > newValue) {
  //     setSliderValue(newValue);
  //   }
  // };
  const handleMaxValueChange = (e) => {
    const newValue = parseFloat(e.target.value);

    // Check if newValue is a valid number and within the limit
    if (!isNaN(newValue) && newValue >= 0 && newValue <= 1000) {
      // Trim leading zeros and update maxValue
      const trimmedValue = newValue.toString().replace(/^0+/, "");
      setMaxValue(parseFloat(trimmedValue));

      // Update slider value if it's outside the new lowValue-maxValue range
      if (sliderValue !== null && sliderValue > parseFloat(trimmedValue)) {
        setSliderValue(parseFloat(trimmedValue));
      }
    }
  };

  const letStart = () => {
    navigate("/agent/createPhd/rooms");
  };

  const [lowValue, setLowValue] = useState(0);
  const [maxValue, setMaxValue] = useState(600);
  const [sliderValue, setSliderValue] = useState(null);

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
                  <lable className="fs-5">
                    {steponeCompleted
                      ? "Incorporate both a low and high price range reflective of your expertise and understanding of the local real estate market. Your pre-listing home diagnostic should consider various factors such as comparable property prices, recent market trends, and any unique characteristics of the property."
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
                                onKeyPress={(e) => {
                                  const isValidInput = /^[a-zA-Z]+$/.test(
                                    e.key
                                  );
                                  if (!isValidInput) {
                                    e.preventDefault();
                                  }
                                }}
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
                                onKeyPress={(e) => {
                                  const isValidInput = /^[a-zA-Z]+$/.test(
                                    e.key
                                  );
                                  if (!isValidInput) {
                                    e.preventDefault();
                                  }
                                }}
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
                                onChange={handleChangeLocation}
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
                                        placeholder: "Enter Seller's address",
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
                      Your clients will receive an email from dazlpro.com asking
                      them if they would like to sign up for a free user
                      account. This will allow them to create projects and
                      receive the phd report.
                    </p>
                  </div>
                ) : (
                  <>
                    <Box sx={{ width: 300 }} className="w-100">
                      <div className="position-relative cs-price-slider-main">
                        <div className="d-flex flex-wrap align-items-center justify-content-between cs-price-ranges">
                          <Typography gutterBottom className="start-n40px">
                            $ {lowValue}
                          </Typography>
                          <Typography
                            gutterBottom
                            className="end-n40px text-black"
                          >
                            $ {maxValue}
                          </Typography>
                        </div>
                        <div className="slider-container position-relative">
                          <Slider
                            value={sliderValue}
                            aria-label="Default"
                            valueLabelDisplay="on"
                            min={lowValue}
                            max={maxValue}
                            className="cs-price-slider"
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="d-flex justify-content-between">
                        <div>
                          <Typography variant="body">
                            Set Low Value:{"$ "}
                          </Typography>
                          <input
                            type="number"
                            value={lowValue}
                            // onChange={(e) => {
                            //   const newValue = parseFloat(e.target.value);
                            //   if (!isNaN(newValue) && newValue >= 0) {
                            //     setLowValue(newValue);
                            //   }
                            // }}
                            onChange={handleLowValueChange}
                          />
                        </div>
                        <div>
                          <Typography variant="body">
                            Set high Value: {"$ "}
                          </Typography>
                          <input
                            type="number"
                            value={maxValue}
                            // onChange={(e) => {
                            //   setMaxValue(e.target.value);
                            // }}
                            onChange={handleMaxValueChange}
                          />
                        </div>
                      </div>
                    </Box>

                    <div className="">
                      <div className="row justify-content-between py-3 text-start">
                        <div className="container">
                          <div className="row">
                            <div className="d-grid gap-3 col"></div>
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
