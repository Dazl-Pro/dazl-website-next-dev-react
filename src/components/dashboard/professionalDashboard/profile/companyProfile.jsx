import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "./companyProfile.css";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch } from "react-redux";
import {
  UpdateCompanyProfile,
  UpdateCompanyProfileSecond,
  getCompanyProfile,
} from "../../../../store/dashboard/dashboardSlice";
import { uploadImageAuth } from "../../../../store/auth/authSlice";
import DeleteIcon from "@mui/icons-material/Delete";
import PhoneInput from "react-phone-input-2";

import "react-phone-input-2/lib/bootstrap.css";

const defaultValues = {
  company_name: "",
  address: "",
  company_city: "",
  state: "",
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
  // company_name: yup
  //   .string()
  //   .required("Name is required")
  //   .min(3, "Name have atleast 3 characters"),
  // address: yup
  // .string()
  // .required("Name is required")
  // .min(3, "Name have atleast 3 characters"),
  // address: yup
  // .string()
  // .required("Name is required")
  // .min(3, "Name have atleast 3 characters"),
  // address: yup
  // .string()
  // .required("Name is required")
  // .min(3, "Name have atleast 3 characters"),
  yearofbusiness: yup.string(),
  email: yup
    .string()
    .email("Please enter valid email address")
    .required("Email is required")
    .trim(),
  insuranceCertificate: yup.string().trim(),
  phoneNumber: yup
    .string()
    .matches(/^[0-9]+$/, "Phone number is required")
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
  const [images, setImages] = useState([]);
  const [phone, setPhone] = React.useState("");

  // console.log("images", images);

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
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues,
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    console.log("-------------ssss------", data);
    console.log("-------------ssss------", images);

    if (disable) {
      dispatch(UpdateCompanyProfile({ values: data, images }));

      dispatch(
        UpdateCompanyProfileSecond({
          // data: {
          company_name: data.company_name,
          address: data.address,
          company_city: data.company_city,
          state: data.state,
          // },
        })
      );
      reset();
      setDisable(false);
    } else {
      setDisable(true);
    }
  };

  const handleDelete = (index) => {
    if (images) {
      const updatedImages = [...images];
      updatedImages[index] = "undefined"; // Set the image to "undefined" instead of undefined
      setImages(updatedImages);
      setDisable(true); // Set disable to true when an image is deleted
    }
  };

  const uploadImage = (e, index) => {
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

  useEffect(() => {
    setValue("company_name", companydata?.name);
    setValue("address", companydata?.address);
    setValue("company_city", companydata?.city);
    setValue("state", companydata?.state);

    setValue("yearofbusiness", companydata?.years_in_business);
    setValue("phoneNumber", companydata?.phone);
    setValue("email", companydata?.email);
    setPhone(companydata?.phone);
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
            <div className="d-flex flex-row justify-content-between align-items-center">
              <Controller
                name="company_name"
                control={control}
                render={({ field }) => (
                  <label className="bg-light p-2 m-3 rounded-4 w-100">
                    Name:
                    <input
                      {...field}
                      disabled={!disable}
                      className={` form-control width-input ${
                        errors.companydata?.company_name ? "error" : ""
                      }`}
                      placeholder="Enter your Company-name"
                    />
                  </label>
                )}
              />

              {/* <h3 className="text-capitalize">Name: {companydata?.company_name}</h3> */}
              <div>
                {companydata?.website && (
                  <a
                    href={companydata.website}
                    target="_blank"
                    className="btn btn-sm btn-danger m-1"
                  >
                    Website
                  </a>
                )}
                {companydata?.facebook && (
                  <a
                    href={companydata.facebook}
                    target="_blank"
                    className="btn btn-sm btn-danger m-1"
                  >
                    <svg
                      class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-i4bv87-MuiSvgIcon-root"
                      focusable="false"
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      data-testid="FacebookIcon"
                    >
                      <path d="M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2m13 2h-2.5A3.5 3.5 0 0 0 12 8.5V11h-2v3h2v7h3v-7h3v-3h-3V9a1 1 0 0 1 1-1h2V5z"></path>
                    </svg>
                  </a>
                )}
                {companydata?.twitter && (
                  <a
                    href={companydata.twitter}
                    target="_blank"
                    className="btn btn-sm btn-danger m-1"
                  >
                    <svg
                      class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-i4bv87-MuiSvgIcon-root"
                      focusable="false"
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      data-testid="XIcon"
                    >
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
                    </svg>
                  </a>
                )}
              </div>
            </div>

            <div className="row">
              <p className="col-md-4">
                <div className="col-inner bg-light p-3 rounded-3">
                  <Controller
                    name="address"
                    control={control}
                    render={({ field }) => (
                      <label className="bg-light p-2 rounded-4 w-100">
                        Address:
                        <input
                          {...field}
                          disabled={!disable}
                          className={` form-control width-input ${
                            errors.companydata?.address ? "error" : ""
                          }`}
                          placeholder="Enter your address"
                        />
                      </label>
                    )}
                  />
                  {/* // <span className="d-block fw-bold">Address:</span>
                  // <span>{companydata?.address}</span> */}
                </div>
              </p>
              <p className="col-md-4">
                <div className="col-inner bg-light p-3 rounded-3">
                  <Controller
                    name="company_city"
                    control={control}
                    render={({ field }) => (
                      <label className="bg-light p-2 rounded-4 w-100">
                        City:
                        <input
                          {...field}
                          disabled={!disable}
                          className={` form-control width-input ${
                            errors.companydata?.company_city ? "error" : ""
                          }`}
                          placeholder="Enter your city"
                        />
                      </label>
                    )}
                  />
                  {/* <span className="d-block fw-bold">City:</span>
                  <span>{companydata?.city}</span> */}
                </div>
              </p>
              <p className="col-md-4">
                <div className="col-inner bg-light p-3 rounded-3">
                  <Controller
                    name="state"
                    control={control}
                    render={({ field }) => (
                      <label className="bg-light p-2 rounded-4 w-100">
                        State:
                        <input
                          {...field}
                          disabled={!disable}
                          className={` form-control width-input ${
                            errors.companydata?.state ? "error" : ""
                          }`}
                          placeholder="Enter your state"
                        />
                      </label>
                    )}
                  />
                  {/* <span className="d-block fw-bold">State:</span>
                  <span>{companydata?.state}</span> */}
                </div>
              </p>
            </div>
            <div className="row mb-3 mt-3">
              {images?.map((photo, index) => (
                <div key={index} className="col-md-3 mb-3 text-center  ">
                  <div
                    className="col-inner rounded-3 bg-light d-flex flex-column align-items-center justify-content-center h-100 "
                    style={{
                      maxHeight: "100%",
                      position: "relative",
                    }}
                  >
                    {photo !== "undefined" ? (
                      <>
                        <img
                          src={photo}
                          alt="Profile"
                          className="rounded-full"
                          style={{
                            width: "100%",
                            height: "100%",
                          }}
                        />
                        {disable && (
                          <button
                            type="button"
                            class="btn btn-light bg-light-red border-danger p-1 space delete-button"
                            onClick={() => handleDelete(index)}
                            style={{
                              position: "absolute",
                              top: "10px",
                              right: "10px",
                            }}
                          >
                            <DeleteIcon />
                          </button>
                        )}
                      </>
                    ) : (
                      ""
                    )}
                    {disable && (
                      <>
                        {photo === "undefined" ? "Image Not Uploaded" : ""}
                        <input
                          type="file"
                          className={`form-control mt-2 form-image ${
                            errors[`image${index + 1}`] &&
                            errors[`image${index + 1}`].value
                              ? "error"
                              : ""
                          }`}
                          accept=".png, .jpg, .jpeg"
                          onChange={(e) => {
                            uploadImage(e, index);
                          }}
                        />
                      </>
                    )}
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
                        disabled={!disable}
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
                <label className="bg-light p-3 rounded-4 w-100">
                  Phone Number
                  <PhoneInput
                    disabled={!disable}
                    country={"us"}
                    enableSearch={true}
                    value={phone}
                    onChange={(phone) => {
                      setPhone(phone);
                      setValue("phoneNumber", phone, { shouldValidate: true });
                    }}
                    placeholder="+1 (545) 674-3543"
                    inputStyle={{
                      paddingTop: 8,
                      paddingBottom: 8,
                      width: "100%",
                      border: 0,

                      color: "black",
                      background: disable ? "#fff" : "#e9ecef",
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
                  {errors?.phoneNumber && (
                    <p className="text-danger">
                      {errors?.phoneNumber?.message}
                    </p>
                  )}
                </label>
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
                        disabled={!disable}
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
                        disabled={!disable}
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
                        disabled={!disable}
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
                        disabled={!disable}
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
