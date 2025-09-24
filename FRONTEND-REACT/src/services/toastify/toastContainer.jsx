import React from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./toastify.css";
import { LazyLoadImage } from "react-lazy-load-image-component";

const ToastContainerPopup = () => {
  return (
    <ToastContainer
      position="top-right"
      autoClose={2000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
      className="btn-pd"
    />
  );
};

export default ToastContainerPopup;

export const Toastify = ({ data, msg }) => {
  const content = (
    <div style={{ display: "flex", alignItems: "center" }}>
      <LazyLoadImage
        src="/images/footerImages/footer.png"
        alt="icon"
        style={{ width: "20px", height: "20px", marginRight: "10px" }}
      />
      <span>{msg}</span>
    </div>
  );
  return data === "success"
    ? toast.success(content, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      })
    : toast.error(content, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
};
