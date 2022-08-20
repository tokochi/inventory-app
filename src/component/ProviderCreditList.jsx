import React, { useState, useEffect } from "react";
import { DialogComponent } from "@syncfusion/ej2-react-popups";
import { useStore, loadProviders } from "../contexts/Store";
import moment from "moment";



export default function ProviderCreditList({ header, id, svg, children, width, footer, content, onChange, close, fields, dataSource, ...rest }) {
  const providersData = () => useStore((state) => state.providers);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  useEffect(() => {
    close && setDropdownOpen(false);
  }, [close]);

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
        close={() => setDropdownOpen(false)}>
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
                      <div className="font-semibold text-center">Fournisseur</div>
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
                  </tr>
                </thead>
                <tbody>
                  {providersData().map((provider) => (
                    <tr className="text-center" key={provider._id}>
                      {provider.avance.map((avance, indx) => (
                        <>
                          <td className="text-left p-2">{"#" + avance?._id.slice(-6)}</td>
                          <td>{moment(provider?.date).format("DD/MM/YYYY")}</td>
                          <td>{provider?.name}</td>
                          <td>{avance?.credit && avance?.credit + ",00DA"}</td>
                          <td>{avance?.amount && avance?.amount + ",00DA"}</td>
                          <td>{avance?.amount && Math.max(avance?.credit - avance.amount, 0) + ",00DA"}</td>
                          <td>
                            {avance?.credit - avance.amount > 0 ? (
                              <p className="capitalize text-center rounded-3xl px-1 py-1 my-1 bg-rose-100 text-rose-500">Endetté</p>
                            ) : (
                              <p className="capitalize text-center rounded-3xl px-1 py-1 my-1 bg-emerald-100 text-emerald-600 ">Acquitté</p>
                            )}
                          </td>
                          <td>{avance?.paymentType}</td>
                        </>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </DialogComponent>
    </>
  );
}
