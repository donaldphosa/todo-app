import Login from './Login';
import Home from './Home';
import './App.css';
import {  useState } from 'react';
import {BrowserRouter, Route, Routes} from 'react-router-dom'

function App() {


  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Login />}/>
          <Route path='/home' element={<Home />}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
