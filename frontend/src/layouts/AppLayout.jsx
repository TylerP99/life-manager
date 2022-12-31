import {useState} from 'react';

import {Outlet, NavLink} from "react-router-dom";

function AppLayout() {

    const navLinkStyle = "w-full py-5 pl-7 pr-24 border";
    const navLinkActive = "bg-slate-100"

    const [navOpen, setNavOpen] = useState(false);

    const toggleNavOpen = (e) => {
        if(!e.target.closest("nav")) {
            setNavOpen(!navOpen);
        }
    }

    return (
        <section className='flex w-full'>
            <section id='navigation'>
                <section id='mobile-nav' className='flex md:hidden'>
                    <nav className={'flex flex-col fixed top-0 left-0 bg-white h-screen border-r transition-transform md:w-1/6 md:sticky md:transition-none' + ((navOpen) ? "" : " -translate-x-full")}>
                        <NavLink className={({isActive}) => navLinkStyle + (isActive ? " " + navLinkActive : "")} to="/settings" >Settings</NavLink>
                        <NavLink className={({isActive}) => navLinkStyle + (isActive ? " " + navLinkActive : "")} to="/dashboard" >Dashboard</NavLink>
                        <NavLink className={({isActive}) => navLinkStyle + (isActive ? " " + navLinkActive : "")} to="/goals" >Goals</NavLink>
                        <NavLink className={({isActive}) => navLinkStyle + (isActive ? " " + navLinkActive : "")} to="/routines" >Routines</NavLink>
                        <NavLink className={({isActive}) => navLinkStyle + (isActive ? " " + navLinkActive : "")} to="/habits" >Habits</NavLink>
                        <NavLink className={({isActive}) => navLinkStyle + (isActive ? " " + navLinkActive : "")} to="/tasks" >Tasks</NavLink>
                        <NavLink className={({isActive}) => navLinkStyle + (isActive ? " " + navLinkActive : "")} to="/signout">Sign Out</NavLink>
                    </nav>
                </section>
                <section id='normal-nav'>
                    <nav className={'flex-col hidden sticky top-0 left-0 bg-white h-screen border-r md:flex'}>
                        <NavLink className={({isActive}) => navLinkStyle + (isActive ? " " + navLinkActive : "")} to="/settings" >Settings</NavLink>
                        <NavLink className={({isActive}) => navLinkStyle + (isActive ? " " + navLinkActive : "")} to="/dashboard" >Dashboard</NavLink>
                        <NavLink className={({isActive}) => navLinkStyle + (isActive ? " " + navLinkActive : "")} to="/goals" >Goals</NavLink>
                        <NavLink className={({isActive}) => navLinkStyle + (isActive ? " " + navLinkActive : "")} to="/routines" >Routines</NavLink>
                        <NavLink className={({isActive}) => navLinkStyle + (isActive ? " " + navLinkActive : "")} to="/habits" >Habits</NavLink>
                        <NavLink className={({isActive}) => navLinkStyle + (isActive ? " " + navLinkActive : "")} to="/tasks" >Tasks</NavLink>
                        <NavLink className={({isActive}) => navLinkStyle + (isActive ? " " + navLinkActive : "")} to="/signout">Sign Out</NavLink>
                    </nav>
                </section>
            </section>
            <Outlet
            context={[navOpen, toggleNavOpen]}
            />
        </section>
    )
}

export default AppLayout