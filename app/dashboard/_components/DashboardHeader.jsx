import { UserButton } from '@clerk/nextjs'
import { Menu } from 'lucide-react'
import React from 'react'

function DashboardHeader({ onMenuClick }) {
  return (
    <div className='p-5 shadow-md flex justify-between items-center'>
        <button onClick={onMenuClick} className='md:hidden'>
            <Menu size={30} />
        </button>
        <div className='flex-1 flex justify-end'>
            <UserButton/>
        </div>
    </div>
  )
}

export default DashboardHeader