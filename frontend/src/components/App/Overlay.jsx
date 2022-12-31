import {useState} from 'react'

function Overlay({hidden, toggleOverlay, closeOverlay, Form, item}) {

  return (
    <div
    className={"absolute top-0 left-0 w-screen h-screen z-50 flex flex-col justify-start items-center bg-slate-100/70" + (hidden ? " hidden" : "")}
    onClick={toggleOverlay}
    >
      <section className='border mt-[10%] max-w-[700px] w-[90%] min-w-[300px]'>
        <Form closeFunction={closeOverlay} item={item} />
      </section>
    </div>
  )
}

export default Overlay