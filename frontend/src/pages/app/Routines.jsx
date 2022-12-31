import {useState} from 'react';
import { useOutletContext } from 'react-router-dom';

import AppHeader from "../../components/App/AppHeader";

function Routines() {

  const [navOpen, toggleNavOpen] = useOutletContext();

  return (
    <div className='w-full'>
      <AppHeader
      title="Routines"
      options={[]}
      navOpen={navOpen}
      toggleNavOpen={toggleNavOpen}
      />
      <section>
      </section>
    </div>
  )
}

export default Routines