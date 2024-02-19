import React from 'react'
import "./customerCreateProject.css"
import Commonproject from '../../commonProject/project'

const CustomerCreateProject = () => {
  return (
    <div className='py-0 create-project-container-height'>
      <div className="">
        <h2 className='text-uppercase text-start mb-4 pb-4 border-bottom h3'>Project opportunities</h2>
        <div className=''>
          <div className='customer-create-project'>
            <Commonproject/>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CustomerCreateProject