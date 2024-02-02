import React from 'react'

const RatelimitPage = () => {
  return (
    <div className='flex w-screen h-screen items-center justify-center  '>
        <h2 className='text-5xl animate-pulse text-primary'>Too many requests , Please try again after 30s </h2>
    </div>
  )
}

export default RatelimitPage
