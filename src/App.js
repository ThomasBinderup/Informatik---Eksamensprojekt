import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import Home from './Home';
import './App.css';
import OpretBruger from './OpretBruger';
import './PositionMainContent.css';
import Login from './Login';
import OpretTidskapsel from './OpretTidskapsel';
import ProfilePage from './profilePage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/opretBruger" element={<OpretBruger />} />
        <Route path="/login" element={<Login />} />
        <Route path="/opretTidskapsel" element={<OpretTidskapsel/>} ></Route>
        <Route path="/profilePage" element={<ProfilePage />}></Route>
      </Routes>
    </BrowserRouter>  
  );
}

export default App;
