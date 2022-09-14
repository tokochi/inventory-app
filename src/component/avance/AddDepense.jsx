import { DateTimePickerComponent } from "@syncfusion/ej2-react-calendars";
import { DialogComponent } from "@syncfusion/ej2-react-popups";
import React, { useState } from "react";
import { loadDepenses, useStore } from "../../contexts/Store";
import TextBox from "../button/TextBox";
import Store from "electron-store";
const { ipcRenderer } = require("electron");

export default function AddDepense({ header, id, svg, children, width, footer, content, onChange, close, fields, dataSource, ...rest }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [amount, setAmount] = useState(0);
  const [comment, setComment] = useState("");
  const [requiredName, setRequiredName] = useState(false);
  const [requiredPrice, setRequiredPrice] = useState(false);
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date());
  const [slectedDepense, setSlectedDepense] = useState("");
const store = new Store();
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
                    switch (true) {
                      case description === "":
                        setRequiredName(true);
                        break;
                      case amount === 0:
                        setRequiredPrice(true);
                        break;
                      default:
                        amount > 0 && ipcRenderer.send("addDepense", { amount, comment, description, date, type: slectedDepense });
                        setAmount(0);
                        setComment("");
                        setDescription("");
                        setSlectedDepense("");
                        ipcRenderer.on("refreshDepense:add", (e, res) => {
                          store?.set("activity", [
                            ...store?.get("activity"),
                            {
                              date: new Date(),
                              page: "Dépense",
                              action: "ajouter",
                              title: "Nouvelle Dépense Ajouter",
                              item: { name: "Dépense", amount, description, type: slectedDepense },
                              user: store?.get("user")?.userName,
                              role: store?.get("user")?.isAdmin ? "Administrateur" : "Employée",
                            },
                          ]);
                          setDropdownOpen(false);
                          useStore.setState({ toast: { show: true, title: "Dépense Ajouter Avec Succés", type: "success" } });
                          setTimeout(() => {
                            useStore.setState({ toast: { show: false } });
                          }, 2000);
                          loadDepenses();
                          ipcRenderer.removeAllListeners("refreshDepense:add");
                        });
                        break;
                    }
                  }}>
                  Terminer
                </button>
              </li>
              <li>
                <button
                  className="btn-xs bg-white border-slate-200 hover:border-slate-300 text-slate-500 hover:text-slate-600"
                  onClick={(e) => {
                    setAmount(0);
                    setComment("");
                    setDescription("");
                    setSlectedDepense("");
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
                    dataSource={["Facture élec/Gaz", "Salaire Employée", "Avance de paie", "Frais Location", "Maintenance", "Sérvices", "Frais Transport", "Autre Frais"]}
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
                  <TextBox
                    type="text"
                    id="paymentType"
                    width="full"
                    value={description}
                    onChange={(e) => {
                      e.value != null && setDescription(e.value);
                      setRequiredName(false);
                    }}
                    title="Déscription"
                  />
                  {requiredName && <span className="m-1 text-xs text-red-400">ce champ est obligatoire</span>}
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
                      setRequiredPrice(false);
                    }}
                    step={100}
                    min={0}
                    title="Montant Dépense"
                  />
                  {requiredPrice && <span className="m-1 text-xs text-red-400">ce champ est obligatoire</span>}
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
