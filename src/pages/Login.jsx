import React from "react";
import { ProgressButtonComponent } from "@syncfusion/ej2-react-splitbuttons";
import { TextBoxComponent } from "@syncfusion/ej2-react-inputs";
import passwordPng from "../data/icons/password.png";
import { useState } from "react";
import userPng from "../data/icons/profile.png";
import { useStore } from "../contexts/Store";
import { NavLink, useNavigate } from "react-router-dom";
import Register from "./Register";
import TextBox from "../component/button/TextBox";
const { ipcRenderer } = require("electron");

export default function Login() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [wrongPassword, setWrongPassword] = useState(false);
  const required = { required: true, oninvalid: `setCustomValidity('ce champ est obligatoire');`, oninput: `setCustomValidity('');` };

  return (
    <div className=" flex mt-24 justify-center h-screen bg-main-bg  ">
      <div className="w-[350px] shadow-md">
        <div className="p-4 font-semibold  text-lg text-gray-600 rounded-t-md border border-gray-300  bg-gray-200 ">Connectez-vous</div>
        <TextBox

          id="userName"
          name="userName"
          value={userName}
          img={userPng}
          htmlAttributes={required}
          onChange={(e) => {
            setUserName(e.target.value);
            setWrongPassword(false);
          }}
          title="Nom d'utilisateur"></TextBox>
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
          title="Mot de passe"></TextBox>
        {wrongPassword && <span className="m-1 text-xs text-red-400">Utilisateur ou Mot de passe incorrecte</span>}
        <div className="m-4 text-center">
          <ProgressButtonComponent
            cssClass="e-info"
            end={(e) => {
              ipcRenderer.send("loginUser", { userName, password });
              ipcRenderer.on("loginUser:get", (e, res) => {
                const loggedUser = JSON.parse(res);
                
                if (loggedUser == null) {
                  setWrongPassword(true);
                } else if (loggedUser.isLogged === false) {
                  setWrongPassword(true);
                } else {
                  localStorage.setItem("isLoggedIn", JSON.stringify(true));
                  localStorage.setItem("user", res);
                  navigate("/accueil");
                }
              });
            }}>
            Se connecter
          </ProgressButtonComponent>
        </div>
        <div className="p-4 font-semibold text-center text-lg text-blue-600 rounded-b-md border border-gray-300  bg-gray-200 ">
          <NavLink to="/register">
            <button className="text-xs  hover:underline hover:underline-offset-2 hover:text-blue-700"> Besoin d'un compte? S'inscrire!</button>
          </NavLink>
        </div>
      </div>
    </div>
  );
}
