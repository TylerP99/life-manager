import {useState} from 'react';
import axios from "axios";

import {FaArrowAltCircleRight, FaArrowAltCircleDown} from "react-icons/fa";

import TaskCard from "../../components/App/TaskCard";
import CreateTaskForm from '../../components/App/CreateTaskForm';
import Overlay from '../../components/App/Overlay';

function Tasks() {

  const dropdownStyle = "flex justify-between items-center gap-10 cursor-pointer";

  const [dropdown, setDropdown] = useState({
    complete: false,
    overdue: true,
    upcoming: true,
  })

  const [createFormHidden, setCreateFormHidden] = useState(true);

  const toggleCreateForm = () => setCreateFormHidden(!createFormHidden);

  const toggleDropdown = (e) => {
    setDropdown({...dropdown, [e.currentTarget.id]: !dropdown[e.currentTarget.id]});
  }

  const completeTasks = [
    {
      id: 1,
      name: "Test",
      description: "Test task for frontend development purposes",
      complete: true,
      reminder: true,
    },
    {
      id: 2,
      name: "Test",
      description: "Test task for frontend development purposes",
      complete: true,
      reminder: true,
    },
    {
      id: 3,
      name: "Test",
      description: "Test task for frontend development purposes",
      complete: true,
      reminder: true,
    },
    {
      id: 4,
      name: "Test",
      description: "Test task for frontend development purposes",
      complete: true,
      reminder: true,
    },
    {
      id: 5,
      name: "Test",
      description: "Test task for frontend development purposes",
      complete: true,
      reminder: true,
    },
    {
      id: 6,
      name: "Test",
      description: "Test task for frontend development purposes",
      complete: true,
      reminder: true,
    },
    {
      id: 7,
      name: "Test",
      description: "Test task for frontend development purposes",
      complete: true,
      reminder: true,
    },
    {
      id: 8,
      name: "Test",
      description: "Test task for frontend development purposes",
      complete: true,
      reminder: true,
    },
    {
      id: 9,
      name: "Test",
      description: "Test task for frontend development purposes",
      complete: true,
      reminder: true,
    },
    {
      id: 10,
      name: "Test",
      description: "Test task for frontend development purposes",
      complete: true,
      reminder: true,
    },
    {
      id: 11,
      name: "Test",
      description: "Test task for frontend development purposes",
      complete: true,
      reminder: true,
    },
    {
      id: 12,
      name: "Test",
      description: "Test task for frontend development purposes",
      complete: true,
      reminder: true,
    },
    {
      id: 13,
      name: "Test",
      description: "Test task for frontend development purposes",
      complete: true,
      reminder: true,
    },
    {
      id: 14,
      name: "Test",
      description: "Test task for frontend development purposes",
      complete: true,
      reminder: true,
    },
    {
      id: 15,
      name: "Test",
      description: "Test task for frontend development purposes",
      complete: true,
      reminder: true,
    },
    {
      id: 16,
      name: "Test",
      description: "Test task for frontend development purposes",
      complete: true,
      reminder: true,
    },
    {
      id: 17,
      name: "Test",
      description: "Test task for frontend development purposes Test task for frontend development purposes Test task for frontend development purposes Test task for frontend development purposes Test task for frontend development purposes Test task for frontend development purposes Test task for frontend development purposesTest task for frontend development purposes Test task for frontend development purposes Test task for frontend development purposesTest task for frontend development purposesTest task for frontend development purposesTest task for frontend development purposesTest task for frontend development purposesTest task for frontend development purposes Test task for frontend development purposes Test task for frontend development purposes Test task for frontend development purposes Test task for frontend development purposes ",
      date: (new Date(Date.now())).toLocaleDateString(),
      startTime: (new Date(Date.now())).toLocaleTimeString(),
      endTime: (new Date(Date.now())).toLocaleTimeString(),
      complete: true,
      reminder: true,
    },
    {
      id: 18,
      name: "Test",
      description: "Test task for frontend development purposes",
      complete: true,
      reminder: true,
    },
    {
      id: 19,
      name: "Test",
      description: "Test task for frontend development purposes",
      complete: true,
      reminder: true,
    },
    {
      id: 20,
      name: "Test",
      description: "Test task for frontend development purposes",
      complete: true,
      reminder: true,
    },
  ]

  return (
    <div className='w-full'>
      <header
      className='flex flex-col items-center mb-5 shadow-md md:flex-row'
      >
        <h1
        className="w-full text-5xl px-5 pt-3 pb-1"
        >
          Tasks
        </h1>
        <section>
          <section>
            <button
            onClick={toggleCreateForm}
            >Create Task</button>
            <Overlay onClick={toggleCreateForm} hidden={createFormHidden} form={<CreateTaskForm/>} />
          </section>
        </section>
      </header>
      <section>
        <section
        className="mb-5 text-lg border-4 rounded-md mx-auto p-3 w-[95%]"
        >
          <section 
          className={dropdownStyle + (dropdown.complete ? " pb-5" : "")}
          id="complete"
          onClick={toggleDropdown}
          >
            <div>
              {dropdown.complete ? 
              <FaArrowAltCircleDown />
              : 
              <FaArrowAltCircleRight /> 
              }
            </div>
            <h2 className='mr-10'>
              Completed Tasks
            </h2>
            <div></div>
          </section>
            <section className={"border flex justify-center" 
            + (dropdown.complete ? "" : " hidden")  }>
              <section className="border flex flex-col gap-3 justify-start items-center flex-wrap md:flex-row">
                {completeTasks.map(x => <TaskCard key={x.id} task={x} />)}
              </section>
            </section>
        </section>
        <section
        className="mb-5 text-lg border-4 rounded-md mx-auto p-3 w-[95%]"
        >
          <section 
          className={dropdownStyle + (dropdown.overdue ? " pb-5" : "")}
          id="overdue"
          onClick={toggleDropdown}
          >
              <div>
                {dropdown.overdue ? 
                <FaArrowAltCircleDown />
                : 
                <FaArrowAltCircleRight /> 
                }
              </div>
              <h2 className='mr-10'>
                Overdue Tasks
              </h2>
              <div></div>
          </section>
          <section className={"" + (dropdown.overdue ? "" : "hidden")  }>
              <span>BABABAB</span>
          </section>
        </section>
        <section
        className="mb-5 text-lg border-4 rounded-md mx-auto p-3 w-[95%]"
        >
          <section 
          className={dropdownStyle + (dropdown.upcoming ? " pb-5" : "")}  
          id="upcoming"
          onClick={toggleDropdown}
          >
              <div>
                {dropdown.upcoming ? 
                <FaArrowAltCircleDown />
                : 
                <FaArrowAltCircleRight /> 
                }
              </div>
              <h2 className='mr-10'>
                Upcoming Tasks
              </h2>
              <div></div>
          </section>
          <section className={"" + (dropdown.upcoming ? "" : "hidden")  }>
              <span>BABABAB</span>
          </section>
        </section>
      </section>
    </div>
  )
}

export default Tasks