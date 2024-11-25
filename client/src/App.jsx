import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./index.css";
import Login from "auth/Login";
import SignUp from "auth/SignUp";
import { ChangePassword } from "./pages/ChangePassword";
import "bootstrap/dist/css/bootstrap.min.css";
import DashBoard from "./pages/DashBoard";
import ProductsDetails from "./components/ProductsDetails";
import EditUserProfile from "./pages/EditUserProfile";

const App = () => (
  <div className="container">
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />}></Route>
        <Route path="/signUp" element={<SignUp />}></Route>
        <Route path="/change-password" element={<ChangePassword />}></Route>
        <Route path="/dashboard" element={<DashBoard />}></Route>

        <Route
          path="dashboard/viewproduct/:id"
          element={<ProductsDetails />}
        ></Route>
        <Route
          path="dashboard/editprofile"
          element={<EditUserProfile />}
        ></Route>
        <Route
          path="dashboard/editprofile/changepassword"
          element={<ChangePassword />}
        ></Route>
      </Routes>
    </BrowserRouter>
  </div>
);
ReactDOM.render(<App />, document.getElementById("app"));
