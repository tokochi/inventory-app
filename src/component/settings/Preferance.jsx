import React from "react";
import { ProgressButtonComponent } from "@syncfusion/ej2-react-splitbuttons";

export default function Preferance() {
  return (
    <div className="m-4  w-1/2 shadow-md">
      <div className="p-4 font-semibold  text-lg text-gray-600 rounded-t-md border border-gray-300  bg-gray-200 ">Changer le mot de passe</div>
      <div className=" flex flex-col items-center  w-full  ">
        <div className=" flex flex-col gap-4 items-center w-full p-4 border  border-gray-300">
          <div className="flex items-center w-full  mx-4  p-2 border-1 mt-2 border-gray-300 rounded-lg"></div>
          <div className="flex items-center w-full  mx-4  p-2 border-1 mt-2 border-gray-300 rounded-lg"></div>
          <div className="flex items-center  w-full  mx-4  p-2 border-1 mt-2 border-gray-300 rounded-lg"></div>
          <div className="m-4">
            <ProgressButtonComponent cssClass="e-info" onClick={(e) => ipcRenderer.send("updateUser", { ...useStore.getState().selectedUsers, logo: filePath, _id: settingsId._id })}>
              Sauvgarder
            </ProgressButtonComponent>
          </div>
        </div>
      </div>
    </div>
  );
}
