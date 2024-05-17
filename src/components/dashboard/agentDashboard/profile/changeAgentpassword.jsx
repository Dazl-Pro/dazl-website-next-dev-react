import React from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  changeAgentPassword,
  changeCustomerPassword,
} from "../../../../store/dashboard/dashboardSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import "./profile.css";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import IconButton from "@mui/material/IconButton";

const defaultValues = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

const schema = yup.object().shape({
  password: yup
  .string()
  .required("Password is required")
  .matches(
    /^(?=.*[A-Z])/,
    "Password must contain at least one uppercase letter"
  )
  .matches(/^(?=.*[0-9])/, "Password must contain at least one number")
  .min(8, "Password must be atleast 8 characters long")
    .required("Password is required")
    .trim(),
  currentPassword: yup
  .string()
  .required("Password is required")
  .matches(
    /^(?=.*[A-Z])/,
    "Password must contain at least one uppercase letter"
  )
  .matches(/^(?=.*[0-9])/, "Password must contain at least one number")
  .min(8, "Password must be atleast 8 characters long")
    .required("Password is required")
    .trim(),
  confirmPassword: yup
    .string()
    .required("Confirm password is required")
    .oneOf([yup.ref("newPassword")], "Passwords do not match")
    .trim(),
});

const ChangeAgentpassword = () => {
  const userType = localStorage.getItem("userType");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues,
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    if (userType === "customer") {
      dispatch(changeCustomerPassword(data))
        .unwrap()
        .then((data) => {
          navigate("/homeOwner/my-info");
        });
    } else {
      dispatch(changeAgentPassword(data))
        .unwrap()
        .then((data) => {
          navigate("/agent/agentprofile");
        });
    }

    reset();
  };
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [shownewPassword, setShownewPassword] = React.useState(false);
  const handleClickShowPassword = () => {
    setShowPassword((show) => !show);
  };
  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword((show) => !show);
  };
  const handleClickShownewPassword = () => {
    setShownewPassword((show) => !show);
  };
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  return (
    <div className="py-5 bg-light-red">
      <div className="container">
        <h2 className="text-uppercase text-center mb-4">Change Password</h2>
        <div className="shadow-lg bg-white rounded-4 p-4 p-xl-5 text-center mw-560px mx-auto">
          <div className="">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="row">
                <div className={`form-row mb-3 col-md-12 position-relative`}>
                  <Controller
                    name="currentPassword"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        className={`form-control ${
                          errors.currentPassword ? "error" : ""
                        }`}
                        placeholder="Enter Current Password"
                        type={showPassword ? "text" : "password"}
                      />
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
                    name="newPassword"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        className={`form-control ${
                          errors.newPassword ? "error" : ""
                        }`}
                        placeholder="Enter New Password"
                        type={shownewPassword ? "text" : "password"}
                      />
                    )}
                  />
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShownewPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                    className="position-absolute top-0 end-0 mx-0 bg-transparent border-0"
                  >
                    {shownewPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </div>

                <div className={`form-row mb-3 col-md-6 position-relative `}>
                  <Controller
                    name="confirmPassword"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        className={`form-control width-input ${
                          errors.confirmPassword ? "error" : ""
                        }`}
                        placeholder="Confirm New Password"
                        type={showConfirmPassword ? "text" : "password"}
                      />
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
              </div>
              <div className="d-flex justify-content-center align-items-center">
                <button type="submit" className="btn btn-primary">
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangeAgentpassword;
