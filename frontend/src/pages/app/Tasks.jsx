import {useState} from 'react'

import {FaArrowAltCircleRight, FaArrowAltCircleDown} from "react-icons/fa";

function Tasks() {

  const [completeDropdownOpen, setCompleteDropdownOpen] = useState(false);
  const [overdueDropdownOpen, setOverdueDropdownOpen] = useState(false);
  const [incompleteDropdownOpen, setIncompleteDropdownOpen] = useState(false);

  const toggleComplete = () => setCompleteDropdownOpen(!completeDropdownOpen);
  const toggleOverdue = () => setOverdueDropdownOpen(!overdueDropdownOpen);
  const toggleIncomplete = () => setIncompleteDropdownOpen(!incompleteDropdownOpen);

  return (
    <div className='w-full border-8 border-red-500'>
      <header
      className='flex flex-col mb-5 shadow-md md:flex-row'
      >
        <h1
        className="w-full text-4xl"
        >
          Tasks
        </h1>
        <section>
          <section>Forms</section>
        </section>
      </header>
      <section>
        <section
        className="mb-5 text-lg"
        >
          <section 
          className="flex justify-center items-center gap-10 border-4 rounded-md mx-auto py-3 cursor-pointer w-[95%]"
          onClick={toggleComplete}
          >
            <div>
              {completeDropdownOpen ? 
              <FaArrowAltCircleDown />
              : 
              <FaArrowAltCircleRight /> 
              }
            </div>
            Completed Tasks
          </section>
        </section>
        <section
        className="mb-5 text-lg"
        >
          <section 
            className="flex justify-center items-center gap-10 border-4 rounded-md mx-auto py-3 cursor-pointer w-[95%]"
            onClick={toggleOverdue}
            >
              <div>
                {overdueDropdownOpen ? 
                <FaArrowAltCircleDown />
                : 
                <FaArrowAltCircleRight /> 
                }
              </div>
              Overdue Tasks
            </section>
          </section>
        <section
        className="mb-5 text-lg"
        >
          <section 
            className="flex justify-center items-center gap-10 border-4 rounded-md mx-auto py-3 cursor-pointer w-[95%]"
            onClick={toggleIncomplete}
            >
              <div>
                {incompleteDropdownOpen ? 
                <FaArrowAltCircleDown />
                : 
                <FaArrowAltCircleRight /> 
                }
              </div>
              Upcoming Tasks
            </section>
        </section>
      </section>
    </div>
  )
}

export default Tasks