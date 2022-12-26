import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

import UserLayout from "./layouts/UserLayout"
import AppLayout from "./layouts/AppLayout"

import Landing from "./pages/Landing"
import Signup from "./pages/user/Signup"
import Signin from "./pages/user/Signin"
import Signout from "./pages/user/Signout"

import Dashboard from "./pages/app/Dashboard"
import Goals from "./pages/app/Goals"
import Routines from "./pages/app/Routines"
import Habits from "./pages/app/Habits"
import Tasks from "./pages/app/Tasks"

function App() {
  return (
    <>
    <Router>
      <Routes>
        <Route path="/" element={<UserLayout/>} >
          <Route index element={<Landing/>} />
          <Route path="/signup" element={<Signup/>}/>
          <Route path="/signin" element={<Signin/>}/>
          <Route path="/signout" element={<Signout/>}/>
        </Route>
        <Route path="/dashboard" element={<AppLayout/>}>
          <Route index element={<Dashboard/>}/>
          <Route path="goals" element={<Goals/>}/>
          <Route path="routines" element={<Routines/>}/>
          <Route path="habits" element={<Habits/>}/>
          <Route path="tasks" element={<Tasks/>}/>
        </Route>
      </Routes>
    </Router>
    </>

  );
}

export default App;