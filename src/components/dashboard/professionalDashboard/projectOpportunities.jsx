import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { projectOpportunities } from "../../../store/dashboard/dashboardSlice";
import { Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import PreviewIcon from "@mui/icons-material/Preview";

const ProjectOpportunities = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(projectOpportunities())
      .unwrap()
      .then((res) => {
        console.log("-----------", res);
        setFilteredData(res.data.final);
      });
  }, []);

  const Selector = useSelector((state) => state.dashboardSlice);
  const projectOpportunitiesData = Selector.data.projectOpportunities;
  console.log(projectOpportunitiesData);

  const [searchInput, setSearchInput] = useState("");
  const [filteredData, setFilteredData] = useState([]);

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
            placeholder="Search here"
            onChange={handleChange}
            value={searchInput}
          />
          {filteredData.length > 0 ? (
            <Table striped bordered hover className="text-start w-100">
              <thead>
                <tr className="align-middle">
                  <th>Sr-No</th>
                  <th>Location</th>
                  <th className="ps-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item, index) => (
                  <tr key={index} className="align-middle">
                    <td>{index + 1}</td>
                    <td className="w-75">{item.customer?.house?.address}</td>
                    <td className="ps-2">
                      <button
                        className="btn btn-outline-success mx-1 btn-sm"
                        onClick={() => viewPhdHandler(item.project_id)}
                      >
                        <PreviewIcon />
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
    </div>
  );
};

export default ProjectOpportunities;
