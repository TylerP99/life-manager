import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

import UserLayout from "./layouts/UserLayout"
import Landing from "./pages/Landing"
import Signup from "./pages/user/Signup"
import Signin from "./pages/user/Signin"
import Signout from "./pages/user/Signout"

function App() {
  return (
    <>
    <Router>
      <Routes>
        <Route path="/" element={<Landing/>}></Route>
        <Route path="/users" element={<UserLayout/>} >
          <Route path="/users/signup" element={<Signup/>}/>
          <Route path="/users/signin" element={<Signin/>}/>
          <Route path="/users/signout" element={<Signout/>}/>
        </Route>
      </Routes>
    </Router>
    </>

  );
}

export default App;