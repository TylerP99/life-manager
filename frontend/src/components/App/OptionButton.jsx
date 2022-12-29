import React from 'react'

function OptionButton({Icon, Form}) {
  return (
    <div>
        <button><Icon/></button>
        <Overlay form={Form} />
    </div>
  )
}

export default OptionButton