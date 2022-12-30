import {useState} from 'react'

function Overlay({hidden, toggleOverlay, Form}) {

  return (
    <div
    className={"absolute top-0 left-0 w-screen h-screen z-50 flex justify-center items-center bg-slate-100/70" + (hidden ? " hidden" : "")}
    onClick={toggleOverlay}
    >
        <Form closeFunction={toggleOverlay} />
    </div>
  )
}

export default Overlay