import React from 'react'
import { UserButton } from '@clerk/nextjs'
import MainNav from './MainNav'
import StoreDropdown from './StoreDropdown'

const Navbar = () => {
  return (
   <>
   <div className='flex h-16 px-4 justify-between items-center border-b'>
    <div className='flex space-x-4 '>
        <div>
            <StoreDropdown/>
        </div>
        <div>
            <MainNav/>
        </div>

    </div>
    <div>
        <UserButton afterSignOutUrl='/'/>
    </div>
   </div>
   </>
  )
}

export default Navbar