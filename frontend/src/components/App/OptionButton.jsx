import {useState} from 'react'

import Overlay from './Overlay'

function OptionButton({Icon, Form, hoverText}) {

  const [overlayHidden, setOverlayHidden] = useState(true);

  const toggleOverlay = (e) => {
    if(!e.target.closest("form")) {
      setOverlayHidden(!overlayHidden);
    }
  }

  const closeOverlay = (e) => {
    e.preventDefault();
    setOverlayHidden(true);
  }


  return (
    <div>
        <button
        className="flex items-center justify-center border-2 text-lg w-8 h-8 rounded-xl cursor-pointer hover:bg-slate-50/70"
        title={hoverText}
        onClick={toggleOverlay}
        >
            <Icon/>
        </button>
        <Overlay hidden={overlayHidden} toggleOverlay={toggleOverlay} closeOverlay={closeOverlay} Form={Form} />
    </div>
  )
}

export default OptionButton