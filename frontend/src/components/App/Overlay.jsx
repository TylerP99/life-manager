import React from 'react'

function Overlay({hidden, form}) {

    

  return (
    <div
    className={"absolute top-0 left-0 w-screen h-screen z-50 flex justify-center items-center bg-slate-100/70" + (hidden ? " hidden" : "")}
    >
        {form}
    </div>
  )
}

export default Overlay