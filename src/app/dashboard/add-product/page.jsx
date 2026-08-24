import AddModal from '@/app/Components/AddModal'
import Header from '@/app/Components/Header'
import React from 'react'

function page() {
  return (
    <>
      <div className='px-10 md:px-15 lg:px-20'>
        <Header />

        <AddModal />
      </div>
    </>
  )
}

export default page