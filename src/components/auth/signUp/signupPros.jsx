import React, { useState } from "react";
import { useTheme } from "@mui/material/styles";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormControlLabel, FormGroup, Radio, RadioGroup } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import * as yup from "yup";
import { useDispatch } from "react-redux";
import {
  professionalSignUp,
  uploadImageAuth,
} from "../../../store/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { Toastify } from "../../../services/toastify/toastContainer";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import IconButton from "@mui/material/IconButton";
import "./signUp.css";
import PhoneInput from "react-phone-input-2";

import "react-phone-input-2/lib/bootstrap.css";

// const photosSchema = yup.array().of(
//   yup.object().shape({
//     file: yup
//       .mixed()
//       .optional()
//       .test(
//         "fileType",
//         "Only image files are allowed",
//         (value) => {
//           if (!value) {
//             return true; // If no file, skip validation
//           }

//           const supportedFormats = ["image/jpeg", "image/png", "image/gif"];

//           return supportedFormats.includes(value.type);
//         }
//       )
//       .test("fileSize", "File size is too large", (value) => {
//         const maxSize = 1024 * 1024 * 5; // 5 MB as an example, adjust as needed
//         return !value || (value && value.size <= maxSize);
//       }),
//     description: yup.string(),
//   })
// );

const photosSchema = yup.array().of(
  yup.object().shape((shape) => ({
    file: yup
      .mixed()
      .test("file", "File is required", function (value) {
        const isFileRequired = this.parent.file && this.parent.file.length > 0;
        if (isFileRequired) {
          return !!value; // File is required, so check if a file is provided
        }
        return true; // File is not required, so validation passes
      })
      .when("file", {
        is: (file) => file && file.length > 0, // Apply validation only if a file is provided
        then: yup
          .mixed()
          .test("fileType", "Only image files are allowed", (value) => {
            const supportedFormats = ["image/jpeg", "image/png", "image/gif"];
            return value && supportedFormats.includes(value.type);
          })
          .test("fileSize", "File size is too large", (value) => {
            const maxSize = 1024 * 1024 * 5; // 5 MB as an example, adjust as needed
            return value && value.size <= maxSize;
          }),
        otherwise: yup.mixed().nullable(),
      }),
    description: yup.string(),
  }))
);

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
    .min(3, "Last Name  have atleast 3 characters"),
  email: yup
    .string()
    .email("Please enter valid email address")
    .required("Email is required")
    .trim(),
  password: yup
    .string()
    .required("Password is required")
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
  streetAddress: yup
    .string()
    .trim()
    .min(3, "Street Address have atleast 3 characters"),
  city: yup
    .string()
    .required("Location is required")
    .trim()
    .min(3, "City  atleast have 3 characters"),
  state: yup.string().required("state is required").trim(),

  zip: yup
    .string()
    .required("Zip Code is required")
    .trim()
    .min(3, "Zip Name have atleast 3 characters"),
  number: yup
    .string()
    .matches(/^[0-9-]+$/, "Please enter a valid number")
    .required(" company Number is required")
    .trim(),
  mobilenumber: yup
    .string()
    .matches(/^[0-9]+$/, "Mobile Number is required")
    .required("Mobile Number is required")
    .trim(),
  yearofbusiness: yup
    .string()
    .matches(/^[0-9]+$/, "Please enter a valid year")
    .required("Year in business is required")
    .trim(),
  websiteLink: yup.string().url("Invalid website link").trim(),
  facebookLink: yup.string().url("Invalid Facebook link").trim(),
  Xlink: yup.string().url("Invalid X link").trim(),
  insuranceCompany: yup.string().trim(),
  contactPerson: yup
    .string()
    .trim()
    .matches(/^[a-zA-Z0-9]+$/, "Please enter a valid alphanumeric value"),

  insuranceNumber: yup.string(),
  agreeToTerms: yup
    .bool()
    .oneOf([true], "Please accept the terms and conditions"),
  subscription: yup.string().required("Please select a subscription option"),
  photos: photosSchema,
});
const defaultValues = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
  companyName: "",
  streetAddress: "",
  city: "",
  state: "",
  zip: "",
  number: "",
  yearofbusiness: "",
  websiteLink: "",
  facebookLink: "",
  Xlink: "",
  insuranceCompany: "",
  contactPerson: "",
  insuranceNumber: "",
  agreeToTerms: false,
  subscription: "",
  selectServices: [],
  photos: Array.from({ length: 4 }, (_, index) => ({ image: null })),
};
const services = [
  { id: 12, name: "Appliances & Repair" },
  { id: 28, name: "Building Contractor" },
  { id: 11, name: "Cabinets & Countertops" },
  { id: 9, name: "Carpenters" },
  { id: 15, name: "Chimney and Fireplace" },
  { id: 20, name: "Cleaning" },
  { id: 7, name: "Concrete & Foundation" },
  { id: 6, name: "Drywall Contractors" },
  { id: 30, name: "Electrical" },
  { id: 18, name: "Excavation & Drainage" },
  { id: 14, name: "Exterior House Surface" },
  { id: 3, name: "Flooring Contractor" },
  { id: 25, name: "Garage Door" },
  { id: 22, name: "Glass, Door & Mirrors" },
  { id: 26, name: "Gutters" },
  { id: 4, name: "HVAC" },
  { id: 13, name: "Handyperson" },
  { id: 19, name: "Insulation, Ventilation & Solar" },
  { id: 17, name: "Lawn & Landscaping" },
  { id: 2, name: "Light Fixtures" },
  { id: 21, name: "Media and Home Security" },
  { id: 5, name: "Painters" },
  { id: 29, name: "Plumbing" },
  { id: 1, name: "Plumbing Fixtures" },
  { id: 23, name: "Pool, Spas & Outdoor Living" },
  { id: 27, name: "Remodelling Contractor" },
  { id: 8, name: "Roofing" },
  { id: 10, name: "Siding & Windows" },
  { id: 16, name: "Survey, Engineering & Architectural" },
  { id: 24, name: "Window Treatment & Awnings" },
];

