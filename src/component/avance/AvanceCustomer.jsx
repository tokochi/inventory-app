import { DateTimePickerComponent } from "@syncfusion/ej2-react-calendars";
import { DropDownListComponent } from "@syncfusion/ej2-react-dropdowns";
import { DialogComponent } from "@syncfusion/ej2-react-popups";
import React, { useState } from "react";
import Store from "electron-store";
import { loadCustomers, useStore } from "../../contexts/Store";
import TextBox from "../button/TextBox";
const { ipcRenderer } = require("electron");

export default function AvanceCustomer({ header, id, svg, children, width, footer, content, onChange, close, fields, dataSource, ...rest }) {
  const customersData = useStore((state) => state.customers);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [amount, setAmount] = useState(0);
  const [paymentType, setPaymentType] = useState("");
  const [requiredName, setRequiredName] = useState(false);
  const [requiredPrice, setRequiredPrice] = useState(false);
  const [date, setDate] = useState(new Date());
  const [slectedCustomer, setSlectedCustomer] = useState("");
  const store = new Store();
 const theme = useStore((state) => state.theme);
  return (
    <>
      <button
        onClick={(e) => {
          e.preventDefault();
          setDropdownOpen(!dropdownOpen);
        }}
        className={`btn ${theme.button} hover:opacity-80 text-white`}>
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
            <ul className="flex items-center justify-end gap-6">
              <li>
                <button
                  className={`btn ${theme.button} hover:opacity-80 text-white`}
                  onClick={() => {
                    switch (true) {
                      case slectedCustomer === "":
                        setRequiredName(true);
                        break;
                      case amount === 0:
                        setRequiredPrice(true);
                        break;
                      default:
                        amount > 0 &&
                          ipcRenderer.send("updateCustomer", {
                            credit: parseInt(slectedCustomer.credit) - parseInt(amount),
                            _id: slectedCustomer._id,
                            avance: [...slectedCustomer.avance, { credit: slectedCustomer.credit, date, amount, paymentType, name: slectedCustomer.name, customerId: slectedCustomer._id }],
                          });
                        setAmount(0);
                        setSlectedCustomer("");
                        setPaymentType("");
                        ipcRenderer.on("refreshGridCustomer:update", (e, res) => {
                          ipcRenderer.removeAllListeners("refreshGridCustomer:update");
                          store?.set("activity", [
                            ...store?.get("activity"),
                            {
                              date: new Date(),
                              page: "Avance Client",
                              action: "ajouter",
                              title: "Nouvelle Avance Client Ajouter",
                              item: { name: slectedCustomer.name, type: "Avance", amount: parseInt(amount), credit: parseInt(slectedCustomer.credit) - parseInt(amount) },
                              user: store?.get("user")?.userName,
                              role: store?.get("user")?.isAdmin ? "Administrateur" : "Employée",
                            },
                          ]);
                          useStore.setState({ toast: { show: true, title: "Avance Ajouter Avec Succés", type: "success" } });
                          setTimeout(() => {
                            useStore.setState({ toast: { show: false } });
                          }, 2000);
                          loadCustomers();
                          setDropdownOpen(false);
                          // window.location.reload();
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
                    setSlectedCustomer("");
                    setPaymentType("");
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
                <td className="p-4 w-[220px] text-sm font-medium">Choisir Client:</td>
                <td className="w-[320px]">
                  <div className="border-slate-200 border w-[262px] rounded-l hover:border-slate-300 focus:border-indigo-300 shadow-sm">
                    <DropDownListComponent
                      //ref={(g) => (dropDown = g)}
                      type="dropdown"
                      id="customer"
                      width="full"
                      value={slectedCustomer}
                      change={(e) => {
                        e.itemData != null && setSlectedCustomer(e.itemData);
                        setRequiredName(false);
                      }}
                      dataSource={customersData}
                      fields={{ value: "_id", text: "name" }}
                      popupHeight="200px"
                      placeholder="Choisir le Client"
                    />
                  </div>
                  {requiredName && <span className="m-1 text-xs text-red-400">ce champ est obligatoire</span>}
                </td>
              </tr>
              <tr>
                <td className="p-4 w-[220px] text-sm font-medium">Date Réglement:</td>

                <td className="w-[320px]">
                  <div className="border-slate-200 border w-[262px]  rounded-l hover:border-slate-300 focus:border-indigo-300 shadow-sm">
                    <DateTimePickerComponent
                      id="date"
                      name="date"
                      width="260"
                      value={date}
                      onChange={(e) => setDate(e.value)}
                      placeholder="Date de paiment"
                      format="dddd MMMM y - HH:mm"
                      floatLabelType="Never"></DateTimePickerComponent>
                  </div>
                </td>
              </tr>
              <tr>
                <td className="p-4 w-[220px] text-sm font-medium">Mode de Paiement:</td>
                <td className="w-[320px]">
                  <TextBox
                    type="dropdown"
                    id="paymentType"
                    width="w-[262px]"
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
                    value={slectedCustomer.credit}
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
                    max={slectedCustomer.credit}
                    onChange={(e) => {
                      e.value != null && setAmount(e.value);
                      setRequiredPrice(false);
                    }}
                    step={100}
                    min={0}
                    title="Montant Avance"
                  />
                  {requiredPrice && <span className="m-1 text-xs text-red-400">ce champ est obligatoire</span>}
                </td>
              </tr>
              <tr>
                <td className={`p-4 w-[220px] text-sm font-medium`}>Crédits restant:</td>
                <td className={`w-[320px] select-none ${slectedCustomer.credit === amount ? "text-emerald-500" : "text-amber-500"}`}>
                  <TextBox type="number" enabled={false} format="N2" label="DA" id="creditLeft" width="w-[200px]" step={100} min={0} value={slectedCustomer.credit - amount} title="Crédits restant" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </DialogComponent>
    </>
  );
}
