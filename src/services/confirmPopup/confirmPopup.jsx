import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { deletePhd, openConfirmPopup } from '../../store/dashboard/dashboardSlice';
import { Modal, Button } from "react-bootstrap";

const ConfirmPopup = () => {
    const dispatch=useDispatch()
    const selector = useSelector((state) => state.dashboardSlice);
    const confirmPopup = selector.data.confirmPopup;
    const viewPhdData = selector.data.viewPhd;
  return (
    <Modal
        show={confirmPopup}
        onHide={()=>dispatch(openConfirmPopup(false))}
        centered
        className="user_registered_popup"
      >
        <Modal.Body>
          <div className="d-flex justify-content-center fs-1 fw-bold">Delete Project</div>
          <div className="text-center  fs-5">Are you sure you want to delete this project ? </div>
         
        </Modal.Body>
        <Modal.Footer className="justify-content-center border-0">
          <Button
            variant="primary"
            onClick={()=>(dispatch(deletePhd(viewPhdData[0].project_id)))}
            className="px-4"
          >
            Yes
          </Button>

          <Button
            variant="primary"
            onClick={()=>dispatch(openConfirmPopup(false))}
            className="px-4"
          >
            No
          </Button>
        </Modal.Footer>
      </Modal>
  )
}

export default ConfirmPopup
