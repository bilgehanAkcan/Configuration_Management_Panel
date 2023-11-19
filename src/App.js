import { Navigate, Route, Routes } from "react-router-dom";
import React from "react";
import SignInPage from "./SignInPage";
import HomePage from "./HomePage";
import './App.css';
import './index';

function App() {
  return (
    <div>
      <Routes>
        <Route path="/signin" element={<SignInPage/>}></Route>
        <Route path="/" element={<HomePage/>}></Route>
      </Routes> 
    </div>
  );
}

export default App;
