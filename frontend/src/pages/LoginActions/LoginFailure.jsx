import React from "react";
import { AUTH_BASE_URL } from "../../constants";
import Button from "@mui/material/Button";
import LogoutIcon from "@mui/icons-material/Logout";
import { teal } from "@mui/material/colors";
import "./LoginFailure.css";
const LoginFailure = () => {
  const logoutHandler = () => {
    window.open(`${AUTH_BASE_URL}/auth/logout`, "_self");
  };

  return (
    <div className="login-failed-page-container">
      <div className="login-failed-page-line1">
        YOUR ACCOUNT IS NOT REGISTERED INTO OUR SYSTEM
      </div>
      <div className="login-failed-page-line2">
        PLEASE CONTACT SYSTEM ADMIN FOR FURTHER INQUIRIES
      </div>
      <div>
        <Button
          variant="contained"
          style={{ backgroundColor: teal[500] }}
          startIcon={<LogoutIcon />}
          onClick={logoutHandler}
        >
          <div className="login-success-logout-btn-text">Back to Home</div>
        </Button>
      </div>
    </div>
  );
};

export default LoginFailure;
