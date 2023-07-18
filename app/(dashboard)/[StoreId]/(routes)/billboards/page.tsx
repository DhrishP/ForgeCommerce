import React from 'react'
import BillBoard from './components/BillBoard'

const BillboardPage = () => {
  return (
   <div className='flex flex-col'>
        <div className='flex-1 py-6 px-8'>
            <BillBoard/>
        </div>
   </div>
  )
}

export default BillboardPage