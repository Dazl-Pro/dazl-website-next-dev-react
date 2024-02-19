import React from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {  customerProfile, getAgentProfiledata, getCompanyProfile, } from '../../../store/dashboard/dashboardSlice'
import "./professional.css"

const ProfessionalDashboard = () => {
  const dispatch= useDispatch()
  const navigate=useNavigate()
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
      <h2 className='text-uppercase text-start mb-4 pb-4 border-bottom h3'>Professional Dashboard</h2>
        <div className='shadow-lg bg-white rounded-4 p-4 p-xl-5 text-center'>
          <h4 className='text-uppercase text-danger fw-bold '>Welcome to Company dashboard</h4>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.   <span style={{cursor:"pointer"}} className='text-primary fw-bold'  onClick={() => (
                          localStorage.clear(), navigate("/")
                        )}>Log Out</span></p>
          {/* <div className='console-flex d-flex justify-content-center align-items-baseline'>
          <button className='btn btn-primary mw-200px w-100  mx-1 mob' style={{color:"white"}} onClick={()=>(navigate("/company/projectOpportunities"), dispatch(projectOpportunities()))} >Project opportunities</button>
          <button className='btn btn-primary mw-200px w-100  mx-1 mb' onClick={()=>(dispatch(getCompanyProfile(userId)), navigate("/company/companyProfile"))} style={{color:"white"}}>My Company Profile</button>
        </div> */}
        </div>
      </div>
    </div>
  )
}

export default ProfessionalDashboard
