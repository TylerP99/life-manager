import {useState} from 'react';
import { useOutletContext } from 'react-router-dom';

import AppHeader from "../../components/App/AppHeader";

function Dashboard() {

  const [navOpen, toggleNavOpen] = useOutletContext();

  return (
    <div className='w-full'>
      <AppHeader
      title="Dashboard"
      options={[]}
      navOpen={navOpen}
      toggleNavOpen={toggleNavOpen}
      />
      <section>
      </section>
    </div>
  )
}

export default Dashboard