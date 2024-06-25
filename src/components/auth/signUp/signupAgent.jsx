import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormControlLabel, FormGroup, Radio, RadioGroup } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import * as yup from "yup";
import { useDispatch } from "react-redux";
import { agentSignUp } from "../../../store/auth/authSlice";
import { Toastify } from "../../../services/toastify/toastContainer";

import { useNavigate } from "react-router-dom";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import IconButton from "@mui/material/IconButton";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";
import "./signUp.css";

const defaultValues = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
  companyName: "",
  location: "",
  number: "",
  agreeToTerms: false,
  subscription: "",
};

const schema = yup.object().shape({
  firstName: yup
    .string()
    .required("First Name is required")
    .trim()
    .min(3, "First Name have atleast 3 characters"),
  lastName: yup
    .string()
    .required("Last Name is required")
    .trim()
    .min(3, "Last Name have atleast 3 characters"),
  email: yup
    .string()
    .email("Please enter valid email address")
    .required("Email is required")
    .trim(),
  password: yup
    .string()

    // .matches(
    //   /^(?=.*[A-Z])/,
    //   "Password must contain at least one uppercase letter"
    // )
    // .matches(/^(?=.*[0-9])/, "Password must contain at least one number")
    .min(6, "Password have atleast 6 characters long")
    .max(15, "Password have atmost 8 characters long")
    .required("Password is required")
    .trim(),
  confirmPassword: yup
    .string()
    .required("Confirm password is required")
    .oneOf([yup.ref("password")], "Passwords do not match")
    .trim(),
  companyName: yup
    .string()
    .required("Company Name is required")
    .trim()
    .min(3, "Company Name have atleast 3 characters"),

  // location: yup.string().required("Location is required").trim(),
  number: yup
    .string()
    .matches(/^\d+$/, "Number must be digits only")
    .required("Phone number is required")
    .trim(),

  streetAddress: yup
    .string()
    .trim()
    .min(3, "Street Address  atleast 3 characters"),
  city: yup
    .string()
    .required("Location is required")
    .trim()
    .min(3, "City have atleast 3 characters"),
  state: yup
    .string()
    .required("state is required")
    .trim()
    .min(3, "State have atleast 3 characters"),
  zip: yup
    .string()
    .required("Zip Code is required")
    .trim()
    .min(3, "Zip Name have atleast 3 characters"),
  agreeToTerms: yup
    .bool()
    .oneOf([true], "Please accept the terms and conditions"),

  subscription: yup.string().required("Please select a subscription option"),
});

