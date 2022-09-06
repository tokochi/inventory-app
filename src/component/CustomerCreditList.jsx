import { DialogComponent } from "@syncfusion/ej2-react-popups";
import moment from "moment";
import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { loadCustomers, useStore } from "../contexts/Store";
import deletePng2 from "./../data/icons/delete2.png";
const { ipcRenderer } = require("electron");


export default function CustomerCreditList({ header, id, svg, children, width, footer, content, onChange, close, fields, dataSource, ...rest }) {

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const avanceList = () => useStore((state) => state.customers).reduce((acc, cur) => acc.concat(cur.avance), []);
  function toCurrency(num) {
    let str = "0.00DA";
    if (num != null && !isNaN(num)) {
      str = num?.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + "DA";
      str = str.replace("DZD", "DA");
      str = str.replace(",", " ");
    }
    return str;
  }
  return (
    <>
      <button
        className=" btn p-1 bg-white border-slate-200 hover:border-slate-300 text-slate-500 hover:text-slate-600"
        onClick={(e) => {
          e.preventDefault();
          setDropdownOpen(!dropdownOpen);
        }}>
        <svg className="w-5 h-5 fill-current text-indigo-500 shrink-0" viewBox="0 0 24 24">
          <path d="M2 5L2 7L22 7L22 5L2 5 z M 2 11L2 13L22 13L22 11L2 11 z M 2 17L2 19L22 19L22 17L2 17 z" />
        </svg>
      </button>
      <DialogComponent
        id={id}
        allowDragging
        isModal
        header="Liste des Versements"
        visible={dropdownOpen}
        showCloseIcon={true}
        closeOnEscape
        width="900px"
        open={() => setDropdownOpen(true)}
        close={() => setDropdownOpen(false)}
        content={() => (
          <div className="bg-white shadow-lg rounded-sm border border-slate-200 relative">
            <div>
              <div className="overflow-x-auto">
                <table className="table-auto w-full divide-y divide-slate-200">
                  {/* Table header */}
                  <thead className="text-xs uppercase text-center text-slate-500 bg-slate-50 border-t border-slate-200">
                    <tr>
                      <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                        <div className="font-semibold text-center">ID</div>
                      </th>
                      <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                        <div className="font-semibold text-center">Date</div>
                      </th>
                      <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                        <div className="font-semibold text-center">Client</div>
                      </th>
                      <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                        <div className="font-semibold text-center">Ancien Credit</div>
                      </th>
                      <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                        <div className="font-semibold text-center">Versement</div>
                      </th>
                      <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                        <div className="font-semibold text-center">Reste à payer</div>
                      </th>
                      <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                        <div className="font-semibold text-center">Status</div>
                      </th>
                      <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                        <div className="font-semibold text-center">Payment type</div>
                      </th>
                      <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {avanceList().map((avance, indx) => (
                      <tr className="text-center" key={uuidv4()}>
                        <React.Fragment key={uuidv4()}>
                          <td key={uuidv4()} className="text-left p-2">
                            {"#" + avance?._id.slice(-6)}
                          </td>
                          <td key={uuidv4()}>{moment(avance?.date).format("DD/MM/YYYY")}</td>
                          <td key={uuidv4()}>{avance?.name}</td>
                          <td key={uuidv4()}>{avance?.credit && toCurrency(avance?.credit)}</td>
                          <td key={uuidv4()}>{avance?.amount && toCurrency(avance?.amount)}</td>
                          <td key={uuidv4()}>{avance?.amount && toCurrency(avance?.credit - avance.amount)}</td>
                          <td key={uuidv4()}>
                            {avance?.credit - avance.amount > 0 ? (
                              <p key={uuidv4()} className="capitalize text-center rounded-3xl px-1 py-1 my-1 bg-rose-100 text-rose-500">
                                Crédit
                              </p>
                            ) : (
                              <p key={uuidv4()} className="capitalize text-center rounded-3xl px-1 py-1 my-1 bg-emerald-100 text-emerald-600 ">
                                Acquitté
                              </p>
                            )}
                          </td>
                          <td key={uuidv4()}>{avance?.paymentType}</td>
                          <td key={uuidv4()}>
                            <button
                              id={avance?.customerId}
                              idd={avance?._id}
                              amount={avance?.amount}
                              className=" p-1.5"
                              onClick={(e) => {
                                setDropdownOpen(false);
                                const custID = e.target.parentElement.attributes[0].value;
                                const avanceID = e.target.parentElement.attributes[1].value;
                                const avanceAmount = parseInt(e.target.parentElement.attributes[2].value);
                                useStore.getState().customers.forEach((customer, index) => {
                                  if (customer._id === custID) {
                                    ipcRenderer.send("updateCustomer", {
                                      _id: custID,
                                      credit: parseInt(customer.credit) + avanceAmount,
                                      avance: customer.avance.filter((avance) => avance._id !== avanceID),
                                    });
                                  }
                                });
                                ipcRenderer.on("refreshGridCustomer:update", (e, res) => {
                                  loadCustomers();
                                  ipcRenderer.removeAllListeners("refreshGridCustomer:update");
                                });
                              }}>
                              <img src={deletePng2} width="25" />
                            </button>
                          </td>
                        </React.Fragment>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}></DialogComponent>
    </>
  );
}
