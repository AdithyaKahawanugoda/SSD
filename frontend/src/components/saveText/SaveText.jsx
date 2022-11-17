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
import CryptoJS from "crypto-js";
import { ToastContainer, toast } from "react-toastify";
import publicKey from "../../rsa_2048_public_key.pem";
import axios from "axios";

const SaveText = () => {
  const [plainText, setPlainText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
      let hashedText = sha256(plainText);
      let dataObj = {
        msg: plainText,
        hash: hashedText,
      };
      const encrypted = crypto.publicEncrypt(publicKey, Buffer.from(dataObj));
      const cipherObj = encrypted.toString("base64");
      await axios
        .post(
          `${BASE_URL}/message/verifyAndSave`,
          { dataObj: cipherObj },
          config
        )
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
      // await axios
      //   .post(
      //     `${BASE_URL}/message/saveHash`,
      //     {
      //       hash: hashedText,
      //     },
      //     config
      //   )
      //   .then((res) => {
      //     if (res.status === 401) {
      //       logoutToast();
      //       logoutHandler();
      //     }
      //     uploadToast("Hash Saved On Database");
      //     axios
      //       .post(
      //         `${BASE_URL}/message/saveMessage`,
      //         {
      //           content: plainText,
      //           objId: res?.data?._id,
      //         },
      //         config
      //       )
      //       .then((res) => {
      //         uploadToast(res.data.msg);
      //         setPlainText("");
      //         setIsLoading(false);
      //         if (res.status === 401) {
      //           logoutToast();
      //           logoutHandler();
      //         }
      //       })
      //       .catch((error) => {
      //         alert(error.response.data.msg);
      //         setIsLoading(false);
      //       });
      //   })
      //   .catch((error) => {
      //     alert(error.response.data.msg);
      //     setIsLoading(false);
      //   });
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
