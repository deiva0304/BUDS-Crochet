import React from 'react'
import {Routes, Route} from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import EmailVerify from './pages/EmailVerify'
import ResetPassword from './pages/ResetPassword'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import PatternVisualize from './pages/PatternVisualize'
import Basics from './pages/Basics'
import Chart from './pages/Chart'
import RowCounter from './pages/RowCounter'
import ExplorePatterns from './pages/ExplorePatterns'
import YarnCalc from './pages/YarnCalc'
import ViewPatterns from './pages/ViewPatterns'

const App = () => {
  return (
    <div>
      <ToastContainer/>
      <Routes>
        <Route path = '/' element = {<Home/>}/>
        <Route path = '/login' element = {<Login/>}/>
        <Route path = '/email-verify' element = {<EmailVerify/>}/>
        <Route path = '/reset-password' element = {<ResetPassword/>}/>
        <Route path = '/pattern-visualize' element = {<PatternVisualize/>}/>
        <Route path = '/basics' element = {<Basics/>}/>
        <Route path = '/chart' element = {<Chart/>}/>
        <Route path = '/row-counter' element = {<RowCounter/>}/>
        <Route path = '/explore-patterns' element = {<ExplorePatterns/>}/>
        <Route path = '/yarn-calc' element = {<YarnCalc/>}/>
        <Route path = '/view-patterns' element = {<ViewPatterns/>}/>
      </Routes>
    </div>
  )
}
export default App
