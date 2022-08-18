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
import { useStore, loadCustomers } from "../../contexts/Store";
import React, { useRef, useState, useEffect } from "react";
import CustomerFormTemplate from "../form/CustomerForm";
import Localization from "../Localization";
import Status from "./templates/CustomerStatus";
import { useReactToPrint } from "react-to-print";
import AvanceCustomer from "../AvanceCustomer";
import CustomerCreditList from "./../CustomerCreditList";
const { ipcRenderer } = require("electron");

// ******** Get Customers List  ********
loadCustomers();
Localization("Client");

export default function CustomersTable() {
  // ******** Column Templates  ********
  const customersData = () => useStore((state) => state.customers).filter((customer) => filterCustomer(customer));
  const customersGridStatus = (props) => <Status {...props} />;
  const customersFormTemplate = (props) => <CustomerFormTemplate {...props} />;
  const customersIdTemplate = (props) => <div>{"#" + props._id?.slice(-6)}</div>;

  // ******** Grid Table  ********
  const [active, setActive] = useState({ all: true, debt: false });
  const activeButtoon =
    "inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border border-transparent shadow-sm bg-indigo-500 text-white duration-150 ease-in-out";
  const normalButton =
    "inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border border-slate-200 hover:border-slate-300 shadow-sm bg-white text-slate-500 duration-150 ease-in-out";
  const toolbarOptions = ["Add", "Edit", "Delete", "Search", "Print", "ColumnChooser"];
  const editing = { allowDeleting: true, allowEditing: true, allowAdding: true, mode: "Dialog", showDeleteConfirmDialog: true, template: customersFormTemplate };
  let grid;
  const [showPrintDiv, setShowPrintDiv] = useState(true);
  const [close, setClose] = useState(false);
  const gridRef = useRef();
  useEffect(() => {
    setClose(false);
  }, [close]);
  function filterCustomer(customer) {
    if (active.all === true) {
      return customer === customer;
    }
    if (active.debt === true) {
      return customer.debt > 0;
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
          fileName: "List des Client.xlsx",
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
        ipcRenderer.send("addCustomer", args.data);
        ipcRenderer.on("refreshGridCustomer:add", (e, res) => {
          loadCustomers();
        });
        break;
      case args.requestType === "beginEdit":
        args.dialog.header = "Modifier un Client";
        break;
      case args.requestType === "save" && args.action === "edit":
        ipcRenderer.send("updateCustomer", args.data);
        ipcRenderer.on("refreshGridCustomer:update", (e, res) => {
          loadCustomers();
        });
        break;
      case args.requestType === "add":
        args.dialog.header = "Ajouter un Client";
        break;
      case args.requestType === "delete":
        ipcRenderer.on("refreshGridCustomer:delete", (e, res) => {
          loadCustomers();
        });
        break;
    }
  }
  function actionBegin(args) {
    if (args.requestType === "delete") {
      ipcRenderer.send("deleteCustomer", grid.getSelectedRecords()[0]);
    }
    if (args.requestType === "add") {
      useStore.setState((state) => ({
        customerForm: {},
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
              Tous <span className="ml-1 text-indigo-200">{useStore((state) => state.customers).length}</span>
            </button>
          </li>
          <li className="m-1">
            <button
              className={active.stock ? activeButtoon : normalButton}
              onClick={() => {
                setActive((state) => ({ all: false, debt: true }));
              }}>
              Crédit <span className="ml-1  text-rose-600">{useStore.getState().customers.filter((customer) => customer?.credit > 0).length}</span>
            </button>
          </li>
        </ul>
        <div className="flex gap-2">
          <AvanceCustomer close={close} />
          <CustomerCreditList close={close} />
        </div>
      </div>
      <div className="mx-2 mb-4">
        <GridComponent
          ref={(g) => (grid = g)}
          dataSource={customersData()}
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
            <ColumnDirective field="id" headerText="ID" textAlign="center" headerTextAlign="center" width="30" template={customersIdTemplate} />
            <ColumnDirective field="name" headerText="Nom" textAlign="center" headerTextAlign="center" width="100" />
            <ColumnDirective field="phone" headerText="Téléphone" textAlign="center" headerTextAlign="center" width="35" />
            <ColumnDirective field="address" headerText="adresse" textAlign="center" headerTextAlign="center" width="30" />
            <ColumnDirective field="email" headerText="Email" textAlign="center" headerTextAlign="center" width="40" visible={false} />
            <ColumnDirective field="ccp" headerText="CCP" textAlign="center" headerTextAlign="center" width="40" visible={false} />
            <ColumnDirective field="rip" headerText="RIB" textAlign="center" headerTextAlign="center" width="40" visible={false} />
            <ColumnDirective field="credit" headerText="Crédit" textAlign="center" headerTextAlign="center" width="40" format="c2" />
            <ColumnDirective field="comment" headerText="Commentaire" textAlign="center" headerTextAlign="center" visible={false} width="40" />
            <ColumnDirective field="status" headerText="Status" headerTextAlign="center" textAlign="center" template={customersGridStatus} width="30" />
          </ColumnsDirective>
          <Inject services={[Resize, Selection, Reorder, Search, Toolbar, Edit, ColumnChooser, Sort, Print, Filter, PdfExport]} />
        </GridComponent>
        <div ref={gridRef} className={`mx-2 mb-4 ${showPrintDiv && "hidden"} bg-slate-600 w-full`}></div>
      </div>
    </div>
  );
}
