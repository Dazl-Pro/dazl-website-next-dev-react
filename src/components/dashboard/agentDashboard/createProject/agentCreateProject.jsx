import React from 'react'
import "./agentCreateProject.css"
import Commonproject from '../../commonProject/project'

const AgentCreateProject = () => {
  return (
    <div className='py-0 create-project-container-height'>
      <div className="">
        <h2 className='h3 text-uppercase text-start mb-4 pb-4 border-bottom'>Project opportunities</h2>
        <div className=''>
          <div className='customer-create-project'>
            <Commonproject/>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AgentCreateProject