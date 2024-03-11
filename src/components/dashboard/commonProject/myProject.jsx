import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import "./project.css";
import { useLocation } from "react-router-dom";
import {
  deleteAgentFeatures,
  deleteProjectFeatures,
  getAgentProject,
  getCustomerProject,
  updateAgentFeatures,
  updateReportFeatures,
} from "../../../store/dashboard/dashboardSlice";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import ModalImage from "react-modal-image";
const MyProject = () => {
  const [editItem, setEditItem] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [formData, setFormData] = useState({
    title: "",
  });
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  const closeViewer = () => {
    setIsViewerOpen(false);
  };
  const userType = localStorage.getItem("userType");
  const dispatch = useDispatch();
  const location = useLocation();
  const selector = useSelector((state) => state.dashboardSlice);
  const projectData =
    userType === "agent"
      ? selector.data.agentProjectData
      : selector.data.customerprojectData;
  const itemsPerPage = 5;
  const totalCount = projectData?.totalCount;
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  useEffect(() => {
    if (projectData?.length === 0) {
      if (location.pathname === "/homeOwner/my-project") {
        dispatch(getCustomerProject({ pageNo: 1, numberofdata: 5 }));
      } else {
        dispatch(getAgentProject({ pageNo: 1, numberofdata: 5 }));
      }
    }
  }, [projectData, location]);
  const handlePageChange = (event, value) => {
    if (location.pathname === "/homeOwner/my-project") {
      setPageNumber(value);
      dispatch(getCustomerProject({ pageNo: value, numberofdata: 5 }));
    } else {
      dispatch(getAgentProject({ pageNo: value, numberofdata: 5 }));
    }
  };

  const onChangeEdit = (item) => {
    setFormData((prevData) => ({
      ...prevData,
      ["title"]: item?.inspectionNotes,
    }));
    setEditItem(item?.feature_id);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (item, project_id) => {
    //e.preventDefault();
    // Access the form data for further processing
    const data = {
      feature_id: item?.feature_id,
      images: item?.images,
      inspectionNotes: item?.inspectionNotes,
    };
    if (location.pathname === "/homeOwner/my-project") {
      dispatch(
        updateReportFeatures({
          data: data,
          project_id: project_id,
          pageNo: pageNumber,
          numberofdata: 5,
        })
      );
      setEditItem(null);
    } else {
      dispatch(
        updateAgentFeatures({
          data: data,
          project_id: item?.feature_id,
          pageNo: pageNumber,
          numberofdata: 5,
        })
      );
      setEditItem(null);
    }
  };

  const deleteProject = (id) => {
    if (location.pathname === "/homeOwner/my-project") {
      dispatch(
        deleteProjectFeatures({
          project_id: id,
          pageNo: pageNumber,
          numberofdata: 5,
        })
      );
    } else {
      dispatch(
        deleteAgentFeatures({
          project_id: id,
          pageNo: pageNumber,
          numberofdata: 5,
        })
      );
    }
  };

  return (
    <div className="py-0">
      <div className="">
        <h2 className="h3 text-uppercase text-start mb-4 pb-4 border-bottom">
          {userType === "agent" ? " My Project " : " My Project"}
        </h2>
        <div className="">
          <div className="mb-4">
            <div className="row pb-3">
              <div className="col-md-6 text-start">
                <h5>
                  <span className="fw-semibold">Homeowner Name:</span>{" "}
                  {projectData?.customer_data?.owner_name ?? ""}
                </h5>
              </div>
              <div className="col-md-6 text-start">
                <h5>
                  <span className="fw-semibold">Email Address:</span>{" "}
                  {projectData?.customer_data?.email_address ?? ""}
                </h5>
              </div>
              <div className="col-md-6 text-start">
                <h5>
                  <span className="fw-semibold">Phone Number:</span>{" "}
                  {projectData?.customer_data?.phone_number ?? ""}{" "}
                </h5>
              </div>
              <div className="col-md-6 text-start">
                <h5>
                  <span className="fw-semibold">Zip Code:</span>{" "}
                  {projectData?.customer_data?.zip_code ?? ""}
                </h5>
              </div>
            </div>
          </div>

          <div className="">
            <div className="column-count">
              {projectData?.data?.length > 0
                ? projectData.data.map((items, index) => (
                    <div class="column-count-item" key={index}>
                      <div
                        className="grid-item rounded-4 p-0 border-0"
                        key={index}
                      >
                        {items?.roominfo?.map(
                          (roominfoItems, indexroomInfo) => {
                            return (
                              <div key={indexroomInfo}>
                                <h4 className="text-start my-projects-head">
                                  {roominfoItems?.room_name}
                                </h4>
                                <div className="d-flex flex-column gap-4 rounded-4 p-4 border">
                                  {roominfoItems.feature?.map((item, index) => (
                                    <div key={index}>
                                      <div className="ooo">
                                        <p className="item-nammeee fw-bold text-start fs-4">
                                          {item?.feature_name}
                                        </p>
                                        {item?.feature_id === editItem ? (
                                          <div className="input-mt mt-1">
                                            <input
                                              type="text"
                                              name="title"
                                              value={formData.title}
                                              onChange={handleChange}
                                              className="form-control"
                                            />
                                          </div>
                                        ) : (
                                          <p className="notessss text-start">
                                            {item?.inspectionNotes}
                                          </p>
                                        )}
                                        <div className="mt-2 text-start images-project-all">
                                          {item?.images?.map((img, index) => (
                                            <ModalImage
                                              key={index}
                                              small={img}
                                              large={img}
                                              alt="Full Size"
                                              hideDownload={true}
                                              isOpen={isViewerOpen}
                                              onClose={closeViewer}
                                            />
                                          ))}
                                        </div>
                                      </div>

                                      <div className="ed-del-icons ">
                                        <div className="ed-del-icons-div">
                                          {item?.feature_id === editItem ? (
                                            <button
                                              className="btn btn-success text-white"
                                              onClick={() =>
                                                handleSubmit(
                                                  item,
                                                  items?.project_id
                                                )
                                              }
                                            >
                                              <EditIcon />
                                              {"SAVE"}
                                            </button>
                                          ) : (
                                            <button
                                              className="btn btn-dark text-white"
                                              onClick={() => onChangeEdit(item)}
                                            >
                                              <EditIcon />
                                              {"EDIT"}
                                            </button>
                                          )}
                                        </div>
                                        <div className="ed-del-icons-div">
                                          <button
                                            className="btn btn-danger"
                                            onClick={() =>
                                              deleteProject(items?.project_id)
                                            }
                                          >
                                            <DeleteForeverIcon />
                                            <span class="del">DELETE</span>
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            );
                          }
                        )}
                      </div>
                    </div>
                  ))
                : ""}
            </div>
            {projectData?.data?.length === 0 && (
              <h5 className=" text-center fs-4 mt-5 border-bottom ">
                No Record Found
              </h5>
            )}
            <div className="d-flex justify-content-center align-items-center mt-5 pagination-cs">
              {projectData?.totalCount > 8 ? (
                <Stack spacing={2}>
                  <Pagination
                    count={totalPages}
                    color="primary"
                    className="pagination"
                    onChange={handlePageChange}
                  />
                </Stack>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProject;
