import React, { useEffect, useState } from "react";
import { Registration } from "../components/index";
import { AUTH_BASE_URL } from "../constants";
import { logoutHandler } from "../services/api";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";

const Admin = () => {
  const [userData, setUserData] = useState(null);

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
          ADMIN USER
        </h1>
        {userData?.googleDisplayName && (
          <h1
            style={{
              alignSelf: "center",
              marginBottom: "3vh",
              color: "White",
              fontSize: "3em",
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
      <Registration />
      <ToastContainer />
    </div>
  );
};

export default Admin;
