import { useState, useEffect } from "react";
import profile from "../../data/icons/profile.png";

import { UploaderComponent } from "@syncfusion/ej2-react-inputs";
import { ProgressButtonComponent } from "@syncfusion/ej2-react-splitbuttons";
import { TextBoxComponent } from "@syncfusion/ej2-react-inputs";
import { DatePickerComponent } from "@syncfusion/ej2-react-calendars";
import { RadioButtonComponent } from "@syncfusion/ej2-react-buttons";
import userPng from "../../data/icons/profile.png";
import password from "../../data/icons/password.png";
import phone from "../../data/icons/phone.png";
import facebook from "../../data/icons/facebook.png";
import location from "../../data/icons/location.png";
import email from "../../data/icons/email.png";
import { useStore } from "../../contexts/Store";
const { ipcRenderer } = require("electron");

export default function Profile() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [filePath, setfilePath] = useState(user .logo || profile);
  const handleClick = function () {
     localStorage.setItem("user", JSON.stringify({ ...user,...useStore.getState().selectedUsers, logo: filePath }));
    ipcRenderer.send("updateUser", { ...user, ...useStore.getState().selectedUsers, logo: filePath, _id: user._id });
window.location.reload();
    
  }

  
  return (
    <div className="flex gap-4 m-4 ">
      <div className=" basis-1/4 p-2 ">
        <div className="p-4 font-semibold  text-lg text-gray-600 rounded-t-md border border-gray-300  bg-gray-200 ">Photo de profile</div>
        <div className=" flex flex-col items-center border text-center shadow-md border-gray-300">
          <img className="m-4 rounded-full object-cover h-[200px] border border-gray-300" src={filePath} width="200" />
          <div className="m-8 pl-4 w-[150px]">
            <UploaderComponent id="fileUpload" type="file" locale="fr-BE" selected={(e) => setfilePath(e.filesData[0].rawFile.path)} allowedExtensions=".jpeg,.jpg,.png"></UploaderComponent>
          </div>
        </div>
      </div>
      <div className="p-2 basis-3/4 ">
        <div className="p-4 font-semibold  text-lg text-gray-600 rounded-t-md border border-gray-300  bg-gray-200 ">Détails du compte</div>
        <div className=" flex flex-col items-center  shadow-md  border  border-gray-300">
          <div className="w-full">
            <div className="flex items-center mx-4  p-2 border-1 mt-2 border-gray-300 rounded-lg">
              <TextBoxComponent
                id="userName"
                name="userName"
                value={user?.userName}
                change={(e) => useStore.setState((state) => ({ selectedUsers: { ...state.selectedUsers, userName: e.value } }))}
                placeholder="Nom d'utilisateur"
                floatLabelType="Auto"></TextBoxComponent>
              <img src={userPng} width="20" />
            </div>
            <table className="w-full table-fixed">
              <tbody>
                <tr>
                  <td className="p-4">
                    <div className="flex items-center border-1 mt-2 px-2 border-gray-300 rounded-lg ">
                      <TextBoxComponent
                        id="name"
                        name="name"
                        value={user?.name}
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
                        value={user?.birthdate}
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
                        value={user?.email}
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
                        value={user?.phone}
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
                        value={user?.facebook}
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
                        value={user?.address}
                        change={(e) => useStore.setState((state) => ({ selectedUsers: { ...state.selectedUsers, address: e.value } }))}
                        placeholder="Addresse"
                        floatLabelType="Auto"></TextBoxComponent>
                      <img src={location} width="20" />
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="flex justify-between items-center gap-2 p-2 m-4 ">
                    <p className="text-gray-400 ">Civilité:</p>
                    <RadioButtonComponent
                      label="Monsieur"
                      name="gender"
                      change={(e) => useStore.setState((state) => ({ selectedUsers: { ...state.selectedUsers, gender: e.value } }))}
                      value="Monsieur"
                      checked={user.gender === "Monsieur" ? true : false}></RadioButtonComponent>
                    <RadioButtonComponent
                      label="Madame"
                      name="gender"
                      change={(e) => useStore.setState((state) => ({ selectedUsers: { ...state.selectedUsers, gender: e.value } }))}
                      value="Madame"
                      checked={user.gender === "Madame" ? true : false}></RadioButtonComponent>
                    <RadioButtonComponent
                      label="Mademoiselle"
                      name="gender"
                      change={(e) => useStore.setState((state) => ({ selectedUsers: { ...state.selectedUsers, gender: e.value } }))}
                      value="Mademoiselle"
                      checked={user.gender === "Mademoiselle" ? true : false}></RadioButtonComponent>
                  </td>
                  <td className="p-4 text-center">
                    <ProgressButtonComponent cssClass="e-info"  end={() => handleClick()}>
                      Sauvgarder
                    </ProgressButtonComponent>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
