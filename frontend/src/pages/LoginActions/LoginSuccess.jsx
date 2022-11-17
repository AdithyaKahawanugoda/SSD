/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { AUTH_BASE_URL } from "../../constants";
import { useNavigate } from "react-router-dom";

const LoginSuccess = () => {
  const navigate = useNavigate();

  const [statusCheck, setStatusCheck] = useState(false);

  const logoutHandler = () => {
    window.open(`${AUTH_BASE_URL}/auth/logout`, "_self");
  };

  const checkUserSession = async () => {
    const url = `${AUTH_BASE_URL}/auth/login/success`;
    await axios
      .get(url, { withCredentials: true })
      .then((res) => {
        setStatusCheck(!statusCheck);
        if (res?.data?.token && res?.data?.userAccountType) {
          localStorage.setItem("authToken", res.data.token);
          localStorage.setItem("accountType", res.data.userAccountType);
        }
        if (res.data.user.accountType === "ADMIN") {
          navigate("/admin");
        } else if (res.data.user.accountType === "WORKER") {
          navigate("/worker");
        } else if (res.data.user.accountType === "MANAGER") {
          navigate("/manager");
        } else {
          logoutHandler();
        }
      })
      .catch((err) => {
        // alert("Your session expired, please log in again");
        alert("Error occurred, please login again");
        logoutHandler();
      });
  };

  useEffect(() => {
    checkUserSession();
  }, [statusCheck]);

  return <div>Please Wait..</div>;
};

export default LoginSuccess;
