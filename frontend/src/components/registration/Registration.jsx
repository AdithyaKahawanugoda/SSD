import React, { useState, useEffect } from "react";
import "./Registration.css";
import TextField from "@mui/material/TextField";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Button from "@mui/material/Button";
import { teal, red } from "@mui/material/colors";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import BarLoader from "react-spinners/BarLoader";
import validator from "validator";
import { useNavigate } from "react-router-dom";
import { AUTH_BASE_URL } from "./../../constants";
import { logoutHandler } from "../../services/api";
import LogoutIcon from "@mui/icons-material/Logout";
import { ToastContainer, toast } from "react-toastify";

import axios from "axios";

const Registration = ({ sectionNavigator }) => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [accountType, setAccountType] = useState("");
  const [errorText, setErrorText] = useState("");
  const [isValid, setIsValid] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [registrationData, setRegistrationData] = useState(null);

  useEffect(() => {
    const registrationSuccessHandler = () => {
      if (registrationData?.msg) {
        registrationToast(registrationData.msg);
        setRegistrationData(null);
      }
      setIsLoading(false);
    };
    if (registrationData) {
      registrationSuccessHandler();
    }
  }, [registrationData, navigate, sectionNavigator]);

  const emailInputHandler = (inputText) => {
    setIsValid(true);
    setEmail(inputText);
    if (!validator.isEmail(email)) {
      setIsValid(false);
    }
  };

  const passwordInputHandler = (inputText) => {
    setPassword(inputText);
  };

  const usernameInputHandler = (inputText) => {
    setUsername(inputText);
  };

  const accountTypeInputHandler = (accType) => {
    console.log(accType);
    if (accType === "WORKER" || accType === "MANAGER") {
      setAccountType(accType);
    }
  };
  const registrationToast = (text) => {
    toast.success(text, {
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

  const registrationHandler = async (e) => {
    e.preventDefault();

    if (isValid && email.length > 0 && password.length > 5 && accountType) {
      setIsLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        withCredentials: true,
      };
      await axios
        .post(
          `${AUTH_BASE_URL}/auth/register`,
          {
            email,
            password,
            username,
            accountType,
          },
          config
        )
        .then((res) => {
          setRegistrationData(res.data);
          setEmail("");
          setUsername("");
          setPassword("");
          if (res.status === 401) {
            logoutToast();
            logoutHandler();
          }
        })
        .catch((error) => {
          setErrorText(error.response.data.msg);
          setEmail("");
          setUsername("");
          setPassword("");
          setIsValid(true);
          setIsLoading(false);
        });
    }
  };

  return (
    <div className="login-component-container">
      <form className="login-component-acc-type-container" autoComplete="off">
        <FormControl required>
          <FormLabel id="demo-row-radio-buttons-group-label">
            Account Type
          </FormLabel>
          <RadioGroup
            row
            aria-labelledby="demo-row-radio-buttons-group-label"
            name="row-radio-buttons-group"
            onChange={(e) => {
              accountTypeInputHandler(e.target.value);
            }}
          >
            <FormControlLabel
              value="WORKER"
              control={<Radio style={{ color: "teal" }} />}
              label="Worker"
            />
            <FormControlLabel
              value="MANAGER"
              control={<Radio style={{ color: "teal" }} />}
              label="Manager"
            />
          </RadioGroup>
        </FormControl>
      </form>
      <form className="login-component-email-container" autoComplete="off">
        <TextField
          variant="outlined"
          label="E-mail"
          id="field1"
          fullWidth
          size="medium"
          type="email"
          style={{ border: "solid 2px teal" }}
          InputLabelProps={{
            style: {
              fontWeight: 700,
              fontSize: "1em",
              autoComplete: "false",
              color: "white",
            },
          }}
          InputProps={{
            style: {
              fontWeight: 700,
              fontSize: "1em",
              autoComplete: "false",
              color: "white",
            },
          }}
          onChange={(e) => {
            emailInputHandler(e.target.value);
          }}
          onBlur={() => {
            if (email.length === 0) {
              setIsValid(true);
            }
          }}
          value={email}
        />
        <div>{!isValid && <p>Email is not valid</p>}</div>
      </form>
      <form className="login-component-username-container" autoComplete="off">
        <TextField
          variant="outlined"
          label="Username"
          id="field2"
          fullWidth
          size="medium"
          type="text"
          style={{ border: "solid 2px teal" }}
          InputLabelProps={{
            style: {
              fontWeight: 700,
              fontSize: "1em",
              autoComplete: "false",
              color: "white",
            },
          }}
          InputProps={{
            style: {
              fontWeight: 700,
              fontSize: "1em",
              autoComplete: "false",
              color: "white",
            },
          }}
          onChange={(e) => {
            usernameInputHandler(e.target.value);
          }}
          value={username}
        />
      </form>
      <form className="login-component-password-container" autoComplete="off">
        <TextField
          variant="outlined"
          label="Password"
          id="field3"
          fullWidth
          size="medium"
          type="password"
          autoComplete="new-password"
          style={{ border: "solid 2px teal" }}
          InputLabelProps={{
            style: {
              fontWeight: 700,
              fontSize: "1em",
              autoComplete: "false",
              color: "white",
            },
          }}
          InputProps={{
            style: {
              fontWeight: 700,
              fontSize: "1em",
              autoComplete: "false",
              color: "white",
            },
          }}
          onChange={(e) => {
            passwordInputHandler(e.target.value);
          }}
          value={password}
        />
        <div>
          {password && password.length < 6 && (
            <p>Password should contain at least 6 characters</p>
          )}
        </div>
      </form>
      <div className="login-component-login-btn">
        <Button
          variant="contained"
          fullWidth
          style={{ backgroundColor: teal[500] }}
          startIcon={<ArrowForwardIosRoundedIcon />}
          onClick={registrationHandler}
        >
          <div className="login-component-login-btn-text">Create Account</div>
        </Button>
        {isLoading && <BarLoader width={"100%"} />}
      </div>
      <div>
        <Button
          variant="contained"
          fullWidth
          style={{ backgroundColor: red[700] }}
          startIcon={<LogoutIcon />}
          onClick={logoutHandler}
        >
          <div className="login-success-logout-btn-text">Logout</div>
        </Button>
      </div>
      {errorText && (
        <div className="login-component-error-text">{errorText}</div>
      )}
      <ToastContainer />
    </div>
  );
};

export default Registration;
