import React from 'react'

import {NavLink} from "react-router-dom";

function Landing() {
  return (
    <>
    <nav>
      <NavLink to="/">LM</NavLink>
      <NavLink to="/users/signin">Sign In</NavLink>
      <NavLink to="/users/signup">Sign Up</NavLink>
    </nav>
    <h1>Life Manager</h1>
    </>
  )
}

export default Landing