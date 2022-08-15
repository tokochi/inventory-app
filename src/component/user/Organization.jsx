import { useState } from "react";
const { ipcRenderer } = require("electron");
import { UploaderComponent } from "@syncfusion/ej2-react-inputs";
import { ProgressButtonComponent } from "@syncfusion/ej2-react-splitbuttons";
import { TextBoxComponent } from "@syncfusion/ej2-react-inputs";
import userPng from "../../data/icons/profile.png";
import logo from "../../data/icons/logo.jpg";
import phone from "../../data/icons/phone.png";
import fax from "../../data/icons/fax.png";
import rc from "../../data/icons/rc.png";
import rib from "../../data/icons/rib.png";
import nif from "../../data/icons/nif.png";
import ccp from "../../data/icons/ccp.png";
import ai from "../../data/icons/ai.png";
import facebook from "../../data/icons/facebook.png";
import location from "../../data/icons/location.png";
import email from "../../data/icons/email.png";
import { useStore, loadSettings } from "../../contexts/Store";

export default function Organization() {
  const company = useStore((state) => state.settings.company);
  const settingsId = useStore((state) => state.settings);
  const [filePath, setfilePath] = useState(company?.logo || logo);
    const handleClick = function () {
      ipcRenderer.send("updateSetting", { company: { ...company,...useStore.getState().selectedSettings, logo: filePath }, _id: settingsId._id });
       ipcRenderer.on("refreshSetting:update", (e, res) => {
         loadSettings();
        
       });
  };
  
  return (
    <div className="flex gap-4 m-4">
      <div className="p-2 basis-1/4  ">
        <div className="p-4 font-semibold  text-lg text-gray-600 rounded-t-md border border-gray-300  bg-gray-200">Logo de l'organisation</div>
        <div className="flex flex-col items-center border text-center shadow-md border-gray-300">
          <img className="m-4 rounded-full object-cover h-[200px] border border-gray-300" src={filePath} width="200" />
          <div className="m-8 pl-4 w-[150px]">
            <UploaderComponent id="fileUpload" type="file" locale="fr-BE" selected={(e) => setfilePath(e.filesData[0].rawFile.path)} allowedExtensions=".jpeg,.jpg,.png"></UploaderComponent>
          </div>
        </div>
      </div>
      <div className="p-2 basis-3/4 ">
        <div className="p-4 font-semibold  text-lg text-gray-600 rounded-t-md border border-gray-300  bg-gray-200 ">Détails de l'organisation</div>
        <div className=" flex flex-col items-center  shadow-md   border  border-gray-300">
          <div className="w-full">
            <div className="flex items-center mx-4  p-2 border-1 mt-2 border-gray-300 rounded-lg">
              <TextBoxComponent
                id="orgName"
                name="orgName"
                value={company?.name}
                change={(e) => useStore.setState((state) => ({ selectedSettings: { ...state.selectedSettings, name: e.value } }))}
                placeholder="Nom de l'organisation"
                floatLabelType="Auto"></TextBoxComponent>
              <img src={userPng} width="20" />
            </div>
            <table className="w-full table-fixed">
              <tbody>
                <tr>
                  <td className="p-4">
                    <div className="flex items-center border-1 mt-2 px-2 border-gray-300 rounded-lg ">
                      <TextBoxComponent
                        id="AffiName"
                        name="AffiName"
                        value={company?.AffiName}
                        change={(e) => useStore.setState((state) => ({ selectedSettings: { ...state.selectedSettings, AffiName: e.value } }))}
                        placeholder="Nom D'affiliation"
                        floatLabelType="Auto"></TextBoxComponent>
                      <img src={userPng} width="20" />
                    </div>
                  </td>
                  <td className="p-4 ">
                    <div className="flex items-center border-1 mt-2 px-2 border-gray-300 rounded-lg">
                      <TextBoxComponent
                        id="fax"
                        name="fax"
                        type="phone"
                        value={company?.fax}
                        change={(e) => useStore.setState((state) => ({ selectedSettings: { ...state.selectedSettings, fax: e.value } }))}
                        placeholder="Fax/Fix"
                        floatLabelType="Auto"></TextBoxComponent>
                      <img src={fax} width="20" />
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
                        value={company?.email}
                        change={(e) => useStore.setState((state) => ({ selectedSettings: { ...state.selectedSettings, email: e.value } }))}
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
                        value={company?.phone}
                        change={(e) => useStore.setState((state) => ({ selectedSettings: { ...state.selectedSettings, phone: e.value } }))}
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
                        value={company?.facebook}
                        change={(e) => useStore.setState((state) => ({ selectedSettings: { ...state.selectedSettings, facebook: e.value } }))}
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
                        value={company?.address}
                        change={(e) => useStore.setState((state) => ({ selectedSettings: { ...state.selectedSettings, address: e.value } }))}
                        placeholder="Addresse"
                        floatLabelType="Auto"></TextBoxComponent>
                      <img src={location} width="20" />
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="m-4 text-center">
              <ProgressButtonComponent cssClass="e-info" onClick={() => handleClick()}>
                Sauvgarder
              </ProgressButtonComponent>
            </div>
          </div>
        </div>
        <div className="p-4 mt-4 font-semibold w-full text-lg text-gray-600 rounded-t-md border border-gray-300  bg-gray-200 ">Informations Financière</div>
        <div className=" flex flex-col items-center shadow-md  w-full  border  border-gray-300">
          <table className="w-full table-fixed">
            <tbody>
              <tr>
                <td className="p-4">
                  <div className="flex items-center border-1 mt-2 px-2 border-gray-300 rounded-lg ">
                    <TextBoxComponent
                      id="rc"
                      name="rc"
                      value={company?.rc}
                      change={(e) => useStore.setState((state) => ({ selectedSettings: { ...state.selectedSettings, rc: e.value } }))}
                      placeholder="Numéro du registre de commerce RC"
                      floatLabelType="Auto"></TextBoxComponent>
                    <img src={rc} width="20" />
                  </div>
                </td>
                <td className="p-4 ">
                  <div className="flex items-center border-1 mt-2 px-2 border-gray-300 rounded-lg">
                    <TextBoxComponent
                      id="nif"
                      name="nif"
                      type="phone"
                      value={company?.nif}
                      change={(e) => useStore.setState((state) => ({ selectedSettings: { ...state.selectedSettings, nif: e.value } }))}
                      placeholder="Numéro d’identification fiscale NIF"
                      floatLabelType="Auto"></TextBoxComponent>
                    <img src={nif} width="20" />
                  </div>
                </td>
              </tr>
              <tr>
                <td className="p-4 ">
                  <div className="flex items-center border-1 mt-2 px-2 border-gray-300 rounded-lg">
                    <TextBoxComponent
                      id="ai"
                      name="ai"
                      type="ai"
                      value={company?.ai}
                      change={(e) => useStore.setState((state) => ({ selectedSettings: { ...state.selectedSettings, ai: e.value } }))}
                      placeholder="Numéro d’article d’imposition A.I "
                      floatLabelType="Auto"></TextBoxComponent>
                    <img src={ai} width="20" />
                  </div>
                </td>
                <td className="p-4 ">
                  <div className="flex items-center border-1 mt-2 px-2 border-gray-300 rounded-lg">
                    <TextBoxComponent
                      id="nis"
                      name="nis"
                      type="nis"
                      value={company?.nis}
                      change={(e) => useStore.setState((state) => ({ selectedSettings: { ...state.selectedSettings, nis: e.value } }))}
                      placeholder="Numéro d'identification statistique NIS"
                      floatLabelType="Auto"></TextBoxComponent>
                    <img src={rc} width="20" />
                  </div>
                </td>
              </tr>
              <tr>
                <td className="p-4 ">
                  <div className="flex items-center border-1 mt-2 px-2 border-gray-300 rounded-lg">
                    <TextBoxComponent
                      id="ccp"
                      name="ccp"
                      value={company?.ccp}
                      change={(e) => useStore.setState((state) => ({ selectedSettings: { ...state.selectedSettings, ccp: e.value } }))}
                      placeholder="Compte CCP"
                      floatLabelType="Auto"></TextBoxComponent>
                    <img src={ccp} width="20" />
                  </div>
                </td>
                <td className="p-4 ">
                  <div className="flex items-center border-1 mt-2 px-2 border-gray-300 rounded-lg">
                    <TextBoxComponent
                      id="rib"
                      name="rib"
                      type="rib"
                      value={company?.rib}
                      change={(e) => useStore.setState((state) => ({ selectedSettings: { ...state.selectedSettings, rib: e.value } }))}
                      placeholder="Relevé d'identité bancaire RIB"
                      floatLabelType="Auto"></TextBoxComponent>
                    <img src={rib} width="20" />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <div className="m-4 text-center">
            <ProgressButtonComponent
              cssClass="e-info"
              onClick={() => handleClick()}>
              Sauvgarder
            </ProgressButtonComponent>
          </div>
        </div>
      </div>
    </div>
  );
}
