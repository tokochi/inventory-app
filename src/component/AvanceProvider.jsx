import React, { useState, useEffect } from "react";
import { DialogComponent } from "@syncfusion/ej2-react-popups";
import TextBox from "../component/button/TextBox";
import { useStore, loadProviders } from "../contexts/Store";
const { ipcRenderer } = require("electron");
import { DateTimePickerComponent } from "@syncfusion/ej2-react-calendars";
import { HashRouter } from 'react-router-dom';
import Toast from "./Toast";

export default function AvanceProvider({ header, id, svg, children, width, footer, content, onChange, close, fields, dataSource, ...rest }) {
  const providersData = () => useStore((state) => state.providers);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [amount, setAmount] = useState(0);
   const [toastAdd, setToastAdd] = useState(false);
  
  const [paymentType, setPaymentType] = useState("cash");
  const [date, setDate] = useState(new Date());
  const [slectedProvider, setSlectedProvider] = useState("");
  useEffect(() => {
    close && setDropdownOpen(false);
  }, [close]);
  useEffect(() => {
    if (toastAdd) {
      setTimeout(() => setToastAdd(false), 4000);
    }
 
  }, [toastAdd]);
  return (
    <>
      <button
        onClick={(e) => {
          e.preventDefault();
          setDropdownOpen(!dropdownOpen);
        }}
        className="btn bg-indigo-500 hover:bg-indigo-600 text-white">
        <svg className="w-4 h-4 fill-current opacity-50 shrink-0" viewBox="0 0 16 16">
          <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
        </svg>
        <span className="hidden xs:block ml-2">Ajouter Versement</span>
      </button>
      <DialogComponent
        id={id}
        isModal
        allowDragging
        header="Réglement Crédits"
        visible={dropdownOpen}
        showCloseIcon={true}
        closeOnEscape
        width="500"
        open={() => setDropdownOpen(true)}
        close={() => setDropdownOpen(false)}
        footerTemplate={() => (
          <div>
            {" "}
            <ul className="flex items-center justify-end gap-6">
              <li>
                <button
                  className="btn-xs bg-indigo-500 hover:bg-indigo-600 text-white"
                  onClick={() => {
                    setDropdownOpen(false);
                    amount > 0 &&
                      ipcRenderer.send("updateProvider", { credit: slectedProvider.credit - amount, _id: slectedProvider._id, avance: { credit: slectedProvider.credit, date, amount, paymentType } });
                    ipcRenderer.on("refreshGridProvider:update", (e, res) => {
                      loadProviders();
                      setToastAdd(true);
                      ipcRenderer.removeAllListeners("refreshGridProvider:update");
                    });
                  }}>
                  Terminer
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
        <div className="">
          <table>
            <tbody>
              <tr>
                <td className="p-4 w-[220px] text-sm font-medium">Choisir Fournisseur:</td>
                <td className="w-[320px]">
                  <TextBox
                    type="dropdown"
                    id="provider"
                    width="full"
                    onChange={(e) => e.itemData != null && setSlectedProvider(e.itemData)}
                    dataSource={providersData()}
                    fields={{ value: "_id", text: "name" }}
                    popupHeight="200px"
                    title="Choisir le Fournisseur"
                  />
                </td>
              </tr>
              <tr>
                <td className="p-4 w-[220px] text-sm font-medium">Date Réglement:</td>

                <td className="w-[320px]">
                  <DateTimePickerComponent
                    id="date"
                    name="date"
                    width="260"
                    value={date}
                    onChange={(e) => setDate(e.value)}
                    placeholder="Date de paiment"
                    format="dddd MMMM y - HH:mm"
                    floatLabelType="Never"></DateTimePickerComponent>
                </td>
              </tr>
              <tr>
                <td className="p-4 w-[220px] text-sm font-medium">Mode de Paiement:</td>
                <td className="w-[320px]">
                  <TextBox
                    type="dropdown"
                    id="paymentType"
                    width="full"
                    value={paymentType}
                    onChange={(e) => e.value != null && setPaymentType(e.value)}
                    dataSource={["Espéce", "Chéque", "Virement"]}
                    popupHeight="200px"
                    title="Mode de Paiement"
                  />
                </td>
              </tr>
              <tr>
                <td className="p-4 w-[220px] text-sm font-medium">Crédits initial:</td>
                <td className="w-[320px] text-rose-500 select-none">
                  <TextBox
                    type="number"
                    // readonly
                    // showSpinButton={false}
                    enabled={false}
                    format="N2"
                    label="DA"
                    id="credit"
                    width="w-[200px]"
                    value={slectedProvider.credit}
                    step={100}
                    min={0}
                    title="Montant Avance"
                  />
                </td>
              </tr>
              <tr>
                <td className="p-4 w-[220px] text-sm font-medium">Montant:</td>
                <td className="w-[320px]">
                  <TextBox
                    type="number"
                    format="N2"
                    label="DA"
                    id="amount"
                    width="w-[200px]"
                    max={slectedProvider.credit}
                    onChange={(e) => {
                      e.value != null && setAmount(e.value);
                    }}
                    step={100}
                    min={0}
                    title="Montant Avance"
                  />
                </td>
              </tr>
              <tr>
                <td className={`p-4 w-[220px] text-sm font-medium`}>Crédits restant:</td>
                <td className={`w-[320px] select-none ${slectedProvider.credit === amount ? "text-emerald-500" : "text-amber-500"}`}>
                  <TextBox type="number" enabled={false} format="N2" label="DA" id="creditLeft" width="w-[200px]" step={100} min={0} value={slectedProvider.credit - amount} title="Crédits restant" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </DialogComponent>
      <Toast type="success" open={toastAdd} setOpen={setToastAdd}>
        Vérsement Ajouter  avec succès.
      </Toast>
    </>
  );
}
