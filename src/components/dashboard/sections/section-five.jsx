import React from 'react'
import SmallCard from '../cards/smallCard'
import './sections.css'

const SectionFive = () => {
    const data=[
        {
            title:"Living room",
            image:"/images/smallCardimages/01-Inspired-LivingRm-Img.jpg"
        },
        {
            title:"Kitchen",
            image:"/images/smallCardimages/01-Inspired-Kitchen-Img.jpg"
        },
        {
            title:"Bathroom",
            image:"/images/smallCardimages/01-Inspired-Bath-Img.jpg"
        },
        {
            title:"Outdoor Space",
            image:"/images/smallCardimages/01-Inspired-Outdoor-Img.jpg"
        },
       
    ]
  return (
    <div className='sec-five'>
        <div className='container py-5'>
            <div className="row">    
                {
                    data.map((items,index)=> {
                        return (
                            <div className="col-md-3 mb-4 mb-md-0" key={index}>
                                <div className="col-inner fifth-sec-col">
                                    <SmallCard title={items.title} index={index} image={items.image} />
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    </div>
  )
}

export default SectionFive
