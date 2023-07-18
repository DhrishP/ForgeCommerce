import React from 'react'

const Heading = ({title,description}:{title:string,description:string}) => {
  return (
    <>
    <div>
        <h1 className='font-bold text-2xl text-primary '>{title}</h1>
        <p className='text-muted-foreground'>{description}</p>
    </div>
    </>
  )
}

export default Heading
