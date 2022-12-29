import React from 'react'

function NavButton({navOpen, toggleNavOpen}) {
  return (
    <div className='flex justify-center items-center'>
        <button 
          id="menu-btn" 
          className={"block hamburger focus:outline-none" + ((navOpen) ? " open" : "")}
          onClick={toggleNavOpen}
          >
          <div className="hamburger-top"></div>
          <div className="hamburger-middle"></div>
          <div className="hamburger-bottom"></div>
        </button>
    </div>
  )
}

export default NavButton