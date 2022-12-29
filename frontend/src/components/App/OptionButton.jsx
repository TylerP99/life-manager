import React from 'react'

function OptionButton({Icon, Form, hoverText}) {
  return (
    <div>
        <button
        title={hoverText}
        >
            <Icon/>
        </button>
        <Overlay form={Form} />
    </div>
  )
}

export default OptionButton