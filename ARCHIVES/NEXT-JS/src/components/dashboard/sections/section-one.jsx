import React from 'react'
import './sections.css'

const SectionOne = () => {
  return (
    <div>
      <video autoPlay playsInline={true} muted={true} width={"100%"} height={"100%"}
               style={{"minHeight" : "190px"}} className='d-block'>
            <source src="/video/DAZL-4K.mp4"/>
        </video>
    </div>
  )
}

export default SectionOne
