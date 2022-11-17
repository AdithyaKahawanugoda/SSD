import React, { useState } from "react";
import "./SaveText.css";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import Button from "@mui/material/Button";
import { teal } from "@mui/material/colors";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import BarLoader from "react-spinners/BarLoader";
import { BASE_URL } from "../../constants";
import { logoutHandler } from "../../services/api";
import sha256 from "crypto-js/sha256";
import { ToastContainer, toast } from "react-toastify";
import { JSEncrypt } from "jsencrypt";
import axios from "axios";

const SaveText = () => {
  const [plainText, setPlainText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const publicKey =
    "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA1ktKNzJBXJirtXBhxjSX36sjLb7ba9qpuKueJmfS+AaYSXI6WvQCZaw3GcjTQrbWlzs0AV0tz76FTXMbVFvfuTpNT9ZqWkkntN/hJ5AvptfOV8jMxDfR1oDSy+uD1IGKhyfsK5+nL5zNwJmVIm9KyiZA2hXHmNr22CmEV+Y/Jhi9hPYQuYa62dPbwooCJL2CQgNOitzxsIA5UflxOZ37BnAkUIcuXwyMN/PIWclRDDWqJmYTAcq24eyVVmjIi+EGGec8m+hGBUM8rnCRpPxaOzSS2u6FzDwU68X3v7tZNly2Lf1usQ4f01hrQArIFcotMCna9ZT/RcweQDc7ApMMWQIDAQAB";
  const encrypt = new JSEncrypt();
  encrypt.setPublicKey(publicKey);

  const uploadToast = (text) => {
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

  const uploadHandler = async () => {
    if (plainText) {
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        withCredentials: true,
      };
      setIsLoading(true);

      const hashedText = sha256(plainText);
      const dataObj = {
        msg: plainText,
        hash: hashedText,
      };
      const stringifiedObj = JSON.stringify(dataObj);
      const encryptedObj = encrypt.encrypt(stringifiedObj);

      await axios
        .post(
          `${BASE_URL}/message/verifyAndSave`,
          { dataObj: encryptedObj },
          config
        )
        .then((res) => {
          if (res.status === 401) {
            logoutToast();
            logoutHandler();
          }
          uploadToast("Encrypted Data Saved On Database");
          setIsLoading(false);
        })
        .catch((err) => {
          alert(err.response.data.msg);
          setIsLoading(false);
        });
    }
  };

  return (
    <div className="save-text-container">
      <div className="save-text-container-textarea">
        <TextareaAutosize
          aria-label="minimum height"
          minRows={10}
          placeholder="Write Your Message Here.."
          style={{
            width: 700,
            paddingLeft: "5%",
            paddingRight: "5%",
            fontSize: "1.7em",
          }}
          onChange={(e) => {
            setPlainText(e.target.value);
          }}
          value={plainText}
        />
      </div>
      <div className="save-text-save-btn">
        <Button
          variant="contained"
          fullWidth
          style={{ backgroundColor: teal[500] }}
          startIcon={<ArrowForwardIosRoundedIcon />}
          onClick={uploadHandler}
        >
          <div className="save-text-save-btn-text">SAVE MESSAGE</div>
        </Button>
        {isLoading && <BarLoader color="orange" width={"100%"} />}
      </div>
      <ToastContainer />
    </div>
  );
};

export default SaveText;
