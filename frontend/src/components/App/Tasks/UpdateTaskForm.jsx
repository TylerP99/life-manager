import {useState} from 'react'

import {FaTimes} from "react-icons/fa"

function UpdateTaskForm({item, closeFunction}) {
  return (
    <form
    className='w-full bg-white p-5'
    >

      <header
      className='flex justify-between items-center mb-4'
      >
        <div></div>
        <h3
        className='text-xl px-5 border-b-2'
        >Update Task</h3>
        <button
        type='menu'
        className="flex items-center justify-center border-2 text-lg w-8 h-8 rounded-xl cursor-pointer hover:bg-slate-50/70"
        title="Close"
        onClick={closeFunction}
        ><FaTimes/></button>
      </header>

      <section
      className='px-1'
      >

        <section
        className='flex flex-col text-lg mb-4'
        >

          <label
          htmlFor="name"
          className=''
          >Name</label>
          <input
          id="name"
          name="name"
          className='border-2 rounded-md p-2'
          type="text"
          placeholder="Enter task name"
          />

        </section>

        <section
        className='flex flex-col text-lg mb-4'
        >

          <label
          htmlFor='description'
          className=''
          >Description</label>
          <textarea
          id="description"
          name="description"
          className='border-2 rounded-md p-2 resize-none'
          placeholder="Enter task description"
          />

        </section>

        <section
        className='flex flex-col text-lg mb-4'
        >

          <label
          htmlFor='date'
          className=''
          >Date</label>
          <input
          id="date"
          name="date"
          className='border-2 rounded-md p-2'
          type="date"
          />

        </section>

        <section
        className='flex flex-col text-lg mb-4'
        >

          <label
          htmlFor='startTime'
          className=''
          >Start Time</label>
          <input
          id="startTime"
          name="endTime"
          className='border-2 rounded-md p-2'
          type="time"
          />

        </section>

        <section
        className='flex flex-col text-lg mb-4'
        >

          <label
          htmlFor='endTime'
          className=''
          >End Time</label>
          <input
          id='endTime'
          name="endTime"
          className='border-2 rounded-md p-2'
          type="time"
          />

        </section>

        <section
        className='flex justify-center text-lg mb-4'
        >

          <input
          id='reminder'
          name='reminder'
          className='border-2 rounded-md p-2 -ml-7 mr-5'
          type="checkbox"
          />
          <label
          className=''
          htmlFor='reminder'
          >Set Reminder</label>

        </section>

        <button
        className='block border-2 rounded-lg mx-auto p-3 w-[75%]'
        type='submit'>Create Task</button>

      </section>

    </form>
  )
}

export default UpdateTaskForm