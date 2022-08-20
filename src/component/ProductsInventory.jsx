import React, { useState, useEffect } from "react";
import { DialogComponent } from "@syncfusion/ej2-react-popups";
import { useStore } from "../contexts/Store";

import Status from "./table/templates/ProductsStatus";

export default function ProductsInventory({ header, id, svg, children, width, footer, content, onChange, close, fields, dataSource, ...rest }) {
  const productsData = () => useStore((state) => state.products);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const normalButton =
    "inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border border-slate-200 hover:border-slate-300 shadow-sm bg-white text-slate-500 duration-150 ease-in-out";

  useEffect(() => {
    close && setDropdownOpen(false);
  }, [close]);

  return (
    <>
      <button
        onClick={(e) => {
          e.preventDefault();
          setDropdownOpen(!dropdownOpen);
        }}
        className="btn bg-indigo-500 hover:bg-indigo-600 text-white">
        <svg className="w-4 h-4 fill-current opacity-50 shrink-0" viewBox="0 0 24 24">
          <path d="M21,3h-6.184C14.403,1.837,13.304,1,12,1S9.597,1.837,9.184,3H3v18h18V3z M12,3c0.552,0,1,0.448,1,1c0,0.552-0.448,1-1,1 s-1-0.448-1-1C11,3.448,11.448,3,12,3z M11,16.414l-4.185-4.185l1.414-1.414L11,13.586l5.792-5.792l1.414,1.414L11,16.414z" />
        </svg>
        <span className="hidden xs:block ml-2">Inventaire</span>
      </button>
      <DialogComponent
        id={id}
        isModal
        allowDragging
        header="Liste Inventaire"
        visible={dropdownOpen}
        showCloseIcon={true}
        closeOnEscape
        width="900px"
        open={() => setDropdownOpen(true)}
        close={() => setDropdownOpen(false)}>
        <div className="bg-white shadow-lg rounded-sm border border-slate-200 relative">
          <div>
            <div className="overflow-x-auto">
              <div className="flex gap-2 p-2">
                <button className={normalButton}>
                  Total Produits:
                  <span className="ml-1  text-emerald-600">{productsData().length}</span>
                </button>
                <button className={normalButton}>
                  Capital Achat:
                  <span className="ml-1  text-emerald-600">{productsData().reduce((prevProduct, currProduct) => prevProduct + currProduct.quantity * currProduct.buyPrice, 0) + ",00DA"}</span>
                </button>
                <button className={normalButton}>
                  Capital Détail:
                  <span className="ml-1  text-emerald-600">{productsData().reduce((prevProduct, currProduct) => prevProduct + currProduct.quantity * currProduct.sellPrice, 0) + ",00DA"}</span>
                </button>
                <button className={normalButton}>
                  Capital Gros:
                  <span className="ml-1  text-emerald-600">{productsData().reduce((prevProduct, currProduct) => prevProduct + currProduct.quantity * currProduct.sellPriceGros, 0) + ",00DA"}</span>
                </button>
              </div>
              <table className="table-auto w-full divide-y divide-slate-200 ">
                <thead className="text-xs uppercase text-center text-slate-500 bg-slate-50 border-t border-slate-200">
                  <tr>
                    <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                      <div className="font-semibold text-center">ID</div>
                    </th>
                    <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                      <div className="font-semibold text-center">Désignation</div>
                    </th>
                    <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                      <div className="font-semibold text-center">Quantité</div>
                    </th>
                    <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                      <div className="font-semibold text-center">Prix Achat</div>
                    </th>
                    <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                      <div className="font-semibold text-center">Status</div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {productsData().map((product) => (
                    <tr className="text-center " key={product._id}>
                      <td className=" p-2">{"#" + product?._id.slice(-6)}</td>
                      <td>{product?.name}</td>
                      <td>{product?.quantity}</td>
                      <td>{product?.buyPrice && product?.buyPrice + ",00DA"}</td>
                      <td>
                        <Status {...product} />
                      </td>
                      <td>{product?.paymentType}</td>
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
