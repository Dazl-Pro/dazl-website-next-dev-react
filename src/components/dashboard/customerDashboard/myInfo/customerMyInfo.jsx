import React from "react";
import { useSelector } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import {
  customerProfile,
  updatehomeOwnerProfile,
} from "../../../../store/dashboard/dashboardSlice";
import "./customerMyinfo.css";

const defaultValues = {
  firstName: "",
  lastName: "",
  email: "",
  number: "",
};

const schema = yup.object().shape({
  firstName: yup.string().required("First Name is required").trim(),
  lastName: yup.string().required("Last Name is required").trim(),
  email: yup
    .string()
    .email("Please enter valid email address")
    .required("Email is required")
    .trim(),
  number: yup
    .string()
    .matches(/^[0-9]+$/, "Please enter a valid number")
    .required("Number is required")
    .trim(),
});

const customerMyInfo = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const userId= localStorage.getItem("userId")
  const Selector = useSelector((state) => state.dashboardSlice);
  const customerData = Selector.data.customerData;
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
    if (disable) {
      dispatch(updatehomeOwnerProfile(data));
      reset();
      setDisable(false);
    } else {
      setDisable(true);
    }
  };
  React.useEffect(() => {
    setValue("firstName", customerData?.first_name);
    setValue("lastName", customerData?.last_name);
    setValue("email", customerData?.email);
    setValue("number", customerData.phone_number);
    if (customerData.length === 0) {
      dispatch(customerProfile());
    }
  }, [customerData]);
  return (
    <div className="py-0">
      <div className="">
        <h2 className="text-uppercase text-start mb-4 pb-4 border-bottom h3">
          MY Info
        </h2>
        <div className="">
          <div className="row">
            <h3 className="mb-3 h4">EDIT PROFILE</h3>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="row">
                <div className={`form-row mb-3 col-md-6`}>
                  <Controller
                    name="firstName"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        disabled={disable ? false : true}
                        className={`form-control ${
                          errors.firstName ? "error" : ""
                        }`}
                        placeholder="First Name"
                      />
                    )}
                  />
                </div>
                <div className={`form-row mb-3 col-md-6`}>
                  <Controller
                    name="lastName"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        disabled={disable ? false : true}
                        className={`form-control ${
                          errors.lastName ? "error" : ""
                        }`}
                        placeholder="Last Name"
                      />
                    )}
                  />
                </div>
                <div className={`form-row mb-3 col-md-6`}>
                  <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        disabled={disable ? false : true}
                        className={`form-control width-input ${
                          errors.email ? "error" : ""
                        }`}
                        placeholder="Email address"
                      />
                    )}
                  />
                </div>
                <div className={`form-row mb-3 col-md-6`}>
                  <Controller
                    name="number"
                    control={control}
                    render={({ field }) => (
                      <>
                        <input
                          type="text"
                          {...field}
                          disabled={disable ? false : true}
                          className={`form-control width-input ${
                            errors.number ? "error" : ""
                          }`}
                          onKeyPress={(e) => {
                            // Allow only numeric values and specific keys (e.g., Backspace, Delete, Arrow keys)
                            const isValidInput = /^[0-9\b]+$/.test(e.key);
                            if (!isValidInput) {
                              e.preventDefault();
                            }
                          }}
                          placeholder="Phone Number"
                        />
                        {/* {errors.number && <p className='text-danger'>{errors.number.message}</p>} */}
                      </>
                    )}
                  />
                </div>
              </div>

              <div className="d-flex justify-content-center align-items-center flex-column">
                <button
                  type="submit"
                  className="btn btn-primary mw-230px w-100 mt-2"
                >
                  {disable ? "Update" : "Edit"}
                </button>
                <h3 className="text-center my-2 h4">OR</h3>
                <button
                  className="btn btn-success mw-230px w-100"
                  onClick={() => navigate("/homeOwner/changePassword")}
                >
                  Change Password
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default customerMyInfo;
