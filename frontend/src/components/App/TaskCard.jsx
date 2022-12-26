import {useState} from 'react'

import {FaCog, FaArrowLeft, FaCheck} from "react-icons/fa";

function TaskCard({task}) {

    const [settingsOpen, setSettingsOpen] = useState(false);
    const toggleSettings = () => setSettingsOpen(!settingsOpen);

    return (
        <div
        className='flex flex-col items-center shadow-md w-full p-4 text-lg md:w-[47%] xl:w-[24%]'
        >
            <header
            className='w-full flex'
            >
                <h5
                className="flex items-center border-b-2 text-xl w-full"
                >{task.complete && <FaCheck className='mr-3'/>} {task.name}</h5>
                <div>
                    { !settingsOpen ?
                    <FaCog onClick={toggleSettings} />
                    :
                    <FaArrowLeft onClick={toggleSettings}/>
                    }
                </div>
            </header>
            <section>
                <p>{task.description}</p>
                <section>
                    <p>{task.date}</p>
                    {(task.startTime || task.endTime) && 
                    <section>
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
                <section>
                    {!task.complete ? 
                    <button>Mark Complete</button>
                    :
                    <button>Mark Incomplete</button>
                    }
                </section>
            </section>
            <section className={"" + (settingsOpen ? "" : " hidden")}>
                <button>Edit Task</button>
                <button>Delete Task</button>
            </section>
        </div>
    )
}

export default TaskCard