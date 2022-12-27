import {useState} from 'react';

import {Outlet, NavLink} from "react-router-dom";

function AppLayout() {

    return (
        <section className='flex w-full'>
            <section className='sticky top-0 left-0 h-screen border-r w-1/6'>
                <nav className='flex flex-col h-full'>
                    <NavLink className={({isActive}) => "w-full py-5 pl-7 pr-24 border" + (isActive ? " bg-slate-100" : "")} to="/settings" >Settings</NavLink>
                    <NavLink exact className={({isActive}) => "w-full py-5 pl-7 pr-24 border" + (isActive ? " bg-slate-100" : "")} to="/dashboard" >Dashboard</NavLink>
                    <NavLink className={({isActive}) => "w-full py-5 pl-7 pr-24 border" + (isActive ? " bg-slate-100" : "")} to="/goals" >Goals</NavLink>
                    <NavLink className={({isActive}) => "w-full py-5 pl-7 pr-24 border" + (isActive ? " bg-slate-100" : "")} to="/routines" >Routines</NavLink>
                    <NavLink className={({isActive}) => "w-full py-5 pl-7 pr-24 border" + (isActive ? " bg-slate-100" : "")} to="/habits" >Habits</NavLink>
                    <NavLink className={({isActive}) => "w-full py-5 pl-7 pr-24 border" + (isActive ? " bg-slate-100" : "")} to="/tasks" >Tasks</NavLink>
                    <NavLink className={({isActive}) => "w-full py-5 pl-7 pr-24 border" + (isActive ? " bg-slate-100" : "")} to="/signout">Sign Out</NavLink>
                </nav>
            </section>
            <Outlet/>
        </section>
    )
}

export default AppLayout