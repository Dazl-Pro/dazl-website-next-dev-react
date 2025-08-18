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
import { useNavigate, useLocation } from "react-router-dom";
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
  const location = useLocation();
  const isEditRoute = location.pathname === "/company/companyProfile";

  // const [disable, setDisable] = React.useState(false);
  const [disable, setDisable] = React.useState(isEditRoute);
  useEffect(() => {
    setDisable(isEditRoute);
  }, [isEditRoute]);
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
   const navigate = useNavigate();
  const onSubmit = (data) => {
  

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
      navigate("/company/companyProfile/company-profile-view");
    
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
    <div className="container py-3">
    <div className="card shadow-sm border-0 rounded-4">
      <div className="card-header">
      <h2 className="h4 mb-4 border-bottom pb-2">Company Profile</h2>
      </div>
      <div className="card-body">
  
  
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Row 1: Company Name + Insurance Contact */}
          <div className="row g-3">
            <div className="col-md-6">
              <Controller
                name="company_name"
                control={control}
                render={({ field }) => (
                  <div className="form-group">
                    <label className="fw-semibold">Company Name</label>
                    <input
                      {...field}
                      disabled={!disable}
                      className={`form-control ${
                        errors.companydata?.company_name ? "is-invalid" : ""
                      }`}
                      placeholder="Enter your Company Name"
                    />
                  </div>
                )}
              />
                <div className="">
              <Controller
                name="address"
                control={control}
                render={({ field }) => (
                  <div className="form-group">
                    <label className="fw-semibold">Address</label>
                    <input
                      {...field}
                      disabled={!disable}
                      className={`form-control ${
                        errors.companydata?.address ? "is-invalid" : ""
                      }`}
                      placeholder="Enter your address"
                    />
                  </div>
                )}
              />
            </div>
            </div>
  
            <div className="col-md-6">
              <Controller
                name="insuranceContactNumber"
                control={control}
                render={({ field }) => (
                  <div className="form-group">
                    <label className="fw-semibold">Insurance Contact</label>
                    <input
                      {...field}
                      disabled={!disable}
                      className={`form-control ${
                        errors.insuranceContactNumber ? "is-invalid" : ""
                      }`}
                      placeholder="Insurance Contact"
                    />
                  </div>
                )}
              />
                    {/* Social Links */}
          <div className="mb-4 mt-2">
            <h6 className="fw-bold line">Company Links</h6>
            <div className="d-flex flex-wrap gap-2">
              {companydata?.website && (
                <a
                  href={companydata.website}
                  target="_blank"
                  className="btn btn-outline-primary btn-sm btn-bg"
                >
                  Website
                </a>
              )}
              {companydata?.facebook && (
                <a
                  href={companydata.facebook}
                  target="_blank"
                  className="btn btn-outline-primary btn-sm btn-bg"
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
                  className="btn btn-outline-primary btn-sm btn-bg"
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
            </div>
          </div>
  
          {/* Row 2: Address + City + State */}
          <div className="row g-3 mb-3">
            {/* <div className="col-md-4">
              <Controller
                name="address"
                control={control}
                render={({ field }) => (
                  <div className="form-group">
                    <label className="fw-semibold">Address</label>
                    <input
                      {...field}
                      disabled={!disable}
                      className={`form-control ${
                        errors.companydata?.address ? "is-invalid" : ""
                      }`}
                      placeholder="Enter your address"
                    />
                  </div>
                )}
              />
            </div> */}
  
            <div className="col-md-6">
              <Controller
                name="company_city"
                control={control}
                render={({ field }) => (
                  <div className="form-group">
                    <label className="fw-semibold">City</label>
                    <input
                      {...field}
                      disabled={!disable}
                      className={`form-control ${
                        errors.companydata?.company_city ? "is-invalid" : ""
                      }`}
                      placeholder="Enter your city"
                    />
                  </div>
                )}
              />
            </div>
  
            <div className="col-md-6">
              <Controller
                name="state"
                control={control}
                render={({ field }) => (
                  <div className="form-group">
                    <label className="fw-semibold">State</label>
                    <input
                      {...field}
                      disabled={!disable}
                      className={`form-control ${
                        errors.companydata?.state ? "is-invalid" : ""
                      }`}
                      placeholder="Enter your state"
                    />
                  </div>
                )}
              />
            </div>
          </div>
  
          {/* Row 3: Business Years + Phone */}
          <div className="row g-3 mb-3">
            <div className="col-md-6">
              <Controller
                name="yearofbusiness"
                control={control}
                render={({ field }) => (
                  <div className="form-group">
                    <label className="fw-semibold">Years in Business</label>
                    <input
                      {...field}
                      disabled={!disable}
                      className={`form-control ${
                        errors.yearofbusiness ? "is-invalid" : ""
                      }`}
                      placeholder="Years in Business"
                    />
                  </div>
                )}
              />
            </div>
  
            <div className="col-md-6">
              <div className="form-group">
                <label className="fw-semibold">Phone Number</label>
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
                    width: "100%",
                    height: "40px",
                  }}
                  containerStyle={{
                    border: "1px solid #ced4da",
                    borderRadius: "6px",
                  }}
                />
                {errors?.phoneNumber && (
                  <p className="text-danger small">
                    {errors?.phoneNumber?.message}
                  </p>
                )}
              </div>
            </div>
          </div>
  
          {/* Row 4: Email + Insurance */}
          <div className="row g-3 mb-3">
            <div className="col-md-6">
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <div className="form-group">
                    <label className="fw-semibold">Email Address</label>
                    <input
                      {...field}
                      disabled={!disable}
                      className={`form-control ${
                        errors.email ? "is-invalid" : ""
                      }`}
                      placeholder="Email Address"
                    />
                  </div>
                )}
              />
            </div>
  
            <div className="col-md-6">
              <Controller
                name="insuranceCertificate"
                control={control}
                render={({ field }) => (
                  <div className="form-group">
                    <label className="fw-semibold">Insurance Certificate</label>
                    <input
                      {...field}
                      disabled={!disable}
                      className={`form-control ${
                        errors.insuranceCertificate ? "is-invalid" : ""
                      }`}
                      placeholder="Insurance Certificate"
                    />
                  </div>
                )}
              />
            </div>
          </div>
  
          {/* Row 5: Insurance Number */}
          <div className="row g-3 mb-4">
            <div className="col-md-12">
              <Controller
                name="insuranceNumber"
                control={control}
                render={({ field }) => (
                  <div className="form-group">
                    <label className="fw-semibold">Insurance Number</label>
                    <input
                      {...field}
                      disabled={!disable}
                      className={`form-control ${
                        errors.insuranceNumber ? "is-invalid" : ""
                      }`}
                      placeholder="Insurance Number"
                    />
                  </div>
                )}
              />
            </div>
          </div>
  
    
  
          {/* Images */}
          <div className="row mb-4">
            {images?.map((photo, index) => (
              <div key={index} className="col-lg-3  col-md-4 col-sm-6 mb-3">
                <div className="border rounded-3 p-2 text-center position-relative min-h">
                  {photo !== "undefined" ? (
                    <>
                      <img
                        src={photo}
                        alt="Profile"
                        className="img-fluid rounded-3"
                      />
                      {disable && (
                        <button
                          type="button"
                          className="btn btn-sm btn-danger position-absolute top-0 end-0 m-1"
                          onClick={() => handleDelete(index)}
                        >
                          <DeleteIcon />
                        </button>
                      )}
                    </>
                  ) : (
                    "Image Not Uploaded"
                  )}
                  {disable && (
                    <input
                      type="file"
                      className="form-control mt-2"
                      accept=".png, .jpg, .jpeg"
                      onChange={(e) => uploadImage(e, index)}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
  
          {/* Submit */}
          <div className="text-center">
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
