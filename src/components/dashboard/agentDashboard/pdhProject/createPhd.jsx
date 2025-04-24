import React, { useEffect, useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch } from "react-redux";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import { createphdStepone } from "../../../../store/dashboard/dashboardSlice";
import { useNavigate } from "react-router-dom";
import { Typography } from "@material-ui/core";
import { LazyLoadImage } from "react-lazy-load-image-component";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";
import "./style.css";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/bootstrap.css";
const defaultValues = {
  photos: [{ file: null }],
  firstName: "",
  lastName: "",
  email: "",
  location: "",
  phone_number: "",
};

const CreatePhd = () => {
  const [steponeCompleted, setSteponeCompleted] = React.useState(false);
  const dispatch = useDispatch();
  const schema = yup.object().shape({
    firstName: yup
      .string()
      .required("First Name is required")
      .min(1, "First Name have atleast 1 character")
      .trim(),
    lastName: yup
      .string()
      .required("Last Name is required")
      .min(1, "Last Name have atleast 1 character")

      .trim(),
    email: yup
      .string()
      .email("Please enter valid email address")
      .required("Email is required")
      .trim(),
    location: yup
      .string()
      .required("Location is required")
      .min(1, "Location have atleast 1 character")
      .trim(),
    phone_number: yup
      .string()
      // .matches(/^[0-12]+$/, "Mobile Number is required")
      .required("Mobile Number is required")
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
    // console.log("value------", value);
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
  const [errorLow, setErrorLow] = useState("");
  const [errorHigh, setErrorHigh] = useState("");

  const [lowValue, setLowValue] = useState(0);
  const [maxValue, setMaxValue] = useState(0);
  const [sliderValue, setSliderValue] = useState(300);

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
      setSliderValue(newValue);
    }
  };

  const handleLowValueChange = (e) => {
    if (maxValue === 0 || maxValue === "") {
      setErrorHigh("Please set maximum value first.");
    }
    if (e.target.value >= 999999999) {
      return;
    }
    const newValue =
      e.target.value === ""
        ? ""
        : parseInt(e.target.value.replace(/,/g, ""), 10);

    if (newValue === 0 || newValue === "") {
      setErrorLow("Please set minimum value first.");
    }
    if (!isNaN(newValue) && newValue >= 0) {
      if (newValue !== "" && newValue >= maxValue) {
        setErrorLow("Low value must be less than the high value.");
        setLowValue(newValue);
      } else {
        setErrorHigh("");
        setErrorLow("");
        setLowValue(newValue);
      }
      if (newValue !== "") {
        setSliderValue((prev) => {
          const midValue = Math.round((newValue + maxValue) / 2);
          return midValue !== prev ? midValue : prev;
        });
      }
    } else {
      setErrorLow("Enter a valid non negative number");
      setLowValue(newValue);
    }
  };

  // Validates high value input
  const handleMaxValueChange = (e) => {
    if (lowValue === 0 || lowValue === "") {
      setErrorLow("Please set minimum value first.");
    }
    if (e.target.value >= 999999999) {
      return;
    }
    const newValue =
      e.target.value === ""
        ? ""
        : parseInt(e.target.value.replace(/,/g, ""), 10);
    if (newValue === 0 || newValue === "") {
      setErrorHigh("Please set maximum value first.");
    }
    if (!isNaN(newValue) && newValue >= 0) {
      if (newValue !== "" && newValue <= lowValue) {
        setErrorHigh("High value must be greater than the low value.");
        setMaxValue(newValue);
      } else {
        setErrorHigh("");
        setErrorLow("");
        setMaxValue(newValue);
      }
      if (newValue !== "") {
        setSliderValue((prev) => {
          const midValue = Math.round((lowValue + newValue) / 2);
          return midValue !== prev ? midValue : prev;
        });
      }
    } else {
      setErrorHigh("Enter a valid non negative number");
      setMaxValue(newValue);
    }
  };

  const letStart = () => {
    localStorage.setItem("sliderValue", sliderValue);
    localStorage.setItem("maxValue", maxValue);
    localStorage.setItem("lowestValue", lowValue);
    navigate("/agent/createPhd/rooms");
  };

  const formatNumberWithCommas = (number) => {
    if (number === "" || isNaN(number)) return "";
    return new Intl.NumberFormat().format(number);
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
                          {errors.firstName && (
                            <p className="text-danger mt-2">
                              {errors.firstName.message}
                            </p>
                          )}
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
                          {errors.lastName && (
                            <p className="text-danger mt-2">
                              {errors.lastName.message}
                            </p>
                          )}
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
                          {errors.email && (
                            <p className="text-danger mt-2">
                              {errors.email.message}
                            </p>
                          )}
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
                          {errors.location && (
                            <p className="text-danger mt-2">
                              {errors.location.message}
                            </p>
                          )}
                        </div>
                        {/* ****************************** */}

                        <div className={`form-row col-md-6 mb-3`}>
                          <Controller
                            name="phone_number"
                            control={control}
                            render={({ field }) => (
                              <>
                                <PhoneInput
                                  country={"us"}
                                  enableSearch={true}
                                  value={field.value}
                                  // onChange={(phone) => {
                                  //   setPhone(phone);
                                  //   setValue("mobilenumber", phone, {
                                  //     shouldValidate: true,
                                  //   });
                                  // }}
                                  onChange={(e) => {
                                    console.log("====>", e);
                                    const formattedValue = e
                                      .replace(/[^0-9-]/g, "") // Remove all non-numeric and non-dash characters
                                      .replace(
                                        /(\d{3})(\d{3})(\d{4})/,
                                        "$1-$2-$3"
                                      );
                                    field.onChange({
                                      target: { value: formattedValue },
                                    });
                                  }}
                                  placeholder="+1 (545) 674-3543"
                                  inputStyle={{
                                    paddingTop: 8,
                                    paddingBottom: 8,
                                    width: "100%",
                                    border: 0,

                                    color: "black",
                                    background: "#fff",
                                    borderRadius: "6px",
                                    height: "40px",
                                  }}
                                  buttonStyle={{
                                    borderTopLeftRadius: "10px",
                                    borderBottomLeftRadius: "10px",
                                  }}
                                  containerStyle={{
                                    border: "1px solid #e5e7eb",
                                    borderRadius: "6px",
                                  }}
                                  inputProps={{
                                    id: "mobile",
                                    name: "mobile",
                                    required: true,
                                  }}
                                />

                                {errors.number && (
                                  <p className="text-danger">
                                    {errors.number.message}
                                  </p>
                                )}
                              </>
                            )}
                          />
                        </div>

                        {/* ****************************** */}
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
                        {/* Inputs First */}
                        <div className="d-flex justify-content-between">
                          <div>
                            <Typography variant="body">
                              Set Low Value:{"$ "}
                            </Typography>
                            <input
                              maxValue={999999999}
                              type="number"
                              maxLength={9}
                              onChange={handleLowValueChange}
                              valueLabelDisplay="on"
                              valueLabelFormat={(value) =>
                                formatNumberWithCommas(value)
                              }
                              onKeyDown={(e) =>
                                (e.target.value =
                                  e.target.value.match(/^([^e+-]{0,8})/)[0])
                              }
                            />
                            {errorLow && (
                              <div style={{ color: "red" }}>{errorLow}</div>
                            )}
                          </div>
                          <div>
                            <Typography variant="body">
                              Set High Value: {"$ "}
                            </Typography>
                            <input
                              maxValue={999999999}
                              type="number"
                              maxLength={9}
                              inputMode="numeric"
                              onChange={handleMaxValueChange}
                              valueLabelDisplay="on"
                              valueLabelFormat={(value) =>
                                formatNumberWithCommas(value)
                              }
                              onKeyDown={(e) =>
                                (e.target.value =
                                  e.target.value.match(/^([^e+-]{0,8})/)[0])
                              }
                            />
                            {errorHigh && (
                              <div style={{ color: "red" }}>{errorHigh}</div>
                            )}
                          </div>
                        </div>
                        <br />
                        <div className="d-flex flex-wrap align-items-center justify-content-between cs-price-ranges slider-value">
                          <Typography
                            gutterBottom
                            className="start-n40px text-white "
                          >
                            $ {formatNumberWithCommas(lowValue)}
                          </Typography>
                          <Typography
                            gutterBottom
                            className="end-n40px text-black "
                          >
                            $ {formatNumberWithCommas(maxValue)}
                          </Typography>
                        </div>
                        {/* Slider Below */}
                        <div className="slider-container position-relative">
                          <Slider
                            value={sliderValue}
                            aria-label="Default"
                            min={lowValue}
                            max={maxValue}
                            className="cs-price-slider"
                            onChange={handleChange}
                            valueLabelDisplay="on"
                            valueLabelFormat={(value) =>
                              formatNumberWithCommas(value)
                            }
                            sx={{
                              "& .MuiSlider-thumb": {
                                backgroundColor: "green", // Customize thumb color
                              },
                              "& .MuiSlider-valueLabel": {
                                backgroundColor: "white", // Background for better visibility
                                color: "black", // Text color
                                fontSize: "12px", // Adjust font size
                                transform: "translateX(-50%)", // Center align text
                                whiteSpace: "nowrap", // Prevent text wrapping
                              },
                            }}
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
                      disabled={
                        errorLow !== "" ||
                        maxValue === 0 ||
                        lowValue === 0 ||
                        maxValue === "" ||
                        lowValue === "" ||
                        errorHigh !== ""
                      }
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
