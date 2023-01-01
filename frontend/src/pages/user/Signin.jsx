import { useState } from 'react';

function Signin() {

  const [formState, setFormState] = useState({
    username: "",
    email: "",
    password: "",
    password2: "",
  });

  const handleInputChange = (e) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
    });
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    alert(`${formState.username}\n${formState.email}\n${formState.password}\n${formState.password2}`)
  }

  return (
    <div
    className="flex flex-col justify-start items-center w-full"
    >
      <form
      className='border bg-white p-5 mt-10 max-w-[500px] w-[95%]'
      onSubmit={handleSubmit}
      >
        <h3
        className='text-3xl text-center mx-auto w-1/2 border-b-2 mb-4'
        >Sign In</h3>

        <section
        className='flex flex-col text-lg mb-4'
        >
          <label htmlFor='email'>Email</label>
          <input 
          id="email"
          name="email"
          type="email"
          placeholder="Enter email"
          className='border-2 rounded-md p-2'
          value={formState.email}
          onChange={handleInputChange}
          maxLength="50"
          required
          />
        </section>
        
        <section
        className='flex flex-col text-lg mb-4'
        >
          <label htmlFor='password'>Password</label>
          <input 
          id="password"
          name="password"
          type="password"
          placeholder="Enter password"
          className='border-2 rounded-md p-2'
          value={formState.password}
          onChange={handleInputChange}
          minLength="8"
          maxLength="50"
          />
        </section>

        <button
        className='block border-2 rounded-lg mx-auto p-3 w-[75%]'
        type='submit'>Sign In</button>
        
      </form>
    </div>
  )
}

export default Signin;