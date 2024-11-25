import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./Auth/Login";
import "./index.css";
// import "../src/assets/style.scss";
import SignUp from "./Auth/SignUp";

const App = () => (
  <div>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />}></Route>
        <Route path="/signUp" element={<SignUp />}></Route>
        {/* <Route path="/change-password" element={<ChangePassword />}></Route> */}
      </Routes>
    </BrowserRouter>
  </div>
);
ReactDOM.render(<App />, document.getElementById("app"));
