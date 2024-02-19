import React from "react";
import "./loginRealtor.css";
import CommonForm from "../commonForm";

const LoginRealtor = () => {
  return (
    <div className='py-5 bg-light-red min-height-login'>
      <div className="container ">
        <div className='shadow-lg bg-white rounded-4 text-center mw-560px mx-auto'>
          <div className="form-container">
            <CommonForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginRealtor;
