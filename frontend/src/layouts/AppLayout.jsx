import React from 'react';

import {Outlet, NavLink} from "react-router-dom";

function AppLayout() {
  return (
    <section className='flex'>
        <section className='h-screen w-1/6'>
            <nav className='flex flex-col border h-full'>
                <NavLink className="w-full py-5 px-7" to="/settings" >Settings</NavLink>
                <NavLink className="w-full py-5 px-7" to="/dashboard" >Dashboard</NavLink>
                <NavLink className="w-full py-5 px-7" to="/dashboard/goals" >Goals</NavLink>
                <NavLink className="w-full py-5 px-7" to="/dashboard/routines" >Routines</NavLink>
                <NavLink className="w-full py-5 px-7" to="/dashboard/habits" >Habits</NavLink>
                <NavLink className="w-full py-5 px-7" to="/dashboard/tasks" >Tasks</NavLink>
                <NavLink className="w-full py-5 px-7" to="/signout">Sign Out</NavLink>
            </nav>
        </section>
        <Outlet/>
    </section>

  )
}

export default AppLayout