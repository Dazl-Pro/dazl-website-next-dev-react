import React from 'react'
import { LazyLoadImage } from 'react-lazy-load-image-component';

const SmallCard = (props) => {
  const {title,image}=props
  return (
    <div>
      <div className="resp-imgg pb-100p rounded-4 position-relative overflow-hidden">
        <LazyLoadImage
          alt="img"
          src={image}
          className='w-100 h-100 object-fit-cover position-absolute top-0 start-0'
        />
      </div>
      <h4 className='text-center mt-2 mt-md-3 mb-0 text-uppercase'>{title}</h4>
    </div>
  )
}

export default SmallCard

