import React from 'react'

import NavButton from "./NavButton"

function AppHeader({title = "", options=[], navOpen, toggleNavOpen}) {
  return (
    <header
    className='flex items-center mb-5 shadow-md'
    >
      <h1
      className="w-full text-5xl px-5 pt-3 pb-1"
      >
        {title}
      </h1>
      <section className='flex justify-end items-center gap-5 w-full border'>
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