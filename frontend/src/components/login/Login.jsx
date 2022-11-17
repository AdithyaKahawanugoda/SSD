import React, { useState, useEffect } from "react";
import "./Login.css";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { teal } from "@mui/material/colors";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import GoogleIcon from "@mui/icons-material/Google";
import BarLoader from "react-spinners/BarLoader";
import validator from "validator";
import { useNavigate } from "react-router-dom";
import { AUTH_BASE_URL } from "../../constants";
import axios from "axios";

const Login = ({ sectionNavigator }) => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorText, setErrorText] = useState("");
  const [isValid, setIsValid] = useState(true);
  const [isSubmit, setIsSubmit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginData, setLoginData] = useState(null);

  useEffect(() => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("accountType");
    const loginSuccessHandler = () => {
      if (loginData?.token && loginData?.userAccountType) {
        localStorage.setItem("authToken", loginData.token);
        localStorage.setItem("accountType", loginData.userAccountType);
      }
      if (loginData.userAccountType === "ADMIN") {
        navigate("/admin");
      } else if (loginData.userAccountType === "WORKER") {
        navigate("/worker");
      } else if (loginData.userAccountType === "MANAGER") {
        navigate("/manager");
      } else {
        navigate("/");
      }

      setIsLoading(false);
      setIsSubmit(false);
    };
    if (loginData) {
      loginSuccessHandler();
    }
  }, [loginData, navigate, sectionNavigator]);

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

  const loginHandler = async (e) => {
    e.preventDefault();
    if (isValid && email.length > 0 && password.length > 5) {
      setIsLoading(true);
      setIsSubmit(true);
      await axios
        .post(`${AUTH_BASE_URL}/auth/login`, { email, password })
        .then((res) => {
          setLoginData(res.data);
        })
        .catch((error) => {
          setErrorText(error.response.data.msg);
          setEmail("");
          setPassword("");
          setIsValid(true);
          setIsSubmit(false);
          setIsLoading(false);
        });
    }
  };

  const googleAuthHandler = (e) => {
    e.preventDefault();
    window.open(`${AUTH_BASE_URL}/auth/google`, "_self");
  };

  return (
    <div className="login-component-container">
      <div className="login-component-line1">WELCOME</div>
      <form className="login-component-email-container" autoComplete="off">
        <TextField
          variant="outlined"
          label="E-mail"
          id="field1"
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
      <form className="login-component-password-container" autoComplete="off">
        <TextField
          variant="outlined"
          label="Password"
          id="field2"
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
          onClick={loginHandler}
          disabled={isSubmit}
        >
          <div className="login-component-login-btn-text">Login</div>
        </Button>
        {isLoading && <BarLoader color="orange" width={"100%"} />}
      </div>
      <div className="login-component-google-btn">
        <Button
          variant="contained"
          fullWidth
          style={{ backgroundColor: teal[500] }}
          startIcon={<GoogleIcon />}
          onClick={googleAuthHandler}
          disabled={isSubmit}
        >
          <div className="login-component-login-btn-text">
            Login With Google
          </div>
        </Button>
      </div>
      {errorText && (
        <div className="login-component-error-text">{errorText}</div>
      )}
    </div>
  );
};

export default Login;
