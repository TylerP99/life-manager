import {useState} from 'react';
import { useOutletContext } from 'react-router-dom';
import axios from "axios";

import {FaPlus} from "react-icons/fa";

import TaskCard from "../../components/App/TaskCard";
import CreateTaskForm from '../../components/App/CreateTaskForm';
import Overlay from '../../components/App/Overlay';
import CardDropdown from '../../components/App/CardDropdown';
import NavButton from '../../components/App/NavButton';
import AppHeader from '../../components/App/AppHeader';

function Tasks() {

  const [navOpen, toggleNavOpen] = useOutletContext();
  console.log(navOpen, toggleNavOpen)

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
      <AppHeader
      title="Tasks"
      options={[]}
      navOpen={navOpen}
      toggleNavOpen={toggleNavOpen}
      />
      <header
      className='flex flex-col items-center mb-5 shadow-md md:flex-row'
      >
        <h1
        className="w-full text-5xl px-5 pt-3 pb-1"
        >
          Tasks
        </h1>
        <section className='flex justify-end w-full border'>
          <button
          className="flex items-center justify-center border-2 text-xl w-10 h-10 rounded-xl cursor-pointer hover:bg-slate-50/70"
          onClick={toggleCreateForm}
          title="Create New Task"
          ><FaPlus/></button>
          <Overlay onClick={toggleCreateForm} hidden={createFormHidden} form={<CreateTaskForm/>} />
          <NavButton
          navOpen={navOpen}
          toggleNavOpen={toggleNavOpen}
          />
        </section>
      </header>
      <section>
        <CardDropdown
        title = "Complete Tasks"
        id="complete"
        defaultState={false}
        CardComponent={TaskCard}
        content={completeTasks}
        />
        <CardDropdown
        title="Overdue Tasks"
        id="overdue"
        defaultState={true}
        CardComponent={TaskCard}
        />
        <CardDropdown
        title="Upcoming Tasks"
        defaultState={true}
        CardComponent={TaskCard}
        />
      </section>
    </div>
  )
}

export default Tasks