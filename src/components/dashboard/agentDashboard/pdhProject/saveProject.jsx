import React from 'react'
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCompletePhd, openConfirmPopup, viewPhd } from '../../../../store/dashboard/dashboardSlice';
import Table from "react-bootstrap/Table";
import DeleteIcon from '@mui/icons-material/Delete';
import Nav from 'react-bootstrap/Nav';
import "./style.css";

const SaveProject = () => {
  const dispatch=useDispatch()
  useEffect(() => {
    dispatch(getCompletePhd());
  }, []);
  const selector = useSelector((state) => state.dashboardSlice);
  const completephd = [...selector.data.completePhd].sort().reverse();
  const filterData= completephd.filter((item) => item.final === 0);
  return (
    <div className="py-0">
      <div className=''>
       

        <div className="">
          <div className="">
            <div className="container-full">
              <h3 className="mb-4 pb-4 border-bottom">PHD Project</h3>
              <div className="">
                {filterData.length>0 ?
                  <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>sr No.</th>
                      <th>Location</th>
                      <th>Action</th>
                    
                    </tr>
                  </thead>
                  <tbody>
                    {filterData.map((item,index)=>{
                      return(
                        <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{item.location}</td>
                        <td><button className='btn btn-success' onClick={(e)=>(e.preventDefault(), dispatch(viewPhd({id: item.id, value:"saveclose"})) )}>Save Project</button> 
                        <button className='btn btn-danger ms-2' onClick={()=>((dispatch(viewPhd({id: item.id, value:"close"})),dispatch(openConfirmPopup(true))))}><DeleteIcon/></button> </td>
                      </tr>
                      )
                    })}
                  
                  </tbody>
                </Table>: <h5 className="text-center">No Record Found</h5>}
                  
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SaveProject
