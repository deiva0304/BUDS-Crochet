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
import RowCounter from './pages/RowCounter'
import ExplorePatterns from './pages/ExplorePatterns'
import YarnCalc from './pages/YarnCalc'
import ViewPattern from './pages/ViewPattern'
import NewPattern from './pages/NewPattern'
import ViewUserPatterns from './pages/ViewUserPatterns'
import Pattern from './pages/Pattern'

const App = () => {
  return (
    <div>
      <ToastContainer/>
      <Routes>
        <Route path = '/' element = {<Home/>}/>
        <Route path = '/login' element = {<Login/>}/>
        <Route path = '/email-verify' element = {<EmailVerify/>}/>
        <Route path = '/reset-password' element = {<ResetPassword/>}/>
        <Route path="/pattern-visualize/:patternId" element={<PatternVisualize />} /> 
        <Route path = '/basics' element = {<Basics/>}/>
        <Route path = '/new-pattern' element = {<NewPattern/>}/>
        <Route path = '/row-counter' element = {<ViewUserPatterns/>}/>
        <Route path="/row-counter/:patternId" element={<RowCounter />} />
        <Route path = '/explore-patterns' element = {<ExplorePatterns/>}/>
        <Route path = '/yarn-calc' element = {<YarnCalc/>}/>
        <Route path = '/view-pattern/:patternId' element = {<ViewPattern/>}/>
        <Route path = '/view-user-patterns' element = {<ViewUserPatterns/>}/>
        <Route path="/pattern/:id" element={<Pattern />} />
      </Routes>
    </div>
  )
}
export default App
