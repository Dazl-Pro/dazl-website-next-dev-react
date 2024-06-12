import React from "react";
import { useSelector } from "react-redux";
import "./companyProfile.css";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch } from "react-redux";
import {
  UpdateCompanyProfile,
  getCompanyProfile,
} from "../../../../store/dashboard/dashboardSlice";
import {
  uploadImageAuth,
} from "../../../../store/auth/authSlice";

const defaultValues = {
  yearofbusiness: "",
  insuranceCertificate: "",
  insuranceContactNumber: "",
  insuranceNumber: "",
  email: "",
  companyName: "",
  images1: "",
  images2: "",
  images3: "",
  images4: "",
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

  const uploadImage = (e, index) => {
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
        // Call uploadImage here with appropriate parameters
        uploadImage(e, `images${index + 1}`);
      });
  };


  const onSubmit = (data) => {
    if (disable === true) {
      dispatch(UpdateCompanyProfile(data));
      reset();
      setDisable(false);
    } else {
      setDisable(true);
    }
  };
  React.useEffect(() => {
    setValue("yearofbusiness", companydata?.years_in_business);
    setValue("phoneNumber", companydata?.phone);
    setValue("email", companydata?.email);
    setValue("images1", companydata?.images1);
    setValue("images2", companydata?.images2);
    setValue("images3", companydata?.images3);
    setValue("images4", companydata?.images4);
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
            <div className="row">
  {disable ? (
    <div className="row">
      {[1, 2, 3, 4].map((index) => (
        <div className="col-md-3 mb-3 text-center" key={index}>
          <Controller
            name={`images${index}`}
            control={control}
            render={({ field }) => (
              companydata[`images${index}`] ? (
                <img src={companydata[`images${index}`]} alt="" width="150px" />
              ) : (
                <input
                  {...field}
                  type="file"
                  className={`form-control ${errors.photos && errors.photos.file ? "error" : ""}`}
                  onChange={(e) => uploadImage(e, index)}
                  accept="image/*"
                  disabled={!disable}
                />
              )
            )}
          />
        </div>
      ))}
    </div>
  ) : (
    <>
      {[1, 2, 3, 4].map((index) => (
        companydata[`images${index}`] && (
          <div className="col-md-3 mb-3 text-center" key={index}>
            <img src={companydata[`images${index}`]} alt="" width="150px" />
          </div>
        )
      ))}
    </>
  )}
</div>


            <div className="row">
              <div className={`form-row mb-3 col-md-6`}>
                <Controller
                  name="yearofbusiness"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      disabled={disable ? false : true}
                      className={` form-control width-input ${
                        errors.firstName ? "error" : ""
                      }`}
                      placeholder="Years In Business"
                    />
                  )}
                />
              </div>
              <div className={`form-row mb-3 col-md-6 `}>
                <Controller
                  name="phoneNumber"
                  control={control}
                  render={({ field }) => (
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
                      disabled={disable ? false : true}
                      className={` form-control  width-input ${
                        errors.email ? "error" : ""
                      }`}
                      placeholder="Email Address"
                    />
                  )}
                />
              </div>
              <div className={`form-row mb-3 col-md-6`}>
                <Controller
                  name="insuranceCertificate"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      disabled={disable ? false : true}
                      className={` form-control  width-input  ${
                        errors.companyName ? "error" : ""
                      }`}
                      placeholder="Insurance Certificate"
                    />
                  )}
                />
              </div>
              <div className={`form-row mb-3 col-md-6 `}>
                <Controller
                  name="insuranceContactNumber"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      disabled={disable ? false : true}
                      className={` form-control  width-input${
                        errors.lastName ? "error" : ""
                      }`}
                      placeholder="Insurance Contact"
                    />
                  )}
                />
              </div>
              <div className={`form-row mb-3 col-md-6 `}>
                <Controller
                  name="insuranceNumber"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      disabled={disable ? false : true}
                      className={` form-control width-input${
                        errors.lastName ? "error" : ""
                      }`}
                      placeholder="Agent Phone Number "
                    />
                  )}
                />
              </div>
            </div>
            <div className="d-flex justify-content-center align-items-center">
              <button type="submit" className="btn btn-primary px-5">
                {disable ? "Update" : "Edit"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CompanyProfile;
