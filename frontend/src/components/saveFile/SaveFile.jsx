import React, { useState } from "react";
import "./SaveFile.css";
import Button from "@mui/material/Button";
import { teal } from "@mui/material/colors";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import BarLoader from "react-spinners/BarLoader";
import { BASE_URL } from "../../constants";
import { logoutHandler } from "../../services/api";
import sha256 from "crypto-js/sha256";
import { ToastContainer, toast } from "react-toastify";
import CryptoJS from "crypto-js";
import { JSEncrypt } from "jsencrypt";
import axios from "axios";
// Import React FilePond
import { FilePond, registerPlugin } from "react-filepond";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import FilePondPluginFileEncode from "filepond-plugin-file-encode";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
// Register the plugins
registerPlugin(
  FilePondPluginImageExifOrientation,
  FilePondPluginImagePreview,
  FilePondPluginFileEncode,
  FilePondPluginFileValidateType
);

const SaveFile = () => {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const publicKey =
    "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA1ktKNzJBXJirtXBhxjSX36sjLb7ba9qpuKueJmfS+AaYSXI6WvQCZaw3GcjTQrbWlzs0AV0tz76FTXMbVFvfuTpNT9ZqWkkntN/hJ5AvptfOV8jMxDfR1oDSy+uD1IGKhyfsK5+nL5zNwJmVIm9KyiZA2hXHmNr22CmEV+Y/Jhi9hPYQuYa62dPbwooCJL2CQgNOitzxsIA5UflxOZ37BnAkUIcuXwyMN/PIWclRDDWqJmYTAcq24eyVVmjIi+EGGec8m+hGBUM8rnCRpPxaOzSS2u6FzDwU68X3v7tZNly2Lf1usQ4f01hrQArIFcotMCna9ZT/RcweQDc7ApMMWQIDAQAB";
  const encrypt = new JSEncrypt();
  encrypt.setPublicKey(publicKey);

  const encodeFile = () => {
    if (file[0]) {
      return file[0]?.getFileEncodeDataURL();
    }
  };

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

  const makeId = (length) => {
    let result = "";
    let characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };

  const uploadHandler = async () => {
    setIsLoading(true);
    let fileEncodeDataURL = encodeFile();
    let hash = sha256(fileEncodeDataURL);
    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
      withCredentials: true,
    };

    if (fileEncodeDataURL && hash) {
      const dataObj = {
        encodedFile: fileEncodeDataURL,
        hash,
      };
      const stringifiedObj = JSON.stringify(dataObj);
      const aesKeyLength = Math.random() * 10;
      const aesKey = makeId(aesKeyLength);
      const encryptedAESKey = encrypt.encrypt(aesKey);
      const aesEncryptedObj = CryptoJS.AES.encrypt(
        stringifiedObj,
        aesKey
      ).toString();
      await axios
        .post(
          `${BASE_URL}/file/saveFile`,
          { dataObj: aesEncryptedObj, encryptedAESKey },
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
    <div>
      <FilePond
        files={file}
        onupdatefiles={setFile}
        allowMultiple={false}
        allowFileEncode={true}
        maxFiles={1}
        name="files"
        credits={false}
        labelIdle='Upload files<br />Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
        required
        allowImagePreview
        className="border rounded-2xl"
        imagePreviewMinHeight={350}
      />
      <div className="save-file-upload-btn">
        <Button
          variant="contained"
          fullWidth
          style={{ backgroundColor: teal[500] }}
          startIcon={<ArrowForwardIosRoundedIcon />}
          onClick={uploadHandler}
        >
          <div className="save-text-save-btn-text">UPLOAD FILE</div>
        </Button>
        {isLoading && <BarLoader color="orange" width={"100%"} />}
      </div>
      <ToastContainer />
    </div>
  );
};

export default SaveFile;
