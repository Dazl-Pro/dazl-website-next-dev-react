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

const defaultValues = {
  yearofbusiness: "",
  insuranceCertificate: "",
  insuranceContactNumber: "",
  insuranceNumber: "",
  email: "",
  companyName: "",
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
  console.log("companydata", companydata);
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
              {companydata?.images1 === null ? (
                <p className="col-md-3 mb-3">
                  <div className="col-inner rounded-3 bg-light d-flex align-items-center justify-content-center h-100">
                    Image Not Uploaded
                  </div>
                </p>
              ) : (
                <div className="col-md-3 mb-3 text-center">
                  <img src={companydata?.images1} alt="" width={"150px"} />
                </div>
              )}
              {companydata?.images2 === null ? (
                <p className="col-md-3 mb-3">
                  <div className="col-inner rounded-3 bg-light d-flex align-items-center justify-content-center h-100">
                    Image Not Uploaded
                  </div>
                </p>
              ) : (
                <div className="col-md-3 mb-3 text-center">
                  <img src={companydata?.images2} alt="" width={"150px"} />
                </div>
              )}
              {companydata?.images3 === null ? (
                <p className="col-md-3 mb-3">
                  <div className="col-inner rounded-3 bg-light d-flex align-items-center justify-content-center h-100">
                    Image Not Uploaded
                  </div>
                </p>
              ) : (
                <div className="col-md-3 mb-3 text-center">
                  <img src={companydata?.images3} alt="" width={"150px"} />
                </div>
              )}
              {companydata?.images4 === null ? (
                <p className="col-md-3 mb-3">
                  <div className="col-inner rounded-3 bg-light d-flex align-items-center justify-content-center h-100">
                    Image Not Uploaded
                  </div>
                </p>
              ) : (
                <div className="col-md-3 mb-3 text-center">
                  <img src={companydata?.images4} alt="" width={"150px"} />
                </div>
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
