import {useState} from 'react'

import {FaCog, FaArrowLeft, FaCheck} from "react-icons/fa";

function TaskCard({task}) {

    const [settingsOpen, setSettingsOpen] = useState(false);
    const toggleSettings = () => setSettingsOpen(!settingsOpen);

    return (
        <div
        className='flex flex-col justify-between items-center shadow-lg w-full p-4 text-lg h-[330px] md:w-[47%] xl:w-[24%]'
        >
            <header
            className='w-full flex items-center text-xl border-b-2 mb-3 h-[15%]'
            >
                <h5
                className="flex items-center w-full"
                >{task.complete && <FaCheck className='mr-3'/>} {task.name}</h5>
                <div>
                    { !settingsOpen ?
                    <FaCog
                    className='cursor-pointer'
                    onClick={toggleSettings} />
                    :
                    <FaArrowLeft onClick={toggleSettings}/>
                    }
                </div>
            </header>
            <section className={'h-[85%] flex flex-col justify-evenly overflow-hidden' + (settingsOpen ? " hidden" : "")}>
                <p
                className='h-[40%] mb-2 overflow-scroll'
                >
                    {task.description}
                </p>
                <section
                className="h-[30%]"
                >
                    <p
                    className="mx-auto flex justify-center items-center"
                    >
                        {task.date}
                    </p>
                    {(task.startTime || task.endTime) && 
                    <section
                    className="flex justify-around items-center mx-auto"
                    >
                        {task.startTime && 
                        <p>{task.startTime}</p>
                        }
                        <p>&mdash;</p>
                        {task.endTime && 
                        <p>{task.endTime}</p>
                        }
                    </section>
                    }
                </section>
                <section className='mx-auto border'>
                    {!task.complete ? 
                    <button
                    className="border-2 rounded-sm"
                    >
                        Mark Complete
                    </button>
                    :
                    <button
                    className="border-2 block mx-auto min-w-1/2 rounded-sm px-5 py-2 cursor-pointer hover:bg-slate-50/70"
                    >
                        Mark Incomplete
                    </button>
                    }
                </section>
            </section>
            <section className={"w-full" + (settingsOpen ? "" : " hidden")}>
                <button
                className="border-2 block mx-auto min-w-1/2 rounded-sm px-5 py-2 cursor-pointer hover:bg-slate-50/70"
                >Edit Task</button>
                <button
                className="border-2 block mx-auto min-w-1/2 rounded-sm px-5 py-2 cursor-pointer hover:bg-slate-50/70"
                >Delete Task</button>
            </section>
        </div>
    )
}

export default TaskCard