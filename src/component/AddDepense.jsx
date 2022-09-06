import React, { useState, useEffect } from "react";
import { DialogComponent } from "@syncfusion/ej2-react-popups";
import TextBox from "./button/TextBox";
import { useStore, loadDepenses } from "../contexts/Store";
const { ipcRenderer } = require("electron");
import { DateTimePickerComponent } from "@syncfusion/ej2-react-calendars";
import { HashRouter } from 'react-router-dom';


export default function AddDepense({ header, id, svg, children, width, footer, content, onChange, close, fields, dataSource, ...rest }) {

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [amount, setAmount] = useState(0);
  const [comment, setComment] = useState("");

  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date());
  const [slectedDepense, setSlectedDepense] = useState("");

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
        <span className="hidden xs:block ml-2">Ajouter Dépense</span>
      </button>
      <DialogComponent
        id={id}
        isModal
        allowDragging
        header="Ajouter une Dépense"
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
                    amount > 0 && ipcRenderer.send("addDepense", { amount, comment, description, date, type: slectedDepense });
                    setAmount(0);
                    setComment("");
                    setDescription("");
                    setSlectedDepense("");
                    ipcRenderer.on("refreshDepense:add", (e, res) => {
                      setDropdownOpen(false);

                      loadDepenses();
                      ipcRenderer.removeAllListeners("refreshDepense:add");
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
                <td className="p-4 w-[220px] text-sm font-medium">Type:</td>
                <td className="w-[320px]">
                  <TextBox
                    type="dropdown"
                    id="provider"
                    width="full"
                    onChange={(e) => e.value != null && setSlectedDepense(e.value)}
                    dataSource={["Facture élec/Gaz", "Salaire Employée", "Frais Location", "Maintenance", "Sérvices", "Frais Transport", "Autre Frais"]}
                    popupHeight="200px"
                    title="Type Dépense"
                  />
                </td>
              </tr>
              <tr>
                <td className="p-4 w-[220px] text-sm font-medium">Date:</td>

                <td className="w-[320px]">
                  <DateTimePickerComponent
                    id="date"
                    name="date"
                    width="260"
                    value={date}
                    onChange={(e) => setDate(e.value)}
                    placeholder="Date"
                    format="dddd MMMM y - HH:mm"
                    floatLabelType="Never"></DateTimePickerComponent>
                </td>
              </tr>
              <tr>
                <td className="p-4 w-[220px] text-sm font-medium">Déscription:</td>
                <td className="w-[320px]">
                  <TextBox type="text" id="paymentType" width="full" value={description} onChange={(e) => e.value != null && setDescription(e.value)} title="Déscription" />
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
                    value={amount}
                    onChange={(e) => {
                      e.value != null && setAmount(e.value);
                    }}
                    step={100}
                    min={0}
                    title="Montant Dépense"
                  />
                </td>
              </tr>
              <tr>
                <td className="p-4 w-[220px] text-sm font-medium">Remarque:</td>
                <td className="w-[320px] text-rose-500 select-none">
                  <TextBox type="text" multiline id="comment" width="full" onChange={(e) => e.value != null && setComment(e.value)} value={comment} title="Remarque sur la Dépense" />
                </td>
              </tr>
              <tr></tr>
            </tbody>
          </table>
        </div>
      </DialogComponent>

    </>
  );
}
