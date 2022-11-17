import React, { useState, useEffect } from "react";
import SaveText from "../components/saveText/SaveText";
import SaveFile from "../components/saveFile/SaveFile";
import LogoutIcon from "@mui/icons-material/Logout";
import Button from "@mui/material/Button";
import { red } from "@mui/material/colors";
import { AUTH_BASE_URL } from "../constants";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";

const Manager = () => {
  // const [statusCheck, setStatusCheck] = useState(false);
  const [userData, setUserData] = useState(null);

  const logoutHandler = () => {
    window.open(`${AUTH_BASE_URL}/auth/logout`, "_self");
  };

  const logoutToast = () => {
    toast.error("Your Session Expired, Please Login Again", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: false,
      progress: undefined,
      theme: "light",
    });
  };

  // const checkUserSession = async () => {
  //   const url = `${AUTH_BASE_URL}/auth/login/success`;
  //   await axios
  //     .get(url, { withCredentials: true })
  //     .then((res) => {
  //       setStatusCheck(!statusCheck);
  //     })
  //     .catch((err) => {
  //       logoutToast();
  //       logoutHandler();
  //     });
  // };

  useEffect(() => {
    const getUserData = async () => {
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        withCredentials: true,
      };
      await axios
        .get(`${AUTH_BASE_URL}/auth/profile`, config)
        .then((res) => {
          setUserData(res.data);
          if (res.status === 401) {
            logoutToast();
            logoutHandler();
          }
        })
        .catch((err) => console.log(err));
    };
    getUserData();
  });

  // useEffect(() => {
  //   checkUserSession();
  // }, [statusCheck]);

  return (
    <div
      style={{
        justifyContent: "center",
        display: "flex",
        marginTop: "20vh",
        height: "100%",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          paddingRight: "5vw",
        }}
      >
        <h1
          style={{
            alignSelf: "center",
            marginBottom: "1vh",
            color: "red",
            fontSize: "2em",
            fontFamily: "Poppins, sans-serif",
          }}
        >
          MANAGER PROFILE
        </h1>
        {userData?.googleDisplayName && (
          <h1
            style={{
              alignSelf: "center",
              marginBottom: "3vh",
              color: "White",
              fontSize: "2em",
              fontFamily: "Poppins, sans-serif",
            }}
          >
            Hi, {userData.googleDisplayName}
          </h1>
        )}
        {userData?.profilePicture && (
          <img
            src={userData.profilePicture}
            alt="profilePic"
            referrerpolicy="no-referrer"
            style={{ alignSelf: "center", borderRadius: "50%" }}
          />
        )}
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div>
          <SaveText />
        </div>
        <div>
          <SaveFile />
        </div>
        <div>
          <Button
            variant="contained"
            fullWidth
            style={{ backgroundColor: red[700], marginBottom: "10vh" }}
            startIcon={<LogoutIcon />}
            onClick={logoutHandler}
          >
            <div className="login-success-logout-btn-text">LOGOUT</div>
          </Button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Manager;