const SignupAgent = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [key, setKey] = React.useState(0);
  const {
    control,
    reset,
    setValue,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues,
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    dispatch(agentSignUp(data))
      .unwrap()
      .then((data) => {
        if (data === undefined) {
        } else {
          localStorage.setItem("token", data.data.token);
          localStorage.setItem("userType", "agent");
          Toastify({ data: "success", msg: `Welcome ${data.data.first_name}` });
          navigate("/agent/home");
        }
      });
    reset();
    setKey((prevKey) => prevKey + 1);
    // Add your form submission logic here
  };
  const handleClickShowPassword = () => {
    setShowPassword((show) => !show);
  };
  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword((show) => !show);
  };
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const [loading, setLoading] = useState(false);
  const [select, setSelect] = useState(false);
  const [address, setAddress] = useState("");
  const handleSelect = async (selectedAddress) => {
    try {
      setLoading(true);
      const results = await geocodeByAddress(selectedAddress);
      const latLng = await getLatLng(results[0]);
      setAddress(selectedAddress);
      setValue("location", selectedAddress);
      setLoading(false);
      setSelect(true);
    } catch (error) {
      console.error("Error selecting address", error);
      setLoading(false);
    }
  };

  const handleChange = (newAddress) => {
    setAddress(newAddress);
    setSelect(false);
  };
  return (
    <div className="py-5 sign-up-bg bg-light-red">
      <div className="container">
        <div className="shadow-lg p-4 p-xl-5 rounded-4 bg-white">
          <h6 className="text-center underline-red">
            <span>DAZL IS FOR</span>
          </h6>
          <h2 className="text-uppercase mb-3">Agent Page SignUp</h2>
          <p className="mb-4">
            For sellers' agents particularly, we know the work you do requires
            you to pivot quickly and to call on all your resources to craft and
            finalize the deal. Property roadblocks, like needed repairs or
            improvements, can impact the number of days on-market as well as the
            contract value. And it can consume your time and your resources
          </p>
          <div className="">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="row">
                <div className={`form-row mb-3 col-md-6`}>
                  <Controller
                    name="firstName"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        className={`form-control ${
                          errors.firstName ? "error" : ""
                        }`}
                        placeholder="First Name*"
                      />
                    )}
                  />
                  {errors.firstName && (
                    <p className="text-danger mt-2">
                      {errors.firstName.message}
                    </p>
                  )}
                </div>
                <div className={`form-row mb-3 col-md-6`}>
                  <Controller
                    name="lastName"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        className={`form-control ${
                          errors.lastName ? "error" : ""
                        }`}
                        placeholder="Last Name*"
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
                        placeholder="Email address*"
                        pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
                      />
                    )}
                  />
                  {errors.email && (
                    <p className="text-danger mt-2">{errors.email.message}</p>
                  )}
                </div>
                <div className={`form-row mb-3 col-md-6 `}>
                  <Controller
                    name="number"
                    control={control}
                    render={({ field }) => (
                      <>
                        <input
                          type="text"
                          {...field}
                          className={`form-control width-input ${
                            errors.number ? "error" : ""
                          }`}
                          onKeyPress={(e) => {
                            const isValidInput = /^[0-9\b]+$/.test(e.key);
                            if (!isValidInput) {
                              e.preventDefault();
                            }
                          }}
                          placeholder="Phone Number*"
                        />
                        {errors.number && (
                          <p className="text-danger">{errors.number.message}</p>
                        )}
                      </>
                    )}
                  />
                </div>
                <div className={`form-row mb-3 col-md-6 position-relative`}>
                  <Controller
                    name="password"
                    control={control}
                    render={({ field }) => (
                      <>
                        <input
                          {...field}
                          type={showPassword ? "text" : "password"}
                          className={`form-control width-input ${
                            errors.password ? "error" : ""
                          }`}
                          placeholder="Create Password*"
                        />
                        {errors.password && (
                          <p className="text-danger mt-2">
                            {errors.password.message}
                          </p>
                        )}
                      </>
                    )}
                  />
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                    className="position-absolute top-0 end-0 mx-0 bg-transparent border-0"
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </div>
                <div className={`form-row mb-3 col-md-6 position-relative`}>
                  <Controller
                    name="confirmPassword"
                    control={control}
                    render={({ field }) => (
                      <>
                        <input
                          {...field}
                          className={`form-control width-input ${
                            errors.confirmPassword &&
                            watch("password") !== watch("confirmPassword")
                              ? "error"
                              : ""
                          }`}
                          placeholder="Confirm Password*"
                          type={showConfirmPassword ? "text" : "password"}
                        />
                        {errors.confirmPassword &&
                          watch("confirmPassword") !==
                            watch("confirmPassword") && (
                            <p className="text-danger mt-2">
                              {errors.confirmPassword.message}
                            </p>
                          )}
                      </>
                    )}
                  />
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowConfirmPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                    className="position-absolute top-0 end-0 mx-0 bg-transparent border-0"
                  >
                    {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </div>
                <div className={`form-row mb-3 col-md-6`}>
                  <Controller
                    name="companyName"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        className={`form-control width-input  ${
                          errors.companyName ? "error" : ""
                        }`}
                        placeholder="Real Estate company*"
                      />
                    )}
                  />
                  {errors.companyName && (
                    <p className="text-danger mt-2">
                      {errors.companyName.message}
                    </p>
                  )}
                </div>
                <div className={`form-row mb-3 col-md-6 `}>
                  <Controller
                    name="streetAddress"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        className={` width-input form-control ${
                          errors.streetAddress ? "error" : ""
                        }`}
                        placeholder="Company street address"
                      />
                    )}
                  />
                  {errors.streetAddress && (
                    <p className="text-danger mt-2">
                      {errors.streetAddress.message}
                    </p>
                  )}
                </div>
                <div className={`form-row mb-3 col-md-4 `}>
                  <Controller
                    name="city"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        className={` width-input form-control ${
                          errors.city ? "error" : ""
                        }`}
                        placeholder="Company City*"
                      />
                    )}
                  />
                  {errors.city && (
                    <p className="text-danger mt-2">{errors.city.message}</p>
                  )}
                </div>
                <div className={`form-row mb-3 col-md-4 `}>
                  <Controller
                    name="state"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        className={` width-input form-control ${
                          errors.state ? "error" : ""
                        }`}
                        placeholder="State*"
                      />
                    )}
                  />
                  {errors.state && (
                    <p className="text-danger mt-2">{errors.state.message}</p>
                  )}
                </div>
                <div className={`form-row mb-3 col-md-4 `}>
                  <Controller
                    name="zip"
                    control={control}
                    render={({ field }) => (
                      <>
                        <input
                          type="text"
                          pattern="[0-9]*"
                          inputMode="numeric"
                          {...field}
                          className={` width-input form-control ${
                            errors.zip ? "error" : ""
                          }`}
                          placeholder="Zip Code*"
                          maxLength={6}
                          onKeyPress={(e) => {
                            const isValidKey = /^[0-9]$/i.test(e.key);
                            if (!isValidKey) {
                              e.preventDefault();
                            }
                          }}
                        />
                        {errors.zip && (
                          <p className="text-danger mt-2">
                            {errors.zip.message}
                          </p>
                        )}
                      </>
                    )}
                  />
                </div>
              </div>
              <div className="form-row my-3 d-flex justify-content-between">
                <FormGroup className="d-flex flex-wrap flex-row align-items-center">
                  <Controller
                    name="agreeToTerms"
                    control={control}
                    defaultValue={false}
                    key={key}
                    render={({ field }) => (
                      <FormControlLabel
                        control={
                          <Checkbox
                            {...field}
                            inputProps={{ "aria-label": "agree to terms" }}
                            className={`p-0 me-2 ${
                              errors.agreeToTerms ? "errorTerm" : ""
                            } `}
                          />
                        }
                        label="Click here to accept"
                        className="mx-0"
                      />
                    )}
                  />
                  <p
                    className="mb-1 ms-2"
                    style={{ cursor: "pointer" }}
                    onClick={() =>
                      window.open("https://dev.dazlpro.com/termsandConditions")
                    }
                  >
                    DAZl'S TERMS AND CONDITIONS.
                    <span className="text-danger">*</span>
                  </p>
                  {/* {errors.agreeToTerms && (
                    <p className="text-danger mb-0 w-100">
                      {errors.agreeToTerms.message}
                    </p>
                  )} */}
                </FormGroup>
                <p className="text-danger">*Required field</p>
              </div>
              <div className="form-row">
                <FormGroup>
                  <h6 className="d-block mt-2 fw-bold mb-sm-0 mb-3">
                    Start Subscription:
                  </h6>
                  <Controller
                    name="subscription"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <RadioGroup {...field} className={`row flex-row `}>
                        <FormControlLabel
                          value="monthly"
                          control={
                            <Radio
                              className={`p-0 me-2  ${
                                errors.subscription ? "errorSub" : ""
                              }`}
                            />
                          }
                          label="$10 per month"
                          className={`col-md-4 col-sm-6 mb-3 mx-0 `}
                        />
                      </RadioGroup>
                    )}
                  />
                  {/* {errors.subscription && (
                    <p className="text-danger">{errors.subscription.message}</p>
                  )} */}
                </FormGroup>
              </div>
              <div className="d-flex justify-content-center align-items-center">
                <button type="submit" className="btn btn-primary w-100">
                  Submit
                </button>
              </div>
              <p className="d-flex justify-content-center align-items-center m-3">
                Do not have an account?{" "}
                <a href="/login/realtor" className="text-primary">
                  Sign-In
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupAgent;
