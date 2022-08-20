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
import { useStore, loadVendings } from "../../contexts/Store";
import React, { useRef, useState, useEffect } from "react";
import ProductFormTemplate from "../form/ProductForm";
import Localization from "../Localization";
import Status from "./templates/ProductsStatus";
import { useReactToPrint } from "react-to-print";
const { ipcRenderer } = require("electron");

// ******** Get Vending List  ********
loadVendings();
Localization("produits");

export default function VendingTable() {
  // ******** Column Templates  ********
  const vendingGridStatus = (props) => <Status {...props} />;
  const vendingFormTemplate = (props) => <ProductFormTemplate {...props} />;
  const vendingIdTemplate = (props) => <div>{"#" + props._id?.slice(-6)}</div>;

  // ******** Grid Table  ********
  const [active, setActive] = useState({ all: true, paid: false, unpaid: false, deposit: false });
  const activeButtoon =
    "inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border border-transparent shadow-sm bg-indigo-500 text-white duration-150 ease-in-out";
  const normalButton =
    "inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border border-slate-200 hover:border-slate-300 shadow-sm bg-white text-slate-500 duration-150 ease-in-out";
  
 const toolbarOptions = ["Add", "Edit", "Delete", "Search", "Print", "ColumnChooser"];
  const editing = { allowDeleting: true, allowEditing: true, allowAdding: true, mode: "Dialog", showDeleteConfirmDialog: true, template: vendingFormTemplate };
  let grid;
  const [showPrintDiv, setShowPrintDiv] = useState(true);
  const gridRef = useRef();
  const vendingData = () => useStore((state) => state.vendings).filter((vending) => filterProduct(vending));
  function filterProduct(vending) {
    if (active.all === true) {
      return vending === vending;
    }
    if (active.paid === true) {
      return vending?.amount > 0 && vending?.amount === vending?.deposit;
    }
    if (active.unpaid === true) {
      return vending?.amount > 0 && vending?.deposit===0;
    }
    if (active.deposit === true) {
      return vending?.amount > 0 && vending?.amount > vending?.deposit;
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
          fileName: "List des produits.xlsx",
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
        ipcRenderer.send("addProduct", args.data);
        ipcRenderer.on("refreshGridProduct:add", (e, res) => {
          loadVendings();
        });
        break;
      case args.requestType === "beginEdit":
        useStore.setState((state) => ({ vendingForm: { ...args.rowData } }));
        args.dialog.header = "Modifier une Vente";
        break;
      case args.requestType === "save" && args.action === "edit":
        ipcRenderer.send("updateProduct", args.data);
        ipcRenderer.on("refreshGridProduct:update", (e, res) => {
          loadVendings();
        });
        break;
      case args.requestType === "add":
        args.dialog.header = "Ajouter une Vente";
        break;
      case args.requestType === "delete":
        ipcRenderer.on("refreshGridProduct:delete", (e, res) => {
          loadVendings();
        });
        break;
    }
  }
  function actionBegin(args) {
    if (args.requestType === "delete") {
      ipcRenderer.send("deleteProduct", grid.getSelectedRecords()[0]);
    }
    if (args.requestType === "add") {
      useStore.setState((state) => ({
        vendingForm: {},
      }));
    }
    if (args.requestType === "beginEdit") {
    }
  }
  return (
    <div className="p-2">
      <div className="mb-4 mx-4 flex justify-between">
        <ul className="flex flex-wrap -m-1">
          <li className="m-1">
            <button
              className={active.all ? activeButtoon : normalButton}
              onClick={() => {
                setActive((state) => ({ all: true, paid: false, unpaid: false, deposit: false }));
              }}>
              Tous <span className="ml-1 text-indigo-200">{useStore((state) => state.vendings).length}</span>
            </button>
          </li>
          <li className="m-1">
            <button
              className={active.paid ? activeButtoon : normalButton}
              onClick={() => {
                setActive((state) => ({ all: false, paid: true, unpaid: false, deposit: false }));
              }}>
              Payé <span className="ml-1  text-emerald-600">{useStore.getState().vendings.filter((vending) => vending?.quantity > 0 && vending?.quantity > (vending.qtyAlert ?? 1)).length}</span>
            </button>
          </li>
          <li className="m-1">
            <button
              className={active.deposit ? activeButtoon : normalButton}
              onClick={() => {
                setActive((state) => ({ all: false, paid: false, unpaid: false, deposit: true }));
              }}>
              Vérsement <span className="ml-1 text-amber-600">{useStore.getState().vendings.filter((vending) => vending?.quantity > 0 && vending?.quantity <= vending?.qtyAlert).length}</span>
            </button>
          </li>
          <li className="m-1">
            <button
              className={active.unpaid ? activeButtoon : normalButton}
              onClick={() => {
                setActive((state) => ({ all: false, paid: false, unpaid: true, deposit: false }));
              }}>
              Non Payé <span className="ml-1 text-rose-500">{useStore.getState().vendings.filter((vending) => vending?.quantity === 0).length}</span>
            </button>
          </li>
        </ul>
      </div>
      <div className="mx-2 mb-4">
        <GridComponent
          ref={(g) => (grid = g)}
          dataSource={vendingData()}
          enableHover={false}
          allowPdfExport
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
            <ColumnDirective field="id" headerText="ID" textAlign="center" headerTextAlign="center" width="30" template={vendingIdTemplate} />
            <ColumnDirective field="time" headerText="Date" textAlign="center" headerTextAlign="center" width="80" format="dddd MMMM y - HH:mm" />
            <ColumnDirective field="customer" headerText="Client" textAlign="center" headerTextAlign="center" width="40" />
            <ColumnDirective field="amount" headerText="Montant" textAlign="center" headerTextAlign="center" width="40" format="c2" />
            <ColumnDirective field="rebate" headerText="Remise" textAlign="center" headerTextAlign="center" width="40" format="c2" />
            <ColumnDirective field="deposit" headerText="Versement" textAlign="center" headerTextAlign="center" width="40" format="c2" />
            <ColumnDirective field="Total" headerText="Total" textAlign="center" headerTextAlign="center" width="40" format="c2" />
            <ColumnDirective field="comment" headerText="Commentaire" textAlign="center" headerTextAlign="center" visible={false} width="40" />
            <ColumnDirective field="status" headerText="Status" headerTextAlign="center" textAlign="center" template={vendingGridStatus} width="30" />
          </ColumnsDirective>
          <Inject services={[Resize, Selection, Reorder, Search, Toolbar, Edit, ColumnChooser, Sort, Print, Filter, PdfExport]} />
        </GridComponent>
        <div ref={gridRef} className={`mx-2 mb-4 ${showPrintDiv && "hidden"} bg-slate-600 w-full`}></div>
      </div>
    </div>
  );
}
