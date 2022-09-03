import { useState } from "react";
import { TextBoxComponent } from "@syncfusion/ej2-react-inputs";
import passwordPng from "../../data/icons/password.png";
import { useStore } from "../../contexts/Store";
const { ipcRenderer } = require("electron");
import TextBox from "../../component/button/TextBox";
import { ProgressButtonComponent } from "@syncfusion/ej2-react-splitbuttons";

export default function Profile() {
  const user = JSON.parse(localStorage.getItem("user"));
    const required = { required: true, oninvalid: `setCustomValidity('ce champ est obligatoire');`, oninput: `setCustomValidity('');` };

  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [wrongPassword, setWrongPassword] = useState(false);
  const [validatePassword, setValidatePassword] = useState("");
  const handleClick = function () {
    if (newPassword === validatePassword) {
      ipcRenderer.send("updateUserPassword", { newPassword, password, _id: user._id });
      ipcRenderer.on("userPassword:failed", () => {
        setWrongPassword(true);
      });
    }
  };
  return (
    <div className="m-4  w-1/2 shadow-md">
      <div className="p-4 font-semibold  text-lg text-gray-600 rounded-t-md border border-gray-300  bg-gray-200 ">Changer le mot de passe</div>
      <div className=" flex flex-col items-center  w-full  ">
        <div className=" flex flex-col gap-4 items-center w-full p-4 border  border-gray-300">
          <TextBox
            id="Password"
            name="Password"
            type="Password"
            value={password}
            img={passwordPng}
            htmlAttributes={required}
            onChange={(e) => {
              setPassword(e.target.value);
              setWrongPassword(false);
            }}
            title="Mot de passe actuelle"></TextBox>
          {wrongPassword && <span className="m-1 text-xs text-red-400">Utilisateur ou Mot de passe incorrecte</span>}

          <TextBox
            id="newPassword"
            name="newPassword"
            type="password"
            value={newPassword}
            img={passwordPng}
            htmlAttributes={required}
            onChange={(e) => setNewPassword(e.target.value)}
            title="Nouveau Mot de passe"></TextBox>

          <TextBox
            id="newPassword"
            name="newPassword"
            type="password"
            value={validatePassword}
            img={passwordPng}
            htmlAttributes={required}
            onChange={(e) => setValidatePassword(e.target.value)}
            title="Nouveau Mot de passe"></TextBox>

          <div className="m-4">
            <ProgressButtonComponent cssClass="e-info" end={() => handleClick()}>
              Sauvgarder
            </ProgressButtonComponent>
          </div>
        </div>
      </div>
    </div>
  );
}
