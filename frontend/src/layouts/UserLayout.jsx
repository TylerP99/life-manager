import React from 'react'

import {Outlet, NavLink} from "react-router-dom";

function UserLayout() {
  return (
    <>
    <nav className='py-2 px-10 bg-red-300 flex justify-between align-middle gap-3'>
      <NavLink to="/">LM</NavLink>
      <div className='w-1/6 flex justify-evenly'>
        <NavLink to="/signin">Sign In</NavLink>
        <NavLink to="/signup">Sign Up</NavLink>
      </div>
    </nav>
    <Outlet/>
    </>
  )
}

export default UserLayout