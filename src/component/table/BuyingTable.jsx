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
import { useStore, loadBuyings } from "../../contexts/Store";
import React, { useRef, useState, useEffect } from "react";
import ProductFormTemplate from "../form/ProductForm";
import Localization from "../Localization";
import Status from "./templates/ProductsStatus";
import { useReactToPrint } from "react-to-print";

const { ipcRenderer } = require("electron");

// ******** Get Buying List  ********
loadBuyings();
Localization("produits");

export default function BuyingTable() {
  // ******** Column Templates  ********
  const buyingGridStatus = (props) => <Status {...props} />;
  const buyingFormTemplate = (props) => <ProductFormTemplate {...props} />;
  const buyingIdTemplate = (props) => <div>{"#" + props._id?.slice(-6)}</div>;

  // ******** Grid Table  ********
const toolbarOptions = ["Add", "Edit", "Delete", "Search", "Print", "ColumnChooser"];
  const editing = { allowDeleting: true, allowEditing: true, allowAdding: true, mode: "Dialog", showDeleteConfirmDialog: true, template: buyingFormTemplate };
  let grid;
  const [showPrintDiv, setShowPrintDiv] = useState(true);
  const gridRef = useRef();
  const buyingData = () => useStore((state) => state.buyings).filter((product) => filterProduct(product));

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
          loadBuyings();
        });
        break;
      case args.requestType === "beginEdit":
        useStore.setState((state) => ({ productForm: { ...args.rowData } }));
        args.dialog.header = "Modifier un Achat";
        break;
      case args.requestType === "save" && args.action === "edit":
        ipcRenderer.send("updateProduct", args.data);
        ipcRenderer.on("refreshGridProduct:update", (e, res) => {
          loadBuyings();
        });
        break;
      case args.requestType === "add":
        args.dialog.header = "Ajouter un Achat";
        break;
      case args.requestType === "delete":
        ipcRenderer.on("refreshGridProduct:delete", (e, res) => {
          loadBuyings();
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
      <div></div>
      <div className="mx-2 mb-4">
        <GridComponent
          ref={(g) => (grid = g)}
          dataSource={buyingData()}
          enableHover={false}
          height="500"
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
