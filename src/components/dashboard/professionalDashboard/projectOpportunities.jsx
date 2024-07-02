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
        console.log("-----------", res.data.final);
        setFilteredData(res.data.final);
      });
  }, []);

  const Selector = useSelector((state) => state.dashboardSlice);
  const projectOpportunitiesData = Selector.data.projectOpportunities;
  console.log(projectOpportunitiesData);

  const [searchInput, setSearchInput] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
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
                {filteredData.map((item, index) => (
                  <tr key={index} className="align-middle">
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
                        // onClick={() => {
                        //   setShowModal(true);
                        // }}
                        onClick={() => {
                          setShowModal(true);
                          setProject(item.project_id);
                        }}

                        // dispatch(
                        //   deleteProfessionalProjects({
                        //     project_id: project_id,
                        //   })
                        // );
                      >
                        <DeleteIcon />
                      </button>
                    </td>
                  </tr>
                ))}
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
