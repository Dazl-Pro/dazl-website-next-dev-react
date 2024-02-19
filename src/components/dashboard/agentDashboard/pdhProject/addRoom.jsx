import React, { useState } from 'react'
import RoomsInformation from './roomsInformation';
import CommonRoomform from '../../commonForm/commonRoomForm';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import Nav from 'react-bootstrap/Nav';
import "./style.css"

const AddRoom = () => {
    const [show,setShow]=useState(false)
    const [selectValue,setSelectvalue]=React.useState("")
    

  return (
    <div className="py-0 rooms-container-height d-block min-vh-auto">
            <div className="content-full">
              <h3 className='mb-4 pb-4 border-bottom'>PHD and Project creation </h3>
              <div class="w-100 my-0">
                  {show && <RoomsInformation setShow={setShow} setSelectvalue={setSelectvalue} />}
                  { !show &&<>
                    <div className=''>
                    <h4>Add Room </h4>
                      <div className="customer-create-project">
                        <CommonRoomform setShow={setShow} selectValue={selectValue} setSelectvalue={setSelectvalue} />
                      </div>
                    </div>
                  </>}        
                </div>
            </div>
    </div>
  )
}

export default AddRoom

