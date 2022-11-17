import React from "react";
import { Login } from "../components/index";

const Home = () => {
  return (
    <div
      style={{
        justifyContent: "center",
        display: "flex",
        marginTop: "20vh",
        height: "100%",
      }}
    >
      <Login />
    </div>
  );
};

export default Home;
