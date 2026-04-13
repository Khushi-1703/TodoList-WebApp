import React from 'react'

const Navbar = () => {
  return (
    <nav className="flex justify-between items-center bg-pink-600 text-white py-2">
        <div className="logo">
            <span className='font-semibold text-3xl mx-16 cursor-pointer'>
                SlayList
            </span>
        </div>
        <ul className="flex gap-7 mx-16 text-xl">
            <li className='cursor-pointer hover:font-semibold transition-all duration-150'>Home</li>
            <li className='cursor-pointer hover:font-semibold transition-all duration-150'>Your Tasks</li>
        </ul>
    </nav>
  )
}

export default Navbar
