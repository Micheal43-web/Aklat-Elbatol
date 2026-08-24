import Image from 'next/image'
import React from 'react'
import img from "./../../../public/qr code.jpeg"

function CTA() {



  return (
    <div className='flex items-center justify-center mx-10   overflow-hidden mt-170'>
      <Image 
        src={img}
        height={0}
        width={0}
        alt=''
        draggable="false"
        className='h-75 md:h-90 lg:min-h-150 w-130 md:w-175 lg:w-275 rounded-4xl'
      />
    </div>
  )
}

export default CTA