const SignupPros = () => {
  const [images, setImages] = useState([null, null, null, null]);
  const [key, setKey] = React.useState(0);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    register,
    watch,
    getValues,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues,
    resolver: yupResolver(schema),
  });

  const selectedServices = watch("selectServices");
  const { fields, append, remove } = useFieldArray({
    control,
    name: "photos",
  });

  const [phone, setPhone] = React.useState("");

  const onSubmit = (data) => {
    setError();
    dispatch(professionalSignUp({ data, images }))
      .unwrap()
      .then((data) => {
        if (data === undefined) {
        } else {
          console.log(data);
          localStorage.setItem("token", data.data.token);
          localStorage.setItem("userType", "professional");
          Toastify({ data: "success", msg: `Welcome ${data.data.first_name}` });
          navigate("/company/professional");
          window.open(data.data.payment_url);
        }
      });

    reset();
    setKey((prevKey) => prevKey + 1);
  };

  const uploadMiltipleImages = (e, index) => {
    const file = e.target.files[0];
    const isImage = file && file.type.startsWith("image/");
    clearErrors(`photos[${index}].file`);
    if (!isImage) {
      setError(`photos[${index}].file`, {
        type: "manual",
        message: "Invalid file type. Please select a valid image.",
      });
    }
    const formData = new FormData();
    formData.append("image", file);
    dispatch(uploadImageAuth(formData))
      .unwrap()
      .then((res) => {
        setImages((prevImages) => {
          const newImages = [...prevImages];
          newImages[index] = res.image;
          return newImages;
        });
      });
  };
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const handleClickShowPassword = () => {
    setShowPassword((show) => !show);
  };
  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword((show) => !show);
  };
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const checkboxchanges = (service) => {
    // Use findIndex with a callback function
    const findIndex = selectedServices.findIndex((id) => id === service.id);
    if (findIndex === -1) {
      setValue("selectServices", [...selectedServices, service.id]);
    } else {
      // Use filter to remove the item at the found index
      const updatedServices = selectedServices.filter(
        (id, index) => index !== findIndex
      );
      setValue("selectServices", updatedServices);
    }
  };
  return (
    <div className="py-5 sign-up-bg bg-light-red">
      <div className="container">
        <div className="shadow-lg p-4 p-xl-5 rounded-4 bg-white">
          <h6 className="text-center underline-red">
            <span>DAZL IS FOR</span>
          </h6>
          <h2>Builders.Remodelers and Service Providers</h2>
          <p>
            Dazl is an online tool that enables service pros to streamline their
            project requests and to evaluate opportunities more selectively.
            Dazl's project opportunity pipeline is populated through two
            channels:
          </p>
          <div className="form-outer my-4">
            <form
              onSubmit={handleSubmit(onSubmit)}
              encType="multipart/form-data"
            >
              <div className="row">
                <div className={`form-row col-md-4 mb-3`}>
                  <Controller
                    name="firstName"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        className={` width-input form-control ${
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
                <div className={`form-row col-md-4 mb-3 `}>
                  <Controller
                    name="lastName"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        className={` width-input form-control ${
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

                <div className={`form-row mb-3 col-md-4`}>
                  <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        className={` width-input form-control ${
                          errors.email ? "error" : ""
                        }`}
                        placeholder="Email address*"
                      />
                    )}
                  />
                  {errors.email && (
                    <p className="text-danger mt-2">{errors.email.message}</p>
                  )}
                </div>

                <div className={`form-row mb-3 col-md-4 position-relative`}>
                  <Controller
                    name="password"
                    control={control}
                    render={({ field }) => (
                      <>
                        <input
                          {...field}
                          className={` width-input form-control ${
                            errors.password ? "error" : ""
                          }`}
                          placeholder="Create Password*"
                          type={showPassword ? "text" : "password"}
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
                <div className={`form-row col-md-4 mb-3 position-relative`}>
                  <Controller
                    name="confirmPassword"
                    control={control}
                    render={({ field }) => (
                      <>
                        <input
                          {...field}
                          className={` width-input form-control ${
                            errors.confirmPassword &&
                            watch("password") !== watch("confirmPassword")
                              ? "error"
                              : ""
                          }`}
                          placeholder="Confirm Password*"
                          type={showConfirmPassword ? "text" : "password"}
                        />
                        {errors.confirmPassword &&
                          watch("password") !== watch("confirmPassword") && (
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

                <div className={`form-row mb-3 col-md-4`}>
                  <Controller
                    name="companyName"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        className={` width-input form-control  ${
                          errors.companyName ? "error" : ""
                        }`}
                        placeholder="Company Name *"
                      />
                    )}
                  />
                  {errors.companyName && (
                    <p className="text-danger mt-2">
                      {errors.companyName.message}
                    </p>
                  )}
                </div>
                <div className={`form-row mb-3 col-12`}>
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
                        {/* {errors.zip && (
                        <p className="text-danger mt-2">{errors.zip.message}</p>
                      )} */}
                      </>
                    )}
                  />
                  {errors.zip && (
                    <p className="text-danger mt-2">{errors.zip.message}</p>
                  )}
                </div>
                <div className={`form-row col-md-4 mb-3`}>
                  <Controller
                    name="number"
                    control={control}
                    render={({ field }) => (
                      <>
                        {/* <input
                          type="text"
                          {...field}
                          className={` width-input form-control ${
                            errors.number ? "error" : ""
                          }`}
                          placeholder="Company Number*"
                          onKeyPress={(e) => {
                            // Allow only numeric values and specific keys (e.g., Backspace, Delete, Arrow keys)
                            const isValidInput = /^[0-9\b]+$/.test(e.key);
                            if (!isValidInput) {
                              e.preventDefault();
                            }
                          }}
                        /> */}
                        {/* <input
                          type="text"
                          {...field}
                          className={`width-input form-control ${
                            errors.number ? "error" : ""
                          }`}
                          placeholder="Company Number*"
                          value={field.value} // Ensure the input reflects the current value
                          onChange={(e) => {
                            console.log("<====>", e.target.value);
                            // Allow only numbers and dashes
                            const formattedValue = e.target.value
                              .replace(/[^0-9-]/g, "") // Remove all non-numeric and non-dash characters
                              .replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3"); // Example format: XXX-XXX-XXXX

                            // Update the input value
                            field.onChange({
                              target: { value: formattedValue },
                            });
                          }}
                          onKeyPress={(e) => {
                            // Allow only numeric values and dashes
                            const isValidInput = /^[0-9\b-]+$/.test(e.key);
                            if (!isValidInput) {
                              e.preventDefault();
                            }
                          }}
                        /> */}
                        {/* 
                        {errors.number && (
                          <p className="text-danger">{errors.number.message}</p>
                        )} */}

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
                            // Allow only numbers and dashes
                            const formattedValue = e
                              .replace(/[^0-9-]/g, "") // Remove all non-numeric and non-dash characters
                              .replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3"); // Example format: XXX-XXX-XXXX
                            // Update the input value
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
                        {/* {errors?.mobilenumber && (
                          <p className="text-danger">
                            {errors?.mobilenumber?.message}
                          </p>
                        )} */}

                        {errors.number && (
                          <p className="text-danger">{errors.number.message}</p>
                        )}
                      </>
                    )}
                  />
                </div>
                {/* <div className={`form-row col-md-4 mb-3`}>
                  <PhoneInput
                    country={"us"}
                    enableSearch={true}
                    value={phone}
                    onChange={(phone) => {
                      setPhone(phone);
                      setValue("mobilenumber", phone, { shouldValidate: true });
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
                  {errors?.mobilenumber && (
                    <p className="text-danger">
                      {errors?.mobilenumber?.message}
                    </p>
                  )}
                </div> */}
                <div className={`form-row col-md-4 mb-3`}>
                  <Controller
                    name="yearofbusiness"
                    control={control}
                    render={({ field }) => (
                      <>
                        <input
                          type="text"
                          {...field}
                          className={` form-control  ${
                            errors.yearofbusiness ? "error" : ""
                          }`}
                          placeholder="Year in business*"
                          onKeyPress={(e) => {
                            // Allow only numeric values and specific keys (e.g., Backspace, Delete, Arrow keys)
                            const isValidInput = /^[0-9\b]+$/.test(e.key);
                            if (!isValidInput) {
                              e.preventDefault();
                            }
                          }}
                        />
                        {errors.yearofbusiness && (
                          <p className="text-danger">
                            {errors.yearofbusiness.message}
                          </p>
                        )}
                      </>
                    )}
                  />
                </div>
              </div>
              {/* ========NEXT ROW======= */}
              <div className="row">
                <div className="col-md-6">
                  <h6 className="my-3">Social Media And Marketing</h6>
                  <div className={`form-row mb-3`}>
                    <Controller
                      name="websiteLink"
                      control={control}
                      render={({ field }) => (
                        <>
                          <input
                            type="text"
                            {...field}
                            className={`form-control ${
                              errors.websiteLink ? "error" : ""
                            }`}
                            placeholder="Website Link"
                          />
                          {errors.websiteLink && (
                            <p className="text-danger">
                              {errors.websiteLink.message}
                            </p>
                          )}
                        </>
                      )}
                    />
                  </div>

                  {/* Facebook link field */}
                  <div className={`form-row mb-3`}>
                    <Controller
                      name="facebookLink"
                      control={control}
                      render={({ field }) => (
                        <>
                          <input
                            type="text"
                            {...field}
                            className={`form-control ${
                              errors.facebookLink ? "error" : ""
                            }`}
                            placeholder="Facebook Link"
                          />
                          {errors.facebookLink && (
                            <p className="text-danger">
                              {errors.facebookLink.message}
                            </p>
                          )}
                        </>
                      )}
                    />
                  </div>

                  {/* X link field */}
                  <div className={`form-row mb-3`}>
                    <Controller
                      name="XLink"
                      control={control}
                      render={({ field }) => (
                        <>
                          <input
                            type="text"
                            {...field}
                            className={`form-control ${
                              errors.Xlink ? "error" : ""
                            }`}
                            placeholder="X Link"
                          />
                          {errors.Xlink && (
                            <p className="text-danger">
                              {errors.Xlink.message}
                            </p>
                          )}
                        </>
                      )}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <h6 className="my-3">Required Insurance Info</h6>
                  <div className={`form-row mb-3`}>
                    <Controller
                      name="insuranceCompany"
                      control={control}
                      render={({ field }) => (
                        <>
                          <input
                            type="text"
                            {...field}
                            className={`form-control ${
                              errors.insuranceCompany ? "error" : ""
                            }`}
                            placeholder="Insurance Company"
                          />
                          {/* {errors.number && <p className='text-danger'>{errors.number.message}</p>} */}
                        </>
                      )}
                    />
                  </div>
                  <div className={`form-row mb-3`}>
                    <Controller
                      name="contactPerson"
                      control={control}
                      render={({ field }) => (
                        <>
                          <input
                            type="text"
                            {...field}
                            className={`form-control ${
                              errors.contactPerson ? "error" : ""
                            }`}
                            placeholder="Contact Person or Agent"
                            onKeyPress={(e) => {
                              const isValidInput = /^[a-zA-Z0-9]*$/.test(e.key);
                              if (!isValidInput) {
                                e.preventDefault();
                              }
                            }}
                          />
                          {/* {errors.number && <p className='text-danger'>{errors.number.message}</p>} */}
                        </>
                      )}
                    />
                  </div>
                  <div className={`form-row mb-3`}>
                    <Controller
                      name="insuranceNumber"
                      control={control}
                      render={({ field }) => (
                        <>
                          <PhoneInput
                            country={"us"}
                            type="text"
                            {...field}
                            className={` ${
                              errors.insuranceNumber ? "error" : ""
                            }`}
                            placeholder="Contact Number "
                            onKeyPress={(e) => {
                              // Allow only numeric values and specific keys (e.g., Backspace, Delete, Arrow keys)
                              const isValidInput = /^[0-9\b]+$/.test(e.key);
                              if (!isValidInput) {
                                e.preventDefault();
                              }
                            }}
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

                          {/* {errors.number && <p className='text-danger'>{errors.number.message}</p>} */}
                        </>
                      )}
                    />
                  </div>
                </div>
              </div>
              {/* Services checkboxes */}
              <div className="">
                <h6 className="my-3">Services you Provide</h6>
                <div className="row">
                  {services.map((service, index) => (
                    <div key={index} className="col-md-4">
                      <label className="mb-2 d-flex">
                        <Controller
                          name={`services.${service.name}`}
                          control={control}
                          render={({ field }) => (
                            <>
                              <input
                                type="checkbox"
                                {...field}
                                defaultChecked={field.value}
                                onClick={() => checkboxchanges(service)}
                                className="form-check-input me-2"
                              />
                              <span>{service.name}</span>
                            </>
                          )}
                        />
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="">
                <h6 className="my-3">
                  Upload photos that represent your business.
                </h6>
                <div className="row">
                  {fields.map((field, index) => (
                    <div key={index} className="col-lg-3 col-md-6 mb-3 mb-lg-0">
                      <label className="bg-light p-3 rounded-4 w-100">
                        Photo {index + 1}
                        <input
                          type="file"
                          className={`form-control ${
                            errors.photos && errors?.photos[index]?.file
                              ? "error"
                              : ""
                          }`}
                          {...register(`photos.${index}.file`)}
                          accept="image/*"
                          onChange={(e) => {
                            uploadMiltipleImages(e, index);
                          }}
                        />
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="form-row my-3 d-flex justify-content-between">
                <FormGroup className="d-flex flex-row flex-wrap align-items-center">
                  <Controller
                    name="agreeToTerms"
                    key={key}
                    control={control}
                    defaultValue={false}
                    render={({ field }) => (
                      <FormControlLabel
                        control={
                          <Checkbox
                            {...field}
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
                  <h6 className="d-block mt-3 fw-bold mb-sm-0 mb-3">
                    Choose Subscription:
                  </h6>
                  <Controller
                    name="subscription"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <RadioGroup {...field} className="row flex-row">
                        <FormControlLabel
                          value="monthly"
                          control={
                            <Radio
                              className={`p-0 me-2  ${
                                errors.subscription ? "errorSub" : ""
                              }`}
                            />
                          }
                          label="$50 per month"
                          className="col-md-4 col-sm-6 mb-3 mx-0"
                        />
                        {/* <FormControlLabel
                          value="yearly"
                          control={
                            <Radio
                              className={`p-0 me-2  ${
                                errors.subscription ? "errorSub" : ""
                              }`}
                            />
                          }
                          label="$550 per year"
                          className="col-md-4 col-sm-6 mb-3 mx-0"
                        /> */}
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
                <a href="/login/professional" className="text-primary">
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

export default SignupPros;
