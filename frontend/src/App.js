import React from "react";
import "./App.css";
import { BrowserRouter as BRouter, Routes, Route } from "react-router-dom";
import {
  Home,
  Admin,
  Worker,
  Manager,
  LoginSuccess,
  LoginFailure,
} from "./pages/index";
import PrivateRoute from "./utils/PrivateRoute";

const App = () => {
  return (
    <BRouter>
      <Routes>
        <Route element={<PrivateRoute />}>
          <Route path="/admin" element={<Admin />} />
          <Route path="/worker" element={<Worker />} />
          <Route path="/manager" element={<Manager />} />
        </Route>
        <Route path="/" element={<Home />} />
        <Route path="/login/success" element={<LoginSuccess />} />
        <Route path="/login/failed" element={<LoginFailure />} />
      </Routes>
    </BRouter>
  );
};

export default App;
