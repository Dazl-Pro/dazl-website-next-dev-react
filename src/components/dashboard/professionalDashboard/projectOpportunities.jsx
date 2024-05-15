import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { projectOpportunities } from '../../../store/dashboard/dashboardSlice'
import { Table } from 'react-bootstrap'
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import PreviewIcon from "@mui/icons-material/Preview";

const ProjectOpportunities = () => {
  const dispatch = useDispatch()
  useEffect(() => { dispatch(projectOpportunities()) }, [])
  const Selector = useSelector((state) => state.dashboardSlice)
  const projectOpportunitiesData = Selector.data.projectOpportunities
  console.log(projectOpportunitiesData)
  return (
    <div className='py-0'>
      <div className="">
        <h2 className='text-uppercase text-start mb-4 pb-4 border-bottom h3'>Project opportunities</h2>
        <div className=' text-center fs-2 fw-bold text-red'>
          Project Opportunities
        </div>
        <div>{projectOpportunitiesData?.final
          ?.length > 0 ? (<Table striped bordered hover className="text-start w-100"><thead>
            <tr className="align-middle">
              <th>Sr No.</th>
              <th>Location</th>
              <th className="ps-3">Action</th>
            </tr>
          </thead><tbody> {projectOpportunitiesData?.final?.map((item, index) => {
            return (
              <tr key={index} className="align-middle">
                <td>{index + 1}</td>
                <td className="w-75">{item.customer.email}</td>
                <td className="ps-2">
                  <button
                    className="btn btn-outline-success mx-1 btn-sm"
                  // onClick={() => viewPhdAltHandler(item.id)}
                  >
                    <PreviewIcon />
                  </button>

                </td>
              </tr>
            );
          })}</tbody></Table>) : (<h5 className="text-center">No Record Found</h5>)}</div>
      </div>

    </div>
  )
}

export default ProjectOpportunities
