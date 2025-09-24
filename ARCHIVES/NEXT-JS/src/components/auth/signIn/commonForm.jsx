import React from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  agentSignin,
  customerSignin,
  professionalSignin,
} from "../../../store/auth/authSlice";
import { Toastify } from "../../../services/toastify/toastContainer";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import IconButton from "@mui/material/IconButton";

const schema = yup.object().shape({
  email: yup.string().email().required("email is required"),
  password: yup.string().required("password is required"),
});
const defaultValues = {
  email: "",
  password: "",
};
const CommonForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const {
    control,
    handleSubmit,
    formState: { errors },
    register,
    reset,
  } = useForm({
    mode: "onChange",
    defaultValues,
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    if (location.pathname === "/login/customer") {
      dispatch(customerSignin(data))
        .unwrap()
        .then((data) => {
          localStorage.setItem("token", data.data.token);
          localStorage.setItem("userType", "customer");
          Toastify({ data: "success", msg: `Welcome ${data.data.first_name}` });
          navigate("/homeOwner/dashboard");
        });
    } else if (location.pathname === "/login/realtor") {
      dispatch(agentSignin(data))
        .unwrap()
        .then((data) => {
          localStorage.setItem("token", data.data.token);
          localStorage.setItem("userType", "agent");
          Toastify({ data: "success", msg: `Welcome ${data.data.first_name}` });
          navigate("/agent/home");
        });
    } else {
      dispatch(professionalSignin(data))
        .unwrap()
        .then((data) => {
          localStorage.setItem("token", data.data.token);
          localStorage.setItem("userType", "professional");
          Toastify({ data: "success", msg: `Welcome ${data.data.first_name}` });
          navigate("/company/professional");
        });
    }
    reset();
  };
  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = () => {
    setShowPassword((show) => !show);
  };
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="px-4 py-5 bg-white mw-560px w-100 rounded-4 text-center"
    >
      <h6 className="contact-us-text text-uppercase underline-red fs-5 fw-bold text-center">
        <span>DAZL IS FOR</span>
      </h6>
      <h2 className="h2-tag text-uppercase mb-3">
        {location.pathname === "/login/customer"
          ? "Home owner"
          : location.pathname === "/login/realtor"
          ? "Agent"
          : "company"}
      </h2>
      <div className="form-row">
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <input
              {...field}
              type="text"
              id="email"
              placeholder="Enter your email address"
              className={`form-control ${errors.email ? "error" : ""}`}
            />
          )}
        />
      </div>

      <div className="form-row position-relative">
        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <input
              {...field}
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="Enter your password"
              className={`form-control ${errors.password ? "error" : ""}`}
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

      <p>
        Do not have an account?{" "}
        <a href="/signup-users" className="text-primary">
          Sign-Up
        </a>
      </p>

      <button className="sub-button btn btn-primary w-100" type="submit">
        Login
      </button>
    </form>
  );
};

export default CommonForm;
