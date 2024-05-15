import React from 'react'
import "./professional.css"
import SendIcon from '@mui/icons-material/Send';

const ProjectOpportunity = () => {
    return (
        <div className='py-0'>
            <div className="">
                <h2 className='text-uppercase text-start mb-4 pb-4 border-bottom h3'>Project opportunities</h2>
                <div className=' text-center fs-2 fw-bold text-red'>
                    Project Opportunities
                </div>
            </div>
            <div className='pt-4'>
                <div className='row'>
                    <div className='col-md-8'>
                        <div className='colinner-text'>
                            <ul className='pt-3'>
                                <li>Lorem ipsum dolor sit.</li>
                                <li>Lorem ipsum dolor sit.</li>
                                <li >Lorem ipsum dolor sit.</li>
                                <li >Lorem ipsum dolor sit.</li>
                            </ul>
                        </div>
                    </div>
                    <div className='col-md-4'>
                        <div className='colinner-image text-end'>
                            <img src="/src/assets/image.jpg" className=' img-fluid rounded'></img>
                        </div>
                        <p className='pt-3  text-end'>Lorem ipsum dolor sit amet.</p>
                    </div>
                </div>
                <div className=' border-top p-3 mt-4 w-100 bg-lightgrey rounded message-box' id="MessageBox">
                    <div className='row '>
                        <div className='col-md-3'>
                            <div className='inner-text'>
                                <label for="checkbox" className='fw-bold fs-3'>Your Response</label>
                            </div>
                        </div>
                        <div className='col-md-6'>
                            <div className='inner-text pt-3'>
                                <input type="checkbox" id="checkbox" />&nbsp;&nbsp;
                                <span className='fw-bold fs-6'> YES </span>, I a'm interseted.&nbsp;&nbsp;&nbsp;&nbsp;
                                <input type="checkbox" id="checkbox" />&nbsp;&nbsp;
                                <span className='fw-bold fs-6'> NO </span>, I a'm not interseted.
                            </div>
                        </div>
                        <div className='col-md-3 text-end'>
                            <div className='inner-text send-message'>
                                <label for="checkbox" >
                                    <SendIcon />
                                    Send</label>
                            </div>
                        </div>
                    </div>
                    <div class="message-box pt-4 " id="messageBox">
                        <label for="message "><span className='fw-bold fs-5'>Message:</span></label>
                        <input type="text" id="message" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProjectOpportunity