import React from 'react'

import NavButton from "./NavButton"

function AppHeader({title = "", options=[]}) {
  return (
    <header
    className='flex flex-col items-center mb-5 shadow-md md:flex-row'
    >
      <h1
      className="w-full text-5xl px-5 pt-3 pb-1"
      >
        {title}
      </h1>
      <section className='flex justify-end items-center gap-5 w-full border'>
        {...options}
        <NavButton/>
      </section>
    </header>
  )
}

export default AppHeader