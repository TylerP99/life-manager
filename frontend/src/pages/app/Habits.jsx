import {useState} from 'react';
import { useOutletContext } from 'react-router-dom';

import AppHeader from "../../components/App/AppHeader";

function Habits() {

  const [navOpen, toggleNavOpen] = useOutletContext();

  return (
    <div className='w-full'>
      <AppHeader
      title="Habits"
      options={[]}
      navOpen={navOpen}
      toggleNavOpen={toggleNavOpen}
      />
      <section>
      </section>
    </div>
  )
}

export default Habits