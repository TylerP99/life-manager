import {useState} from 'react'

import {FaCog, FaArrowLeft, FaCheck} from "react-icons/fa";

function TaskCard({task}) {

    const [settingsOpen, setSettingsOpen] = useState(false);

    return (
        <div>
            <header>
                <h5>{task.complete || <FaCheck/>}{task.name}</h5>
                <div>
                    <FaCog/>
                    <FaArrowLeft/>
                </div>
            </header>
            <section>
                <p>{task.descritpion}</p>
                <section>
                    <p>{task.date}</p>
                    {(task.startTime || task.endTime) || 
                    <section>
                        {task.startTime || 
                        <p>{task.startTime}</p>
                        }
                        <p>&emdash;</p>
                        {task.endTime || 
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
            <section>
                <button>Edit Task</button>
                <button>Delete Task</button>
            </section>
        </div>
    )
}

export default TaskCard