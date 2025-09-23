// CompanyProfileView.js
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import {
  UpdateCompanyProfile,
  UpdateCompanyProfileSecond,
  getCompanyProfile,
} from "../../../../store/dashboard/dashboardSlice";
import "./edit-profile.css";
import { useNavigate } from "react-router-dom";
//   import { Navigate } from "react-router-dom";
const CompanyProfileView = () => {
  const userId = localStorage.getItem("userId");

  const dispatch = useDispatch();
  const Selector = useSelector((state) => state.dashboardSlice);

  const companydata = Selector.data.companydata;
  console.log("companydata", companydata);

  const [images, setImages] = useState([]);
  const [disable, setDisable] = React.useState(false);
  // useEffect(() => {
  //     companydata &&
  //         setImages([
  //             companydata?.images1 ?? null,
  //             companydata?.images2 ?? null,
  //             companydata?.images3 ?? null,
  //             companydata?.images4 ?? null,
  //         ]);
  // }, [companydata]);
  useEffect(() => {
    if (!companydata) return;

    const raw = [
      companydata?.images1 ?? null,
      companydata?.images2 ?? null,
      companydata?.images3 ?? null,
      companydata?.images4 ?? null,
    ];
    const filtered = raw.filter((img) => img && img !== "undefined");
    setImages(filtered);
  }, [companydata]);
  useEffect(() => {
    // setValue("company_name", companydata?.name);
    // setValue("address", companydata?.address);
    // setValue("company_city", companydata?.city);
    // setValue("state", companydata?.state);

    // setValue("yearofbusiness", companydata?.years_in_business);
    // setValue("phoneNumber", companydata?.phone);
    // setValue("email", companydata?.email);
    // setPhone(companydata?.phone);
    // setValue(
    //     "insuranceContactNumber",
    //     companydata?.insurance_contact_number ?? ""
    // );
    // setValue("insuranceNumber", companydata?.insurance_number ?? "");
    // setValue("insuranceCertificate", companydata?.insurance_certificate ?? "");
    if (companydata.length === 0) {
      dispatch(getCompanyProfile(userId));
    }
    {
      console.log("Facebook URL:", companydata?.facebook);
    }
    {
      console.log("Twitter URL:", companydata?.twitter);
    }
  }, [companydata, disable]);
  const navigate = useNavigate();
  const handleButtonClick = () => {
    // Edit action → navigate to your page
    navigate("/company/companyProfile");
  };
  const formatPhoneNumber = (phone) => {
    if (!phone) {
      return "Not Provided";
    }
    const cleaned = phone.replace(/\D/g, "");
    let formatted = "";
    for (let i = 0; i < cleaned.length; i++) {
      if (i > 0 && i % 3 === 0) {
        formatted += "-";
      }
      formatted += cleaned[i];
    }
    return formatted;
  };

  const isNonEmptyString = (s) =>
    typeof s === "string" && s.trim() !== "" && s !== "undefined";

  const isValidUrl = (s) => {
    if (!isNonEmptyString(s)) return false;
    try {
      // quick URL sanity check
      // new URL() will throw for clearly invalid strings
      new URL(s);
      return true;
    } catch {
      return false;
    }
  };

  const socialLinks = [
    { name: "facebook", url: companydata?.facebook },
    { name: "twitter", url: companydata?.twitter },
  ].filter((l) => isValidUrl(l.url));

  const renderIcon = (name) => {
    if (name === "facebook") {
      return (
        <svg
          className="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-i4bv87-MuiSvgIcon-root"
          focusable="false"
          aria-hidden="true"
          viewBox="0 0 24 24"
          data-testid="FacebookIcon"
          width="18"
          height="18"
        >
          <path d="M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2m13 2h-2.5A3.5 3.5 0 0 0 12 8.5V11h-2v3h2v7h3v-7h3v-3h-3V9a1 1 0 0 1 1-1h2V5z" />
        </svg>
      );
    }
    // twitter / X icon
    if (name === "twitter") {
      return (
        <svg
          className="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-i4bv87-MuiSvgIcon-root"
          focusable="false"
          aria-hidden="true"
          viewBox="0 0 24 24"
          data-testid="XIcon"
          width="18"
          height="18"
        >
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      );
    }
    return null;
  };

  return (
    <div className="container py-3">
      <div className="card shadow-sm border-0 rounded-4">
        <div className="card-header">
          <h2 className="h4 mb-4 border-bottom pb-2">Company Profile</h2>
        </div>
        <div className="card-body">
          <div className="row mb-4">
            <div className="col-md-8">
              <h3 className="fw-bold">{companydata?.name || "ABC Plumbing"}</h3>
              <p className="text-muted">
                {companydata?.address || "200 Main Street, Suite 100"}
              </p>
              <p className="text-muted">
                {companydata?.city && companydata?.state
                  ? `${companydata.city}, ${companydata.state}`
                  : "Anytown, USA"}
              </p>
            </div>
            <div className="col-md-4 text-md-end">
              <div className="d-flex flex-column">
                <p className="mb-1  text-start">
                  <span className="fw-semibold">
                    {" "}
                    Insurance Contact Number:
                  </span>{" "}
                  {companydata?.insurance_contact_number}
                </p>

                <div className="mb-4 mt-2">
                  <h6 className="fw-bold line d-flex align-items-center">
                    Company Links{" "}
                    <span className="ms-2">
                      {companydata?.website &&
                        isValidUrl(companydata.website) && (
                          <a
                            href={companydata.website}
                            target="_blank"
                            rel="noreferrer noopener"
                            className="btn btn-outline-primary btn-sm btn-bg"
                          >
                            Website
                          </a>
                        )}
                    </span>
                  </h6>

                  <div className="d-flex flex-wrap gap-2 ">
                    {/* {companydata?.website && (
                                            <a
                                                href={companydata.website}
                                                target="_blank"
                                                className="btn btn-outline-primary btn-sm btn-bg"
                                            >
                                                Website
                                            </a>
                                        )} */}

                    {socialLinks.length > 0 && (
                      <>
                        <h6 className="fw-bold line me-2">Social media:</h6>
                        <div className="d-flex gap-2 align-items-center">
                          {socialLinks.map((link) => (
                            <a
                              key={link.name}
                              href={link.url}
                              target="_blank"
                              rel="noreferrer noopener"
                              className="btn btn-outline-primary btn-sm btn-bg d-flex align-items-center justify-content-center"
                              title={link.name}
                              aria-label={link.name}
                            >
                              {renderIcon(link.name)}
                            </a>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <div className="row ">
              <div className="col-md-4">
                <p className="mb-1">
                  <span className="fw-semibold">Years In Businesse:</span>{" "}
                  {companydata?.years_in_business || "Not provided"}
                </p>
              </div>
              <div className="col-md-4">
                <p className="mb-1">
                  <span className="fw-semibold">Number:</span>
                  {formatPhoneNumber(companydata?.phone)}
                </p>
              </div>
              <div className="col-md-4">
                <p className="mb-1">
                  <span className="fw-semibold">Email:</span>{" "}
                  {companydata?.email || "Not provided"}
                </p>
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="row mb-4">
            {images && images.length > 0 ? (
              images.map((photo, index) => (
                <div key={index} className="col-lg-3 col-md-4 col-sm-6 mb-3">
                  <div className="border rounded-3 p-2 text-center position-relative min-h">
                    <img
                      src={photo}
                      alt={`Company ${index}`}
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
              ))
            ) : (
              <div className="col-12">
                <p className="text-muted">No images uploaded</p>
              </div>
            )}
          </div>

          <div className="text-center mt-4">
            <button className="btn btn-primary" onClick={handleButtonClick}>
              Edit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyProfileView;
