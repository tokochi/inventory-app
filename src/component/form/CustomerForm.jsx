import TextBox from "../button/TextBox";
import React, { useState } from "react";
import {  useStore } from "../../contexts/Store";
import { DialogComponent } from "@syncfusion/ej2-react-popups";
import Store from "electron-store";

export default function CustomerForm(props) {
  const labelclassName = "p-4 w-[170px] text-sm font-medium";
  const gridProduct = useStore((state) => state.gridProduct);
  const store = new Store();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [pin, setPin] = useState(false);
  const [auth, setAuth] = useState(false);
  const [wrongPin, setWrongPin] = useState(false);
  return (
    <div>
      <table>
        <tbody>
          <tr>
            <td className={labelclassName}>Nom :</td>
            <td className="w-[320px]">
              <TextBox type="text" id="name" width="full" onChange={() => gridProduct?.editModule?.editFormValidate()} value={props?.name || ""} title="Nom du Client" />
            </td>
          </tr>
          <tr>
            <td className={labelclassName}>Adresse:</td>
            <td className="w-[320px]">
              <TextBox type="text" id="address" width="full" value={props?.address || ""} title="Adresse du Client" />
            </td>
          </tr>
          <tr>
            <td className={labelclassName}>Téléphone:</td>
            <td className="w-[320px]">
              <TextBox type="text" id="phone" width="full" value={props?.phone || ""} title="N° Téléphone du Client" />
            </td>
          </tr>
          {/* <tr>
            <td className={labelclassName}>Fax:</td>
            <td className="w-[320px]">
              <TextBox type="text" id="fax" width="full" value={props?.fax} title="N° Fax du Client" />
            </td>
          </tr> */}
          <tr>
            <td className={labelclassName}>Email:</td>
            <td className="w-[320px]">
              <TextBox type="text" id="email" width="full" value={props?.email || ""} title="Email du Client" />
            </td>
          </tr>
          <tr>
            <td className={labelclassName}>CCP:</td>
            <td className="w-[320px]">
              <TextBox type="text" id="ccp" width="full" value={props?.ccp || ""} title="CCP du Client" />
            </td>
          </tr>
          {/* <tr>
            <td className={labelclassName}>RIB:</td>
            <td className="w-[320px]">
              <TextBox type="text" id="rib" width="full" value={props?.name} title="RIB du Client" />
            </td>
          </tr> */}
          <tr>
            <td className={labelclassName}>Solde Crédit:</td>
            <td className="w-[320px]">
              {store?.get("customerPin") === false || auth === true || props.isAdd === true ? (
                <TextBox type="number" format="N2" label="DA" id="credit" width="w-[200px]" step={100} min={0} value={props?.credit || 0} title="Solde Crédit" />
              ) : (
                <div className="">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setDropdownOpen(true);
                    }}
                    className={`btn  border-slate-200 shadow-sm text-indigo-500`}>
                    besoin d'une autorisation 🔒
                  </button>
                </div>
              )}
            </td>
          </tr>
          <tr>
            <td className={labelclassName}>Remarque:</td>
            <td className="w-[320px]">
              <TextBox type="text" multiline id="comment" width="full" value={props?.comment || ""} title="Remarque sur le Client" />
            </td>
          </tr>
        </tbody>
      </table>
      <DialogComponent
        header="Autorisation 🔒"
        visible={dropdownOpen}
        showCloseIcon={true}
        closeOnEscape
        width="200"
        open={() => setDropdownOpen(true)}
        close={() => setDropdownOpen(false)}
        footerTemplate={() => (
          <div>
            <ul className="flex items-center justify-end gap-6">
              <li>
                <button
                  className="btn-xs bg-indigo-500 hover:bg-indigo-600 text-white"
                  onClick={() => {
                    if (pin === store.get("pin")) {
                      setAuth(true);
                      setDropdownOpen(false);
                    } else {
                      setAuth(false);
                      setWrongPin(true);
                    }
                  }}>
                  Ajouter
                </button>
              </li>
              <li>
                <button
                  className="btn-xs bg-white border-slate-200 hover:border-slate-300 text-slate-500 hover:text-slate-600"
                  onClick={(e) => {
                    setDropdownOpen(false);
                  }}>
                  Annuler
                </button>
              </li>
            </ul>
          </div>
        )}>
        <div className="flex flex-col justify-start items-start">
          <label className="text-sm font-medium mr-2 mb-1" htmlFor="name">
            Code Pin
          </label>
          <TextBox
            id="name"
            onChange={(e) => {
              setWrongPin(false);
              setPin(e.value);
            }}
            className="form-input w-full"
            min={0}
            htmlAttributes={{ maxlength: "6", type: "password" }}
            type="number"
            showSpinButton={false}
            format="N0"
          />
          {wrongPin && <span className="m-1 text-xs text-red-400">Code pin inccorecte</span>}
        </div>
      </DialogComponent>
    </div>
  );
}
