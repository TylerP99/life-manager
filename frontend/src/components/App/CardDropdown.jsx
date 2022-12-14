import {useState} from 'react'

import {FaArrowAltCircleRight, FaArrowAltCircleDown} from "react-icons/fa";

function CardDropdown({title = "",
                       id = "", 
                       defaultState = false, 
                       CardComponent, 
                       content = []}) 
{

  const [open, setOpen] = useState(defaultState);

  const toggleDropdown = () => setOpen(!open);

  const dropdownStyle = "flex justify-between items-center gap-10 cursor-pointer";

  return (
    <section
    className="mb-5 text-lg border-4 rounded-md mx-auto p-3 w-[95%]"
    >
      <section 
      className={dropdownStyle + (open ? " pb-5" : "")}
      id={id}
      onClick={toggleDropdown}
      >
        <div>
          {open ? 
          <FaArrowAltCircleDown />
          : 
          <FaArrowAltCircleRight /> 
      }
        </div>
        <h2 className='mr-10'>
          {title}
        </h2>
        <div></div>
      </section>
        <section className={"flex justify-center" 
        + (open ? "" : " hidden")  }>
          <section className="flex flex-col gap-3 justify-start items-center flex-wrap md:flex-row">
            {content.length ?
            content.map(x => <CardComponent key={x.id} task={x} />)
            :
            <h5>No content to display</h5>
            }
          </section>
        </section>
    </section>
  )
}

export default CardDropdown