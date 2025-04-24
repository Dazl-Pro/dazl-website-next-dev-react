import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { projectOpportunities } from "../../../store/dashboard/dashboardSlice";
import { Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import PreviewIcon from "@mui/icons-material/Preview";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { Toastify } from "../../../services/toastify/toastContainer";

import DeleteIcon from "@mui/icons-material/Delete";
import { deleteProfessionalProjects } from "../../../store/dashboard/dashboardSlice";

const ProjectOpportunities = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(projectOpportunities())
      .unwrap()
      .then((res) => {
        const updatedData = res.data.final.map((item) => {
          let formattedDate = item.created_at;

          if (item.created_at) {
            const date = new Date(item.created_at);

            if (!isNaN(date.getTime())) {
              const year = date.getFullYear();
              const month = String(date.getMonth() + 1).padStart(2, "0");
              const day = String(date.getDate()).padStart(2, "0");

              formattedDate = `${year}-${month}-${day}`;
            }
          }

          return { ...item, created_at: formattedDate };
        });

        console.log("Updated Data: ", updatedData);
        setFilteredData(updatedData);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  }, []);

  // useEffect(() => {
  //   dispatch(projectOpportunities())
  //     .unwrap()
  //     .then((res) => {
  //       console.log("-----------", res.data.final);
  //       setFilteredData(res.data.final);
  //     });
  // }, []);

  const Selector = useSelector((state) => state.dashboardSlice);
  const projectOpportunitiesData = Selector.data.projectOpportunities;
  console.log(projectOpportunitiesData);

  const [searchInput, setSearchInput] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  console.log(
    "---------filter",
    filteredData?.[0]?.projectopportunities?.[0]?.is_interested
  );
  const [project, setProject] = useState("");

  const deleteProject = (project_id) => {
    console.log("------------?", project_id);
    // if (!project_id) {
    //   console.log(
    //     "project_id is undefined.................................................."
    //   );
    //   return;
    // }

    // dispatch(openConfirmPopup(true));

    dispatch(
      deleteProfessionalProjects({
        project_id: project_id,
      })
    )
      .unwrap()
      .then(() => {
        dispatch(projectOpportunities())
          .unwrap()
          .then((res) => {
            console.log("-----------", res.data.final);
            setFilteredData(res.data.final);
          });
      });
    if (dispatch === true) {
      Toastify({
        data: "success",
        msg: "Project delete  successfully",
      });
      return;

      // setFilteredData(
      //   filteredData.filter((item) => item.project_id !== project_id)
      // );
    }
  };

  const handleChange = (e) => {
    setSearchInput(e.target.value);
    const filtered = projectOpportunitiesData.final.filter((item) =>
      item.customer?.house?.address
        .toLowerCase()
        .includes(searchInput.toLowerCase())
    );
    setFilteredData(filtered);
  };

  const viewPhdHandler = (itemId) => {
    console.log(itemId);
    navigate(`/company/projectOpportunities/${itemId}`);
  };

  return (
    <div className="py-0">
      <div className="">
        <h2 className="text-uppercase text-start mb-4 pb-4 border-bottom h3">
          Project opportunities
        </h2>

        <div className="text-center fs-2 fw-bold text-red">
          Project Opportunities
        </div>

        <div>
          <input
            type="text"
            placeholder="Search By Location"
            onChange={handleChange}
            value={searchInput}
            className="form-control my-2 border-bottom border-dark"
          />
          {filteredData.length > 0 ? (
            <Table striped bordered hover className="text-start w-100">
              <thead>
                <tr className="align-middle">
                  <th>Sr-No</th>
                  <th>Date</th>
                  <th>Location</th>

                  <th className="ps-3">Action</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item, index) => {
                  const isInterested =
                    item?.projectopportunities?.[0]?.is_interested;
                  let rowClass = "table-white"; // Default gray

                  if (isInterested === 0) {
                    rowClass = "table-danger"; // Red row with red border
                  } else if (isInterested === 1) {
                    rowClass = "table-success"; // Green row with green border
                  }
                  return (
                    <tr key={index} className={`align-middle ${rowClass}`}>
                      <td>{index + 1}</td>
                      <td>{item.created_at}</td>
                      <td className="w-75">{item.customer?.house?.address}</td>
                      <td className="ps-2">
                        <button
                          className="btn btn-outline-success mx-1 btn-sm"
                          onClick={() => viewPhdHandler(item.project_id)}
                        >
                          <PreviewIcon />
                        </button>
                      </td>
                      <td>
                        <button
                          className="btn btn-outline-danger mx-1 btn-sm"
                          onClick={() => {
                            setShowModal(true);
                            setProject(item.project_id);
                          }}
                        >
                          <DeleteIcon />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          ) : (
            <h5 className="text-center">No Record Found</h5>
          )}
        </div>
      </div>
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Delete Project</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center fs-5">
            Are you sure you want to delete this project?
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            onClick={() => {
              deleteProject(project);
              setShowModal(false);
            }}
            className="px-4"
          >
            Yes
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              setShowModal(false);
            }}
            className="px-4"
          >
            No
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ProjectOpportunities;
