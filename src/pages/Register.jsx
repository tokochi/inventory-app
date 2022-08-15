import { useState, useEffect } from "react";
import { DialogComponent } from "@syncfusion/ej2-react-popups";
import { UploaderComponent } from "@syncfusion/ej2-react-inputs";
import { ProgressButtonComponent } from "@syncfusion/ej2-react-splitbuttons";
import { ButtonComponent } from "@syncfusion/ej2-react-buttons";
import { TextBoxComponent } from "@syncfusion/ej2-react-inputs";
import { DatePickerComponent } from "@syncfusion/ej2-react-calendars";
import { RadioButtonComponent } from "@syncfusion/ej2-react-buttons";
import userPng from "../data/icons/profile.png";
import password from "../data/icons/password.png";
import { HashRouter, Routes, Route } from "react-router-dom";
import phone from "../data/icons/phone.png";
import facebook from "../data/icons/facebook.png";
import location from "../data/icons/location.png";
import email from "../data/icons/email.png";
import { useStore } from "../contexts/Store";
import { NavLink } from "react-router-dom";
const { ipcRenderer } = require("electron");
import { useNavigate } from "react-router-dom";
import Login from "./Login";

export default function Register() {
    const navigate = useNavigate();
  const [pin, setPin] = useState("");
  const required = { required: true, oninvalid: `setCustomValidity('ce champ est obligatoire');`, oninput: `setCustomValidity('');` };
    const handleClick = function () {
      
    if (pin === "1990") {
        ipcRenderer.send("addUser", useStore.getState().selectedUsers);
        navigate("/login");
      ;
    }
  };

  return (
    <div className=" flex  justify-center h-screen bg-main-bg  ">
      <div className="w-[600px] ">
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}>
          <div className="p-2 basis-3/4 ">
            <div className="p-4 font-semibold  text-lg text-gray-600 rounded-t-md border border-gray-300  bg-gray-200 ">Ajouter un compte</div>
            <div className=" flex flex-col items-center  shadow-md  border  border-gray-300">
              <div className="w-full">
                <div className="flex items-center mx-4  p-2 border-1 mt-4 border-gray-300 rounded-lg">
                  <TextBoxComponent
                    id="userName"
                    name="userName"
                    htmlAttributes={required}
                    change={(e) => {
                      useStore.setState((state) => ({ selectedUsers: { ...state.selectedUsers, userName: e.value } }));
                    }}
                    placeholder="Nom d'utilisateur *"
                    floatLabelType="Auto"></TextBoxComponent>
                  <img src={userPng} width="20" />
                </div>

                <div className="flex items-center   mx-4  p-2 border-1 mt-4 border-gray-300 rounded-lg">
                  <TextBoxComponent
                    id="password"
                    name="password"
                    type="password"
                    htmlAttributes={required}
                    change={(e) => {
                      useStore.setState((state) => ({ selectedUsers: { ...state.selectedUsers, password: e.value } }));
                    }}
                    placeholder="Mot de passe *"
                    floatLabelType="Auto"></TextBoxComponent>
                  <img src={password} width="20" />
                </div>

                <table className="w-full table-fixed">
                  <tbody>
                    <tr>
                      <td className="p-4">
                        <div className="flex items-center border-1 mt-2 px-2 border-gray-300 rounded-lg ">
                          <TextBoxComponent
                            id="name"
                            name="name"
                            change={(e) => useStore.setState((state) => ({ selectedUsers: { ...state.selectedUsers, name: e.value } }))}
                            placeholder="Nom Complet"
                            floatLabelType="Auto"></TextBoxComponent>
                          <img src={userPng} width="20" />
                        </div>
                      </td>
                      <td className="p-4 ">
                        <div className="flex items-center border-1 mt-2 px-2 border-gray-300 rounded-lg">
                          <DatePickerComponent
                            id="birthdate"
                            name="birthdate"
                            change={(e) => useStore.setState((state) => ({ selectedUsers: { ...state.selectedUsers, birthdate: e.value } }))}
                            placeholder="Date de naissance"
                            format="dddd MMMM y"
                            floatLabelType="Auto"></DatePickerComponent>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td className="p-4 ">
                        <div className="flex items-center border-1 mt-2 px-2 border-gray-300 rounded-lg">
                          <TextBoxComponent
                            id="email"
                            name="email"
                            type="email"
                            change={(e) => useStore.setState((state) => ({ selectedUsers: { ...state.selectedUsers, email: e.value } }))}
                            placeholder="Email"
                            floatLabelType="Auto"></TextBoxComponent>
                          <img src={email} width="20" />
                        </div>
                      </td>
                      <td className="p-4 ">
                        <div className="flex items-center border-1 mt-2 px-2 border-gray-300 rounded-lg">
                          <TextBoxComponent
                            id="phone"
                            name="phone"
                            type="phone"
                            change={(e) => useStore.setState((state) => ({ selectedUsers: { ...state.selectedUsers, phone: e.value } }))}
                            placeholder="Telephone"
                            floatLabelType="Auto"></TextBoxComponent>
                          <img src={phone} width="20" />
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td className="p-4 ">
                        <div className="flex items-center border-1 mt-2 px-2 border-gray-300 rounded-lg">
                          <TextBoxComponent
                            id="facebook"
                            name="facebook"
                            change={(e) => useStore.setState((state) => ({ selectedUsers: { ...state.selectedUsers, facebook: e.value } }))}
                            placeholder="Facebook"
                            floatLabelType="Auto"></TextBoxComponent>
                          <img src={facebook} width="20" />
                        </div>
                      </td>
                      <td className="p-4 ">
                        <div className="flex items-center border-1 mt-2 px-2 border-gray-300 rounded-lg">
                          <TextBoxComponent
                            id="address"
                            name="address"
                            change={(e) => useStore.setState((state) => ({ selectedUsers: { ...state.selectedUsers, address: e.value } }))}
                            placeholder="Addresse"
                            floatLabelType="Auto"></TextBoxComponent>
                          <img src={location} width="20" />
                        </div>
                      </td>
                    </tr>

                    <tr>
                      <td className="p-4 ">
                        <div className="flex items-center border-1 mt-2 px-2 border-gray-300 rounded-lg ">
                          <TextBoxComponent
                            id="pin"
                            name="pin"
                            type="password"
                            value={pin}
                            htmlAttributes={{ required: true, maxlength: "4", oninvalid: `setCustomValidity('Code Pin Incorrecte');`, oninput: `setCustomValidity('');` }}
                            change={(e) => {
                              setPin(e.value);
                            }}
                            placeholder="Pin Code"
                            floatLabelType="Auto"></TextBoxComponent>
                          <img src={password} width="20" />
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center justify-center  mt-4  ">
                          <ProgressButtonComponent cssClass="e-info" end={() => handleClick()}>
                            Confirmer
                          </ProgressButtonComponent>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
