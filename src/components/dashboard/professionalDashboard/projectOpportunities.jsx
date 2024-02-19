import React from 'react'
import { useSelector } from 'react-redux'

const ProjectOpportunities = () => {
    const Selector= useSelector((state)=>state.dashboardSlice)
    const projectOpportunitiesData= Selector.data.projectOpportunities
  return (
    <div className='py-0'>
      <div className="">
        <h2 className='text-uppercase text-start mb-4 pb-4 border-bottom h3'>Project opportunities</h2>
        <div className=''>
         Project Opportunities
        </div>
      </div>
    </div>
  )
}

export default ProjectOpportunities
