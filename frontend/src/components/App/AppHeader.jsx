import React from 'react'

import NavButton from "./NavButton"

function AppHeader({title = "", options=[], navOpen, toggleNavOpen}) {
  return (
    <header
    className='flex items-center mb-5 px-5 pt-2 pb-1 shadow-md'
    >
      <h1
      className="w-full h-full text-5xl"
      >
        {title}
      </h1>
      <section className='flex justify-end items-center gap-5 w-full'>
        {options.map(x => x)}
        <NavButton
        navOpen={navOpen}
        toggleNavOpen={toggleNavOpen}
        />
      </section>
    </header>
  )
}

export default AppHeader