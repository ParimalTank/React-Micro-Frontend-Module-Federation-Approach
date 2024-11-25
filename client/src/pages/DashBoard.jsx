import React from "react";
import { useLocation } from "react-router-dom";
// import Navbars from "../../components/Navbars";
// import Products from "./Products";

import Navbars from "../components/Navbars";
import Products from "./Products";

const Dashboard = () => {
  return (
    <div>
      <Navbars />
      <Products />
    </div>
  );
};

export default Dashboard;
