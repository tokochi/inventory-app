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
  Toolbar
} from "@syncfusion/ej2-react-grids";
import Store from "electron-store";
import React, { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { loadCustomers, useStore } from "../../contexts/Store";
import AvanceCustomer from "../avance/AvanceCustomer";
import CustomerFormTemplate from "../form/CustomerForm";
import CustomerCreditList from "../list/CustomerCreditList";
import Localization from "../Localization";
import Status from "./templates/CustomerStatus";
const { ipcRenderer } = require("electron");
// ******** Get Customers List  ********
Localization("Client");
export default function CustomersTable() {
  // ******** Column Templates  ********
  const theme = useStore((state) => state.theme);
  const [active, setActive] = useState({ all: true, debt: false });
  const customersData = useStore((state) => state.customers).filter((customer) => filterCustomer(customer));
  const customersGridStatus = (props) => <Status {...props} />;
  const customersFormTemplate = (props) => <CustomerFormTemplate {...props} />;
  const customersIdTemplate = (props) => <div>{"#" + props._id?.slice(-6)}</div>;

  // ******** Grid Table  ********
  const activeButtoon = `inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border border-transparent shadow-sm ${theme.button} text-white duration-150 ease-in-out`;
   const normalButton = `inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border border-slate-200 hover:border-slate-300 shadow-sm ${theme.nav} ${theme.text} duration-150 ease-in-out`;
 const toolbarOptions = ["Add", "Edit", "Delete", "Search", "Print", "ColumnChooser"];
  const editing = { allowDeleting: true, allowEditing: true, allowAdding: true, mode: "Dialog", showDeleteConfirmDialog: true, template: customersFormTemplate };
  let grid;
  const store = new Store();
  const [showPrintDiv, setShowPrintDiv] = useState(true);
  const totalCredit = useStore((state) => state.customers).reduce((acc, cur) => acc + cur.credit, 0);
  const gridRef = useRef();
  const textValidation = { required: [(args) => (args["value"] == "" ? false : true), "ce champ est obligatoire"] };
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
        let blob = new Blob([data], { type: "text/html; charset=utf-8" });
        let url = URL.createObjectURL(blob);
        ipcRenderer.send("previewComponent2", url);
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
        break;
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
  useEffect(() => {
    useStore.setState((state) => ({ gridProduct: grid }));
  }, [grid]);
  function actionComplete(args) {
    switch (true) {
      case args.requestType === "save" && args.action === "add":
        ipcRenderer.send("addCustomer", args.data);
        ipcRenderer.on("refreshGridCustomer:add", (e, res) => {
          store?.set("activity", [
            ...store?.get("activity"),
            {
              date: new Date(),
              page: "Client",
              action: "ajouter",
              title: "Nouveau Client Ajouter",
              item: args?.data,
              user: store?.get("user")?.userName,
              role: store?.get("user")?.isAdmin ? "Administrateur" : "Employ??e",
            },
          ]);
          useStore.setState({ toast: { show: true, title: "Client Ajouter Avec Succ??s", type: "success" } });
          setTimeout(() => {
            useStore.setState({ toast: { show: false } });
          }, 2000);
          loadCustomers();
          ipcRenderer.removeAllListeners("refreshGridCustomer:add");
        });
        break;
      case args.requestType === "beginEdit":
        args.dialog.header = "Modifier un Client";
        break;
      case args.requestType === "save" && args.action === "edit":
        ipcRenderer.send("updateCustomer", args.data);
        ipcRenderer.on("refreshGridCustomer:update", (e, res) => {
          store?.set("activity", [
            ...store?.get("activity"),
            {
              date: new Date(),
              page: "Client",
              action: "modifier",
              title: "Client Modifier",
              item: args?.data,
              user: store?.get("user")?.userName,
              role: store?.get("user")?.isAdmin ? "Administrateur" : "Employ??e",
            },
          ]);
          useStore.setState({ toast: { show: true, title: "Client Modifier Avec Succ??s", type: "success" } });
          setTimeout(() => {
            useStore.setState({ toast: { show: false } });
          }, 2000);
          loadCustomers();
          ipcRenderer.removeAllListeners("refreshGridCustomer:update");
        });
        break;
      case args.requestType === "add":
        args.dialog.header = "Ajouter un Client";
        break;
      case args.requestType === "delete":
        ipcRenderer.send("deleteCustomer", args.data[0]);
        ipcRenderer.on("refreshGridCustomer:delete", (e, res) => {
          store?.set("activity", [
            ...store?.get("activity"),
            {
              date: new Date(),
              page: "Client",
              action: "supprimer",
              title: "Client Supprimer",
              item: args?.data[0],
              user: store?.get("user")?.userName,
              role: store?.get("user")?.isAdmin ? "Administrateur" : "Employ??e",
            },
          ]);
          useStore.setState({ toast: { show: true, title: "Client Supprimer Du Stock", type: "error" } });
          setTimeout(() => {
            useStore.setState({ toast: { show: false } });
          }, 2000);
          loadCustomers();
          ipcRenderer.removeAllListeners("refreshGridCustomer:delete");
        });
        break;
    }
  }
  const toCurrency = useStore((state) => state.toCurrency);
  function actionBegin(args) {
    if (args.requestType === "delete") {
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
    <div className="p-2 h-[calc(100vh_-_200px)]">
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
              className={active.debt ? activeButtoon : normalButton}
              onClick={() => {
                setActive((state) => ({ all: false, debt: true }));
              }}>
              Cr??dit <span className="ml-1  text-rose-600">{useStore.getState().customers.filter((customer) => customer?.credit > 0).length}</span>
            </button>
          </li>
        </ul>
        <div className={normalButton}>
          Total Cr??dits Clients:<span className="text-rose-500 ml-2">{toCurrency(totalCredit)}</span>
        </div>
        <div className="flex gap-2">
          <AvanceCustomer />
          <CustomerCreditList />
        </div>
      </div>

      <div className="mx-2 h-[calc(100vh_-_200px)]">
        <GridComponent
          ref={(g) => (grid = g)}
          dataSource={customersData}
          enableHover={false}
          height="100%"
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
            <ColumnDirective field="name" validationRules={textValidation} headerText="Nom" textAlign="center" headerTextAlign="center" width="100" />
            <ColumnDirective field="phone" headerText="T??l??phone" textAlign="center" headerTextAlign="center" width="35" />
            <ColumnDirective field="address" headerText="adresse" textAlign="center" headerTextAlign="center" width="30" />
            <ColumnDirective field="email" headerText="Email" textAlign="center" headerTextAlign="center" width="40" visible={false} />
            <ColumnDirective field="ccp" headerText="CCP" textAlign="center" headerTextAlign="center" width="40" visible={false} />
            <ColumnDirective field="rip" headerText="RIB" textAlign="center" headerTextAlign="center" width="40" visible={false} />
            <ColumnDirective field="credit" headerText="Cr??dit" textAlign="center" headerTextAlign="center" width="40" format="c2" />
            <ColumnDirective field="comment" headerText="Commentaire" textAlign="center" headerTextAlign="center" visible={false} width="40" />
            <ColumnDirective field="status" headerText="Status" headerTextAlign="center" textAlign="center" template={customersGridStatus} width="30" />
          </ColumnsDirective>
          <Inject services={[Resize, Selection, Reorder, Search, Toolbar, Edit, ColumnChooser, Sort, Print, Filter, PdfExport]} />
        </GridComponent>
        <div ref={gridRef} className={` ${showPrintDiv && "hidden"} h-[297mm] w-[210mm] `}>
          <div className="bg-white shadow-lg rounded-sm border border-slate-200 relative">
            <div>
              <div className="overflow-x-auto">
                <div className="flex gap-2 p-2">
                  <span className="text-lg mr-2">Liste Clients:</span>
                  <button className={`inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border border-slate-200 hover:border-slate-300 shadow-sm bg-white text-slate-500 duration-150 ease-in-out`}>
                    Nombre Clients:
                    <span className="ml-1  text-emerald-600">{customersData?.length}</span>
                  </button>
                  <button className={`inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border border-slate-200 hover:border-slate-300 shadow-sm bg-white text-slate-500 duration-150 ease-in-out`}>
                    Cr??dits Clients:
                    <span className="ml-1  text-emerald-600">{toCurrency(customersData.reduce((acc, cur) => acc + cur.credit, 0))}</span>
                  </button>
                </div>
                <table className="table-auto w-full  divide-slate-200 ">
                  <thead className="text-xs uppercase text-center text-slate-500 bg-slate-50 border-t border-slate-200">
                    <tr>
                      <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                        <div className="font-semibold text-center">ID</div>
                      </th>
                      <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                        <div className="font-semibold text-center">Client</div>
                      </th>
                      <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                        <div className="font-semibold text-center">T??l.</div>
                      </th>
                      <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                        <div className="font-semibold text-center">Address</div>
                      </th>
                      <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                        <div className="font-semibold text-center">Cr??dit</div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {customersData.map((client) => (
                      <tr className="text-center " key={client._id}>
                        <td className=" p-2">{"#" + client?._id.slice(-6)}</td>
                        <td>{client?.name}</td>
                        <td>{client?.phone?.toString()?.match(/.{2}/g)?.join(" ")}</td>
                        <td>{client?.address}</td>
                        <td>{toCurrency(client?.credit)}</td>
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
