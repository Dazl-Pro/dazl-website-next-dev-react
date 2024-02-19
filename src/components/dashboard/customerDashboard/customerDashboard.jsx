import React from 'react'
import PersonIcon from '@mui/icons-material/Person';
import { Link, useNavigate } from 'react-router-dom';
import "./customerDashboard.css"
import { customerProfile, getAgentProfiledata, getCompanyProfile } from '../../../store/dashboard/dashboardSlice';
import { useDispatch } from 'react-redux';

const CustomerDashboard = () => {
  const navigate=useNavigate()
  const dispatch= useDispatch()
  const userId= localStorage.getItem("userId")
  const userType = localStorage.getItem("userType");
  React.useEffect(()=>{
    
      if(userType==="agent"){
        dispatch(getAgentProfiledata(userId))
      } else if(userType==="professional"){
        dispatch(getCompanyProfile(userId))
      } else{
        dispatch(customerProfile())
      }
   
  },[userId])
  return (
    <div className='py-0'>
      <div className="">
          <div className="homeowners-container">
            <div className="content-container">
            <h1 className='text-uppercase text-start mb-4 pb-4 border-bottom h3'>HOMEOWNERS</h1>
              <div className="dashboard-section shadow-lg bg-white rounded-4 p-4 p-xl-5 text-center">
                <h3 className='text-uppercase text-danger fw-bold '>Welcome to Homeowner Dashboard</h3>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.   <span  style={{cursor:"pointer"}} className='text-primary fw-bold'  onClick={() => (
                          localStorage.clear(), navigate("/")
                        )}>Log Out</span>
                {/* <Link to="/home/customer/create-project"><button style={{color:"white"}} className="cus-btn btn btn-primary mw-200px w-100 mx-1 px-2"><PersonIcon /> Start a Project</button></Link> 
                <Link to="/home/customer/my-project"><button style={{color:"white"}} className="cus-btn btn btn-primary mw-200px w-100 mx-1"><PersonIcon /> My Projects</button></Link> 
                <Link to="/home/customer/my-info"><button style={{color:"white"}} className="cus-btn btn btn-primary mw-200px w-100 mx-1"><PersonIcon />My Info</button></Link>  */}
              </div>
            </div>
          </div>
        </div>
      </div>


  )
}

export default CustomerDashboard;