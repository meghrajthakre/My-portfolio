import React, { useEffect, useState } from "react";
import Navbar from '../src/components/Ui/Layouts/Navbar';
import Home from "./Pages/Home";
import CircleCanvas from './components/Ui/CircleCanvas';
import DarkModeToggle from './components/Ui/DarkModeToggle';
function App() {


  return (
    <div>
      <Navbar />
      <Home />
    </div>
  );
}

export default App;
