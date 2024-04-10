import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./style.css";
import {
  getCompletePhd,
  openConfirmPopup,
  viewPhd,
} from "../../../../store/dashboard/dashboardSlice";
import { useNavigate } from "react-router-dom";
import Table from "react-bootstrap/Table";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import PreviewIcon from "@mui/icons-material/Preview";

const CompleteProject = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const selector = useSelector((state) => state.dashboardSlice);
  const completephd = [...selector.data.completePhd].sort().reverse();
  const filterData = completephd.filter((item) => item.final !== 0);

  useEffect(() => {
    dispatch(getCompletePhd());
  }, []);

  const viewPhdAltHandler = (itemId) => {
    navigate(`/agent/viewPhdAlt/${itemId}`);
  };

  const editPhdAltHandler = (itemId) => {
    navigate(`/agent/editPhd/rooms/${itemId}`);
  };

  return (
    <div className="py-0 ">
      <div className="">
        {/* Sidebar Start Here */}

        <div className="">
          <div className="">
            <div className="container-full">
              <h3 className="text-uppercase  mb-4  pb-4 border-bottom">
                PHD Project
              </h3>
              <div className="">
                {filterData.length > 0 ? (
                  <Table striped bordered hover className="text-start w-100">
                    <thead>
                      <tr className="align-middle">
                        <th>Sr No.</th>
                        <th>Location</th>
                        <th className="ps-3">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filterData.map((item, index) => {
                        return (
                          <tr key={index} className="align-middle">
                            <td>{index + 1}</td>
                            <td className="w-75">{item.location}</td>
                            <td className="ps-2">
                              <button
                                className="btn btn-outline-success mx-1 btn-sm"
                                onClick={() => viewPhdAltHandler(item.id)}
                              >
                                <PreviewIcon />
                              </button>
                              <button
                                className="btn btn-outline-danger mx-1 btn-sm"
                                onClick={() => (
                                  dispatch(
                                    viewPhd({ id: item.id, value: "close" })
                                  ),
                                  dispatch(openConfirmPopup(true))
                                )}
                              >
                                <DeleteIcon />
                              </button>
                              <button
                                className="btn btn-outline-primary mx-1 btn-sm"
                                onClick={() => editPhdAltHandler(item.id)}
                              >
                                <EditIcon />
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompleteProject;
