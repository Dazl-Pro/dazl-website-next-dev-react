import React, { useState } from "react";
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

const defaultValues = {
  yearofbusiness: "",
  insuranceCertificate: "",
  insuranceContactNumber: "",
  insuranceNumber: "",
  email: "",
  companyName: "",
  photos: Array.from({ length: 4 }, (_, index) => ({ image: null })),
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
});

const CompanyProfile = () => {
  const userId = localStorage.getItem("userId");
  const dispatch = useDispatch();
  const Selector = useSelector((state) => state.dashboardSlice);
  const companydata = Selector.data.companydata;
  const [disable, setDisable] = React.useState(false);
 const [images, setImages] = useState([null, null, null, null]);

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
      dispatch(UpdateCompanyProfile(data));
      reset();
      setDisable(false);
    } else {
      setDisable(true);
    }
  };
  const { fields, append, remove } = useFieldArray({
    control,
    name: "photos",
  });

  
  console.log(fields);
  
  const uploadMultipleImages = (e, index) => {
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
        setImages(
          res?.image?.startsWith("https://")
            ? res?.image
            : `data:image/jpeg;base64,${res?.image}`
        );
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
              
          {[0, 1, 2, 3].map((index) => (
            <div key={index} className="col-md-3 mb-3 text-center">
              {companydata[`images${index + 1}`] === null ? (
                <div className="col-inner rounded-3 bg-light d-flex align-items-center justify-content-center h-100">
                  Image Not Uploaded
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
                      uploadMultipleImages(e, index);
                    }}
                    disabled={disable}
                  />
                </div>
              ) : (
                <div>
                  <img src={companydata[`images${index + 1}`]} alt="" width="150px" />
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
                      uploadMultipleImages(e, index);
                    }}
                    disabled={disable}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
{/* 
            <div className="row mb-3 mt-3">
              {companydata?.images1 === null ? (
                <p className="col-md-3 mb-3">
                  <div className="col-inner rounded-3 bg-light d-flex align-items-center justify-content-center h-100">
                    Image Not Uploaded
                  </div>
                </p>
              ) : (
                <>
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
                </>
              )}
              

              {companydata?.images2 === null ? (
                <p className="col-md-3 mb-3">
                  <div className="col-inner rounded-3 bg-light d-flex align-items-center justify-content-center h-100">
                    Image Not Uploaded
                  </div>
                </p>
              ) : (
                <>
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
                </>
              )}

              {companydata?.images3 === null ? (
                <p className="col-md-3 mb-3">
                  <div className="col-inner rounded-3 bg-light d-flex align-items-center justify-content-center h-100">
                    Image Not Uploaded
                  </div>
                </p>
              ) : (
                <>
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
                </>
              )}

              {companydata?.images4 === null ? (
                <p className="col-md-3 mb-3">
                  <div className="col-inner rounded-3 bg-light d-flex align-items-center justify-content-center h-100">
                    Image Not Uploaded
                  </div>
                </p>
              ) : (
                <>
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
              </> 
              )}
            </div> */}
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
              <button type="submit" className="btn btn-primary px-5">{disable ? "Edit" : "Update"} </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CompanyProfile;

