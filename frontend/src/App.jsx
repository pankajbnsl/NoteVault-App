import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home/Home'
import Login from './pages/Login/Login';
import SignUp from './pages/SignUp/SignUp';
import NotFound from './pages/NotFound/NotFound';

const routes = (
    <Router>
      <Routes>
        <Route path="/dashboard" exact element={<Home/>} />
        <Route path="/" exact element={<Login/>} />
        <Route path="/signUp" exact element={<SignUp/>} />
         <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
);



const App = () => {
  return (
    <div>
      {routes}
    </div>
  )
}

export default App