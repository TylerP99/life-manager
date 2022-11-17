import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

import Landing from "./pages/Landing"
import Signup from "./pages/user/Signup"
import Signin from "./pages/user/Signin"
import Signout from "./pages/user/Signout"

function App() {
  return (
    <>
    <h1>App</h1>
    <Router>
      <Routes>
        <Route path="/" element={<Landing/>}></Route>
        <Route path="/users/signup" element={<Signup/>}></Route>
        <Route path="/users/signin" element={<Signin/>}></Route>
        <Route path="/users/signout" element={<Signout/>}></Route>
      </Routes>
    </Router>
    </>

  );
}

export default App;