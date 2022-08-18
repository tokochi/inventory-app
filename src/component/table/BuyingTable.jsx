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
import { useStore, loadBuying } from "../../contexts/Store";
import React, { useRef, useState, useEffect } from "react";
import ProductFormTemplate from "../form/ProductForm";
import Localization from "../Localization";
import Status from "./templates/Status";
import { useReactToPrint } from "react-to-print";
import BuyingInventory from '../BuyingInventory';
const { ipcRenderer } = require("electron");

// ******** Get Buying List  ********
loadBuying();
Localization("produits");

export default function BuyingTable() {
  // ******** Column Templates  ********
  const buyingGridStatus = (props) => <Status {...props} />;
  const buyingFormTemplate = (props) => <ProductFormTemplate {...props} />;
  const buyingIdTemplate = (props) => <div>{"#" + props._id?.slice(-6)}</div>;

  // ******** Grid Table  ********
  const [active, setActive] = useState({ all: true, stock: false, alert: false, rupture: false });
  const activeButtoon =
    "inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border border-transparent shadow-sm bg-indigo-500 text-white duration-150 ease-in-out";
  const normalButton =
    "inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border border-slate-200 hover:border-slate-300 shadow-sm bg-white text-slate-500 duration-150 ease-in-out";
  const toolbarOptions = ["Add", "Edit", "Delete", "Search", "Print", "ColumnChooser"];
  const editing = { allowDeleting: true, allowEditing: true, allowAdding: true, mode: "Dialog", showDeleteConfirmDialog: true, template: buyingFormTemplate };
  let grid;
  const [showPrintDiv, setShowPrintDiv] = useState(true);
  const gridRef = useRef();
  const buyingData = () => useStore((state) => state.buying).filter((product) => filterProduct(product));
  function filterProduct(product) {
    if (active.all === true) {
      return product === product;
    }
    if (active.stock === true) {
      return product?.quantity > 0 && product?.quantity > (product.qtyAlert ?? 1);
    }
    if (active.alert === true) {
      return product?.quantity > 0 && product?.quantity <= product?.qtyAlert;
    }
    if (active.rupture === true) {
      return product?.quantity === 0;
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
          loadBuying();
        });
        break;
      case args.requestType === "beginEdit":
        useStore.setState((state) => ({ productForm: { ...args.rowData } }));
        args.dialog.header = "Modifier un produit";
        break;
      case args.requestType === "save" && args.action === "edit":
        ipcRenderer.send("updateProduct", args.data);
        ipcRenderer.on("refreshGridProduct:update", (e, res) => {
          loadBuying();
        });
        break;
      case args.requestType === "add":
        args.dialog.header = "Ajouter un nouvel produit";
        break;
      case args.requestType === "delete":
        ipcRenderer.on("refreshGridProduct:delete", (e, res) => {
          loadBuying();
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
        productForm: {},
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
                setActive((state) => ({ all: true, stock: false, alert: false, rupture: false }));
              }}>
              Tous <span className="ml-1 text-indigo-200">{useStore((state) => state.buying).length}</span>
            </button>
          </li>
          <li className="m-1">
            <button
              className={active.stock ? activeButtoon : normalButton}
              onClick={() => {
                setActive((state) => ({ all: false, stock: true, alert: false, rupture: false }));
              }}>
              En Stock <span className="ml-1  text-emerald-600">{useStore.getState().buying.filter((product) => product?.quantity > 0 && product?.quantity > (product.qtyAlert ?? 1)).length}</span>
            </button>
          </li>
          <li className="m-1">
            <button
              className={active.alert ? activeButtoon : normalButton}
              onClick={() => {
                setActive((state) => ({ all: false, stock: false, alert: true, rupture: false }));
              }}>
              En Alerte <span className="ml-1 text-amber-600">{useStore.getState().buying.filter((product) => product?.quantity > 0 && product?.quantity <= product?.qtyAlert).length}</span>
            </button>
          </li>
          <li className="m-1">
            <button
              className={active.rupture ? activeButtoon : normalButton}
              onClick={() => {
                setActive((state) => ({ all: false, stock: false, alert: false, rupture: true }));
              }}>
              En Rupture <span className="ml-1 text-rose-500">{useStore.getState().buying.filter((product) => product?.quantity === 0).length}</span>
            </button>
          </li>
        </ul>
        <BuyingInventory close={close} />
      </div>
      <div className="mx-2 mb-4">
        <GridComponent
          ref={(g) => (grid = g)}
          dataSource={buyingData()}
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
            <ColumnDirective field="id" headerText="ID" textAlign="center" headerTextAlign="center" width="30" template={buyingIdTemplate} />
            <ColumnDirective field="name" headerText="Désignation" textAlign="center" headerTextAlign="center" width="120" />
            <ColumnDirective field="unit" headerText="Unité" textAlign="center" headerTextAlign="center" width="15" />
            <ColumnDirective field="quantity" headerText="Quantité" textAlign="center" headerTextAlign="center" width="20" format="n0" />
            <ColumnDirective field="buyPrice" headerText="Prix Achat" textAlign="center" headerTextAlign="center" width="40" format="c2" />
            <ColumnDirective field="sellPrice" headerText="Prix Vente Détail" textAlign="center" headerTextAlign="center" width="40" format="c2" />
            <ColumnDirective field="sellPriceGros" headerText="Prix Vente Gros" textAlign="center" headerTextAlign="center" width="40" format="c2" />
            <ColumnDirective field="expired" headerText="Expiration" textAlign="center" headerTextAlign="center" visible={false} width="30" type="datetime" format="dd/MM/yyyy" />
            <ColumnDirective field="comment" headerText="Commentaire" textAlign="center" headerTextAlign="center" visible={false} width="40" />
            <ColumnDirective field="status" headerText="Status" headerTextAlign="center" textAlign="center" template={buyingGridStatus} width="30" />
          </ColumnsDirective>
          <Inject services={[Resize, Selection, Reorder, Search, Toolbar, Edit, ColumnChooser, Sort, Print, Filter, PdfExport]} />
        </GridComponent>
        <div ref={gridRef} className={`mx-2 mb-4 ${showPrintDiv && "hidden"} bg-slate-600 w-full`}></div>
      </div>
    </div>
  );
}
