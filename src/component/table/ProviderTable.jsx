import {
  ColumnChooser,
  ColumnDirective,
  ColumnsDirective,
  Edit,
  Filter,
  GridComponent,
  Inject,
  PdfExport,
  Print,
  Reorder,
  Resize,
  Search,
  Selection,
  Sort,
  Toolbar,
} from "@syncfusion/ej2-react-grids";
import React, { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { loadProviders, useStore } from "../../contexts/Store";
import AvanceProvider from "../AvanceProvider";
import ProviderFormTemplate from "../form/ProviderForm";
import Localization from "../Localization";
import Toast from "../Toast";
import ProviderCreditList from "./../ProviderCreditList";
import Status from "./templates/ProviderStatus";
const { ipcRenderer } = require("electron");

// ******** Get Providers List  ********

Localization("Fournisseur");

export default function ProvidersTable() {
  // ******** Column Templates  ********
  const [active, setActive] = useState({ all: true, debt: false });
  const providersData = useStore((state) => state.providers).filter((provider) => filterProvider(provider));
  const providersGridStatus = (props) => <Status {...props} />;
  const providersFormTemplate = (props) => <ProviderFormTemplate {...props} />;
  const providersIdTemplate = (props) => <div>{"#" + props._id?.slice(-6)}</div>;

  // ******** Grid Table  ********
  const activeButtoon =
    "inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border border-transparent shadow-sm bg-indigo-500 text-white duration-150 ease-in-out";
  const normalButton =
    "inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border border-slate-200 hover:border-slate-300 shadow-sm bg-white text-slate-500 duration-150 ease-in-out";
  const toolbarOptions = ["Add", "Edit", "Delete", "Search", "Print", "ColumnChooser"];
  const editing = { allowDeleting: true, allowEditing: true, allowAdding: true, mode: "Dialog", showDeleteConfirmDialog: true, template: providersFormTemplate };
  let grid;
  const [toastRemove, setToastRemove] = useState(false);
  const [toastAdd, setToastAdd] = useState(false);
  const [toastEdit, setToastEdit] = useState(false);
  const [showPrintDiv, setShowPrintDiv] = useState(true);
  const [close, setClose] = useState(false);
  const gridRef = useRef();
  useEffect(() => {
    setClose(false);
  }, [close]);
  function filterProvider(provider) {
    if (active.all === true) {
      return provider === provider;
    }
    if (active.debt === true) {
      return provider.debt > 0;
    }
  }
  const reactToPrint = useReactToPrint({
    content: () => gridRef.current,
    print: (target) =>
      new Promise(() => {
        let data = target.contentWindow.document.documentElement.outerHTML;
        let blob = new Blob([data], { type: "text/html; charset=utf-8" });
        let url = URL.createObjectURL(blob);
        ipcRenderer.send("previewComponent", url);
      }),
  });
  useEffect(() => {
    if (toastAdd) {
      setTimeout(() => setToastAdd(false), 4000);
    }
    if (toastRemove) {
      setTimeout(() => setToastRemove(false), 4000);
    }
    if (toastEdit) {
      setTimeout(() => setToastEdit(false), 4000);
    }
  }, [toastAdd, toastRemove, toastEdit]);
  useEffect(() => {
    if (!showPrintDiv) {
      reactToPrint();
      setShowPrintDiv(true);
    }
  }, [showPrintDiv]);
  function toolbarClick(args) {
    switch (true) {
      case args.item.id.includes("print"):
        setShowPrintDiv(false);
        break;
      case args.item.id.includes("excelexport"):
        grid.excelExport({
          fileName: "List des Fournisseur.xlsx",
        });
        break;
      case args.item.id.includes("pdfexport"):
        grid.pdfExport();
        break;
    }
  }
  function actionComplete(args) {
    switch (true) {
      case args.requestType === "save" && args.action === "add":
        ipcRenderer.send("addProvider", args.data);
        ipcRenderer.on("refreshGridProvider:add", (e, res) => {
          loadProviders();
          ipcRenderer.removeAllListeners("refreshGridProvider:add");
        });
        break;
      case args.requestType === "beginEdit":
        args.dialog.header = "Modifier un Fournisseur";
        break;
      case args.requestType === "save" && args.action === "edit":
        ipcRenderer.send("updateProvider", args.data);
        ipcRenderer.on("refreshGridProvider:update", (e, res) => {
          loadProviders();
          ipcRenderer.removeAllListeners("refreshGridProvider:update");
        });
        break;
      case args.requestType === "add":
        args.dialog.header = "Ajouter un Fournisseur";
        break;
      case args.requestType === "delete":
        ipcRenderer.send("deleteProvider", args.data[0]);
        ipcRenderer.on("refreshGridProvider:delete", (e, res) => {
          loadProviders();
          ipcRenderer.removeAllListeners("refreshGridProvider:delete");
        });
        break;
    }
  }
  function toCurrency(num) {
    let str = "0.00DA";
    if (num != null && !isNaN(num)) {
      str = num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + "DA";
      str = str.replace("DZD", "DA");
      str = str.replace(",", " ");
    }
    return str;
  }
  function actionBegin(args) {
    if (args.requestType === "delete") {
    }
    if (args.requestType === "add") {
      useStore.setState((state) => ({
        providerForm: {},
      }));
    }
    if (args.requestType === "beginEdit") {
    }
  }
  return (
    <div className="p-2 ">
      <div className="mb-4 mx-4 flex justify-between">
        <ul className="flex flex-wrap -m-1">
          <li className="m-1">
            <button
              className={active.all ? activeButtoon : normalButton}
              onClick={() => {
                setActive((state) => ({ all: true, debt: false }));
              }}>
              Tous <span className="ml-1 text-indigo-200">{useStore((state) => state.providers).length}</span>
            </button>
          </li>
          <li className="m-1">
            <button
              className={active.stock ? activeButtoon : normalButton}
              onClick={() => {
                setActive((state) => ({ all: false, debt: true }));
              }}>
              Endetté <span className="ml-1  text-rose-600">{useStore.getState().providers.filter((provider) => provider?.credit > 0).length}</span>
            </button>
          </li>
        </ul>
        <div className="flex gap-2">
          <AvanceProvider close={close} />
          <ProviderCreditList close={close} />
        </div>
      </div>
      <Toast type="success" open={toastAdd} setOpen={setToastAdd}>
        Nouveau Fournisseur Ajouter au Stock avec succès.
      </Toast>
      <Toast type="success" open={toastEdit} setOpen={setToastEdit}>
        Fournisseur Modifier avec succès.
      </Toast>
      <Toast type="error" open={toastRemove} setOpen={setToastRemove}>
        Fournisseur Supprimer avec succès.
      </Toast>
      <div className="mx-2 mb-4">
        <GridComponent
          ref={(g) => (grid = g)}
          dataSource={providersData}
          enableHover={false}
          allowPdfExport
          height="450"
          allowPrint
          allowResizing
          showColumnChooser
          locale="fr-BE"
          // enablePersistence
          toolbar={toolbarOptions}
          actionBegin={actionBegin}
          toolbarClick={toolbarClick}
          editSettings={editing}
          allowReordering
          actionComplete={(props) => actionComplete(props)}
          allowSorting>
          <ColumnsDirective>
            <ColumnDirective field="id" headerText="ID" textAlign="center" headerTextAlign="center" width="30" template={providersIdTemplate} />
            <ColumnDirective field="name" headerText="Nom" textAlign="center" headerTextAlign="center" width="100" />
            <ColumnDirective field="phone" headerText="Téléphone" textAlign="center" headerTextAlign="center" width="35" />
            <ColumnDirective field="address" headerText="adresse" textAlign="center" headerTextAlign="center" width="30" />
            <ColumnDirective field="email" headerText="Email" textAlign="center" headerTextAlign="center" width="40" />
            <ColumnDirective field="ccp" headerText="CCP" textAlign="center" headerTextAlign="center" width="40" visible={false} />
            <ColumnDirective field="rip" headerText="RIB" textAlign="center" headerTextAlign="center" width="40" visible={false} />
            <ColumnDirective field="credit" headerText="Crédit" textAlign="center" headerTextAlign="center" width="40" format="C2" />
            <ColumnDirective field="comment" headerText="Commentaire" textAlign="center" headerTextAlign="center" visible={false} width="40" />
            <ColumnDirective field="status" headerText="Status" headerTextAlign="center" textAlign="center" template={providersGridStatus} width="30" />
          </ColumnsDirective>
          <Inject services={[Resize, Selection, Reorder, Search, Toolbar, Edit, ColumnChooser, Sort, Print, Filter, PdfExport]} />
        </GridComponent>
        <div ref={gridRef} className={`mx-2 mb-4 ${showPrintDiv && "hidden"} h-[297mm] w-[210mm] `}>
          <div className="bg-white shadow-lg rounded-sm border border-slate-200 relative">
            <div>
              <div className="overflow-x-auto">
                <div className="flex gap-2 p-2">
                  <span className="text-lg mr-2">Liste Fournisseur:</span>
                  <button className={normalButton}>
                    Nombre Fournisseur:
                    <span className="ml-1  text-emerald-600">{providersData.length}</span>
                  </button>
                  <button className={normalButton}>
                    Déttes Fournisseur:
                    <span className="ml-1  text-emerald-600">{toCurrency(providersData.reduce((acc, cur) => acc + cur.credit, 0))}</span>
                  </button>
                  {/* <button className={normalButton}>
                    Capital Detail:
                    <span className="ml-1  text-emerald-600">{toCurrency(providersData.reduce((prevProduct, currProduct) => prevProduct + currProduct.quantity * currProduct.sellPrice, 0))}</span>
                  </button> */}
                </div>
                <table className="table-auto w-full divide-y divide-slate-200 ">
                  <thead className="text-xs uppercase text-center text-slate-500 bg-slate-50 border-t border-slate-200">
                    <tr>
                      <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                        <div className="font-semibold text-center">ID</div>
                      </th>
                      <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                        <div className="font-semibold text-center">Fournisseur</div>
                      </th>
                      <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                        <div className="font-semibold text-center">Tél.</div>
                      </th>
                      <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                        <div className="font-semibold text-center">Address</div>
                      </th>
                      <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                        <div className="font-semibold text-center">Crédit</div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {providersData.map((provider) => (
                      <tr className="text-center " key={provider._id}>
                        <td className=" p-2">{"#" + provider?._id?.slice(-6)}</td>
                        <td>{provider?.name}</td>
                        <td>{provider?.phone?.toString()?.match(/.{2}/g)?.join(" ")}</td>
                        <td>{provider?.address}</td>
                        <td>{toCurrency(provider?.credit)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
