import {
  GridComponent,
  ColumnsDirective,
  ColumnDirective,
  Reorder,
  Print,
  Selection,
  Resize,
  ColumnChooser,
  Search,
  Inject,
  Edit,
  Toolbar,
  PdfExport,
  Sort,
  Filter,
} from "@syncfusion/ej2-react-grids";
import { useStore, loadProviders } from "../../contexts/Store";
import React, { useRef, useState, useEffect } from "react";
import ProviderFormTemplate from "../form/ProviderForm";
import Localization from "../Localization";
import Status from "./templates/ProviderStatus";
import { useReactToPrint } from "react-to-print";
import AvanceProvider from "../AvanceProvider";
import ProviderCreditList from './../ProviderCreditList';
const { ipcRenderer } = require("electron");

// ******** Get Providers List  ********
loadProviders();
Localization("Fournisseur");

export default function ProvidersTable() {
  // ******** Column Templates  ********
  const providersData = () => useStore((state) => state.providers).filter((provider) => filterProvider(provider));
  const providersGridStatus = (props) => <Status {...props} />;
  const providersFormTemplate = (props) => <ProviderFormTemplate {...props}  />;
  const providersIdTemplate = (props) => <div>{"#" + props._id?.slice(-6)}</div>;

  // ******** Grid Table  ********
  const [active, setActive] = useState({ all: true, debt: false });
  const activeButtoon =
    "inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border border-transparent shadow-sm bg-indigo-500 text-white duration-150 ease-in-out";
  const normalButton =
    "inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border border-slate-200 hover:border-slate-300 shadow-sm bg-white text-slate-500 duration-150 ease-in-out";
  const toolbarOptions = ["Add", "Edit", "Delete", "Search", "Print", "ColumnChooser"];
  const editing = { allowDeleting: true, allowEditing: true, allowAdding: true, mode: "Dialog", showDeleteConfirmDialog: true, template: providersFormTemplate };
  let grid;
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
        let blob = new Blob([data], { type: "text/html" });
        let url = URL.createObjectURL(blob);
        ipcRenderer.send("previewComponent", url);
      }),
  });
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
        });
        break;
      case args.requestType === "beginEdit":
        args.dialog.header = "Modifier un Fournisseur";
        break;
      case args.requestType === "save" && args.action === "edit":
        ipcRenderer.send("updateProvider", args.data);
        ipcRenderer.on("refreshGridProvider:update", (e, res) => {
          loadProviders();
        });
        break;
      case args.requestType === "add":
        args.dialog.header = "Ajouter un Fournisseur";
        break;
      case args.requestType === "delete":
        ipcRenderer.on("refreshGridProvider:delete", (e, res) => {
          loadProviders();
        });
        break;
    }
  }
  function actionBegin(args) {
    if (args.requestType === "delete") {
      ipcRenderer.send("deleteProvider", grid.getSelectedRecords()[0]);
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
      <div className="mx-2 mb-4">
        <GridComponent
          ref={(g) => (grid = g)}
          dataSource={providersData()}
          enableHover={false}
          allowPdfExport
          height="500"
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
            <ColumnDirective field="credit" headerText="Crédit" textAlign="center" headerTextAlign="center" width="40" format="c2" />
            <ColumnDirective field="comment" headerText="Commentaire" textAlign="center" headerTextAlign="center" visible={false} width="40" />
            <ColumnDirective field="status" headerText="Status" headerTextAlign="center" textAlign="center" template={providersGridStatus} width="30" />
          </ColumnsDirective>
          <Inject services={[Resize, Selection, Reorder, Search, Toolbar, Edit, ColumnChooser, Sort, Print, Filter, PdfExport]} />
        </GridComponent>
        <div ref={gridRef} className={`mx-2 mb-4 ${showPrintDiv && "hidden"} bg-slate-600 w-full`}></div>
      </div>
    </div>
  );
}
