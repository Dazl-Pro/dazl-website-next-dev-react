import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "./companyProfile.css";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch } from "react-redux";
import {
  UpdateCompanyProfile,
  getCompanyProfile,
} from "../../../../store/dashboard/dashboardSlice";
import { uploadImageAuth } from "../../../../store/auth/authSlice";

const defaultValues = {
  yearofbusiness: "",
  insuranceCertificate: "",
  insuranceContactNumber: "",
  insuranceNumber: "",
  email: "",
  companyName: "",
  image1: "",
  image2: "",
  image3: "",
  image4: "",
};

const schema = yup.object().shape({
  yearofbusiness: yup.string().max(4, ""),
  email: yup
    .string()
    .email("Please enter valid email address")
    .required("Email is required")
    .trim(),
  insuranceCertificate: yup.string().trim(),
  phoneNumber: yup
    .string()
    .matches(/^[0-9]+$/, "Please enter a valid number")
    .required("Number is required")
    .trim(),
  insuranceContactNumber: yup.string().trim(),
  insuranceNumber: yup.string().trim(),
  image1: yup.string(),
  image2: yup.string(),
  image3: yup.string(),
  image4: yup.string(),
});

const CompanyProfile = () => {
  const userId = localStorage.getItem("userId");
  const dispatch = useDispatch();
  const Selector = useSelector((state) => state.dashboardSlice);
  const companydata = Selector.data.companydata;

  const [disable, setDisable] = React.useState(false);
  const [images, setImages] = useState(null);
  console.log("images", images);

  useEffect(() => {
    companydata &&
      setImages([
        companydata?.images1 ?? null,
        companydata?.images2 ?? null,
        companydata?.images3 ?? null,
        companydata?.images4 ?? null,
      ]);
  }, [companydata]);

  const {
    control,
    reset,
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues,
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    if (disable === true) {
      dispatch(UpdateCompanyProfile({ values: data, images }));
      reset();
      setDisable(false);
    } else {
      setDisable(true);
    }
  };

  const uploadImage = (e, index) => {
    setDisable(true);
    const file = e.target.files[0];

    const isImage = file && file.type.startsWith("image/");

    const formData = new FormData();
    formData.append("image", file);
    dispatch(uploadImageAuth(formData))
      .unwrap()
      .then((res) => {
        const newImage = res?.image?.startsWith("https://")
          ? res.image
          : `data:image/jpeg;base64,${res.image}`;

        setImages((prevImages) => {
          const newImages = [...prevImages];
          newImages[index] = newImage;
          return newImages;
        });
      });
  };
  React.useEffect(() => {
    setValue("yearofbusiness", companydata?.years_in_business);
    setValue("phoneNumber", companydata?.phone);
    setValue("email", companydata?.email);
    setValue(
      "insuranceContactNumber",
      companydata?.insurance_contact_number ?? ""
    );
    setValue("insuranceNumber", companydata?.insurance_number ?? "");
    setValue("insuranceCertificate", companydata?.insurance_certificate ?? "");
    if (companydata.length === 0) {
      dispatch(getCompanyProfile(userId));
    }
  }, [companydata, disable]);

  return (
    <div className="py-0">
      <div className="">
        <h2 className=" text-start mb-4 pb-4 border-bottom h3">
          Company Profile
        </h2>
        <div className="">
          <form onSubmit={handleSubmit(onSubmit)}>
            <h3>Name: {companydata?.name}</h3>
            <div className="row">
              <p className="col-md-4">
                <div className="col-inner bg-light p-3 rounded-3">
                  <span className="d-block fw-bold">Address:</span>
                  <span>{companydata?.address}</span>
                </div>
              </p>
              <p className="col-md-4">
                <div className="col-inner bg-light p-3 rounded-3">
                  <span className="d-block fw-bold">City:</span>
                  <span>{companydata?.city}</span>
                </div>
              </p>
              <p className="col-md-4">
                <div className="col-inner bg-light p-3 rounded-3">
                  <span className="d-block fw-bold">State:</span>
                  <span>{companydata?.state}</span>
                </div>
              </p>
            </div>
            <div className="row mb-3 mt-3">
              {images?.map((photo, index) => (
                <div key={index} className="col-md-3 mb-3 text-center  ">
                  <div
                    className="col-inner rounded-3 bg-light d-flex flex-column align-items-center justify-content-center h-100"
                    style={{
                      maxHeight: "100%",
                    }}
                  >
                    {photo !== "undefined" ? (
                      <img
                        src={photo}
                        alt="Profile"
                        className="rounded-full"
                        style={{
                          width: "100%",
                          height: "100%",
                        }}
                      />
                    ) : (
                      " Image Not Uploaded"
                    )}
                    <input
                      type="file"
                      className={`form-control form-image ${
                        errors[`image${index + 1}`] &&
                        errors[`image${index + 1}`].value
                          ? "error"
                          : ""
                      }`}
                      accept="image/*"
                      onChange={(e) => {
                        uploadImage(e, index);
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="row">
              <div className={`form-row mb-3 col-md-6`}>
                <Controller
                  name="yearofbusiness"
                  control={control}
                  render={({ field }) => (
                    <label className="bg-light p-3 rounded-4 w-100">
                      Years In Business
                      <input
                        {...field}
                        disabled={disable ? false : true}
                        className={` form-control width-input ${
                          errors.firstName ? "error" : ""
                        }`}
                        placeholder="Years In Business"
                      />
                    </label>
                  )}
                />
              </div>
              <div className={`form-row mb-3 col-md-6 `}>
                <Controller
                  name="phoneNumber"
                  control={control}
                  render={({ field }) => (
                    <label className="bg-light p-3 rounded-4 w-100">
                      Phone Number
                      <input
                        onKeyPress={(e) => {
                          // Allow only numeric values and specific keys (e.g., Backspace, Delete, Arrow keys)
                          const isValidInput = /^[0-9\b]+$/.test(e.key);
                          if (!isValidInput) {
                            e.preventDefault();
                          }
                        }}
                        {...field}
                        disabled={disable ? false : true}
                        className={` form-control  width-input${
                          errors.lastName ? "error" : ""
                        }`}
                        placeholder="Phone Number"
                      />
                    </label>
                  )}
                />
              </div>
              <div className={`form-row mb-3 col-md-6 `}>
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <label className="bg-light p-3 rounded-4 w-100">
                      Email Address
                      <input
                        {...field}
                        disabled={disable ? false : true}
                        className={` form-control  width-input ${
                          errors.email ? "error" : ""
                        }`}
                        placeholder="Email Address"
                      />
                    </label>
                  )}
                />
              </div>
              <div className={`form-row mb-3 col-md-6`}>
                <Controller
                  name="insuranceCertificate"
                  control={control}
                  render={({ field }) => (
                    <label className="bg-light p-3 rounded-4 w-100">
                      Company Name
                      <input
                        {...field}
                        disabled={disable ? false : true}
                        className={` form-control  width-input  ${
                          errors.companyName ? "error" : ""
                        }`}
                        placeholder="Insurance Certificate"
                      />
                    </label>
                  )}
                />
              </div>
              <div className={`form-row mb-3 col-md-6 `}>
                <Controller
                  name="insuranceContactNumber"
                  control={control}
                  render={({ field }) => (
                    <label className="bg-light p-3 rounded-4 w-100">
                      Insurance Contact
                      <input
                        {...field}
                        disabled={disable ? false : true}
                        className={` form-control  width-input${
                          errors.lastName ? "error" : ""
                        }`}
                        placeholder="Insurance Contact"
                      />
                    </label>
                  )}
                />
              </div>
              <div className={`form-row mb-3 col-md-6 `}>
                <Controller
                  name="insuranceNumber"
                  control={control}
                  render={({ field }) => (
                    <label className="bg-light p-3 rounded-4 w-100">
                      Insurance Number
                      <input
                        {...field}
                        disabled={disable ? false : true}
                        className={` form-control width-input${
                          errors.lastName ? "error" : ""
                        }`}
                        placeholder="Agent Phone Number "
                      />
                    </label>
                  )}
                />
              </div>
            </div>

            <div className="d-flex justify-content-center align-items-center">
              <button
                type="submit"
                className={`btn px-5 ${disable ? "btn-success" : "btn-danger"}`}
              >
                {disable ? "Save" : "Edit"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CompanyProfile;
