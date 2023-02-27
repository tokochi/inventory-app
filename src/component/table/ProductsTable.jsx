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
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { loadProducts, useStore } from "../../contexts/Store";
import ProductFormTemplate from "../form/ProductForm";
import Localization from "../Localization";
import ProductsInventory from "./../list/ProductsInventory";
import Status from "./templates/ProductsStatus";

const { ipcRenderer } = require("electron");
// ******** Get Products List  ********
Localization("produits");


export default function ProductsTable() {
  // ******** Column Templates  ********
  const productsGridStatus = (props) => <Status {...props} />;
  const productsFormTemplate = (props) => <ProductFormTemplate {...props} />;
  const productsIdTemplate = (props) => <div>{"#" + props._id?.slice(-6)}</div>;
  const productsLastTimeTemplate = (props) => <div>{props.lastTime && Math.abs(moment(props.lastTime).diff(moment(), "days")) + " jours"}</div>;
  // ******** Grid Table  ********
  const theme = useStore((state) => state.theme);
  const [active, setActive] = useState({ all: true, stock: false, alert: false, rupture: false });
  const activeButtoon = `inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border border-transparent shadow-sm ${theme.button} text-white duration-150 ease-in-out`;
  const normalButton = `inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border border-slate-200 hover:border-slate-300 shadow-sm ${theme.nav} ${theme.text} duration-150 ease-in-out`;
 const toolbarOptions = ["Add", "Edit", "Delete", "Search", "Print", "ColumnChooser"];
  const editing = { allowDeleting: true, allowEditing: true, allowAdding: true, mode: "Dialog", showDeleteConfirmDialog: true, template: productsFormTemplate };
  let grid;
  const textValidation = { required: [(args) => (args["value"] == "" ? false : true), "ce champ est obligatoire"] };
  const store = new Store();
  const toCurrency = useStore((state) => state.toCurrency);
  const [showPrintDiv, setShowPrintDiv] = useState(true);
  const gridRef = useRef();
  const productsData = useStore((state) => state.products).filter((product) => filterProduct(product));
  const gridProduct = () => useStore((state) => state.gridProduct);

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
  useEffect(() => {
    useStore.setState((state) => ({ gridProduct: grid }));
  }, [grid]);
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
          store?.set("activity", [
            ...store?.get("activity"),
            {
              date: new Date(),
              page: "Produit",
              action: "ajouter",
              title: "Nouveau Produit Ajouter",
              item: args?.data,
              user: store?.get("user")?.userName,
              role: store?.get("user")?.isAdmin ? "Administrateur" : "Employée",
            },
          ]);
          ipcRenderer.removeAllListeners("refreshGridProduct:add");
          useStore.setState({ toast: { show: true, title: "Produit Ajouter Au Stock Avec Succés", type: "success" } });
          setTimeout(() => {
            useStore.setState({ toast: { show: false } });
          }, 2000);
          loadProducts();
        });

        break;
      case args.requestType === "beginEdit":
        useStore.setState((state) => ({ productForm: { ...args.rowData } }));
        args.dialog.header = "Modifier un produit";
        break;
      case args.requestType === "save" && args.action === "edit":
        ipcRenderer.send("updateProduct", args.data);
        ipcRenderer.on("refreshGridProduct:update", (e, res) => {
          store?.set("activity", [
            ...store?.get("activity"),
            {
              date: new Date(),
              page: "Produit",
              action: "modifier",
              title: "Produit Modifier",
              item: args?.data,
              user: store?.get("user")?.userName,
              role: store?.get("user")?.isAdmin ? "Administrateur" : "Employée",
            },
          ]);
          loadProducts();
          useStore.setState({ toast: { show: true, title: "Produit Modifier Avec Succés", type: "success" } });
          setTimeout(() => {
            useStore.setState({ toast: { show: false } });
          }, 2000);
          ipcRenderer.removeAllListeners("refreshGridProduct:update");
        });

        break;
      case args.requestType === "add":
        args.dialog.header = "Ajouter un Produit";
        break;
      case args.requestType === "delete":
        ipcRenderer.send("deleteProduct", args.data[0]);
        ipcRenderer.on("refreshGridProduct:delete", (e, res) => {
          store.set("activity", [
            ...store?.get("activity"),
            {
              date: new Date(),
              page: "Produit",
              action: "supprimer",
              title: "Produit Supprimer",
              item: args?.data[0],
              user: store?.get("user")?.userName,
              role: store?.get("user")?.isAdmin ? "Administrateur" : "Employée",
            },
          ]);
          useStore.setState({ toast: { show: true, title: "Produit Supprimer Du Stock", type: "error" } });
          setTimeout(() => {
            useStore.setState({ toast: { show: false } });
          }, 2000);
          loadProducts();
          ipcRenderer.removeAllListeners("refreshGridProduct:delete");
        });

        break;
    }
  }
  function actionBegin(args) {
    if (args.requestType === "delete") {
    }
    if (args.requestType === "add") {
      useStore.setState((state) => ({
        productForm: {},
      }));
    }
    if (args.requestType === "beginEdit") {
    }
  }
  useEffect(() => {
    useStore.setState((state) => ({ gridProduct: grid }));
  }, [grid]);

  return (
    <div className="p-2 h-[calc(100vh_-_200px)]">
      <div className="mb-4 mx-4 flex justify-between">
        <ul className="flex flex-wrap -m-1">
          <li className="m-1">
            <button
              className={active.all ? activeButtoon : normalButton}
              onClick={() => {
                setActive((state) => ({ all: true, stock: false, alert: false, rupture: false }));
              }}>
              Tous <span className="ml-1 text-indigo-200">{useStore((state) => state.products).length}</span>
            </button>
          </li>
          <li className="m-1">
            <button
              className={active.stock ? activeButtoon : normalButton}
              onClick={() => {
                setActive((state) => ({ all: false, stock: true, alert: false, rupture: false }));
              }}>
              En Stock <span className="ml-1  text-emerald-600">{useStore.getState().products.filter((product) => product?.quantity > 0 && product?.quantity > (product.qtyAlert ?? 1)).length}</span>
            </button>
          </li>
          <li className="m-1">
            <button
              className={active.alert ? activeButtoon : normalButton}
              onClick={() => {
                setActive((state) => ({ all: false, stock: false, alert: true, rupture: false }));
              }}>
              En Alerte <span className="ml-1 text-amber-600">{useStore.getState().products.filter((product) => product?.quantity > 0 && product?.quantity <= product?.qtyAlert).length}</span>
            </button>
          </li>
          <li className="m-1">
            <button
              className={active.rupture ? activeButtoon : normalButton}
              onClick={() => {
                setActive((state) => ({ all: false, stock: false, alert: false, rupture: true }));
              }}>
              En Rupture <span className="ml-1 text-rose-500">{useStore.getState().products.filter((product) => product?.quantity === 0).length}</span>
            </button>
          </li>
        </ul>
        <ProductsInventory />
      </div>

      <div className="mx-2 h-[calc(100vh_-_200px)]">
        <GridComponent
          ref={(g) => (grid = g)}
          dataSource={productsData}
          enableHover={false}
          allowPdfExport
          allowPrint
          allowResizing
          height="100%"
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
            <ColumnDirective field="id" headerText="ID" textAlign="center" headerTextAlign="center" width="30" template={productsIdTemplate} />
            <ColumnDirective field="barCode" headerText="Code Barre" textAlign="center" headerTextAlign="center" width="30" visible={false} />
            <ColumnDirective field="name" validationRules={textValidation} headerText="Désignation" textAlign="center" headerTextAlign="center" width="60" />
            <ColumnDirective field="unit" headerText="Unité" textAlign="center" headerTextAlign="center" width="15" />
            <ColumnDirective field="quantity" validationRules={textValidation} headerText="Qté" textAlign="center" headerTextAlign="center" width="20" format="n0" />
            <ColumnDirective field="quantitySell" headerText="Qté Vendu" textAlign="center" headerTextAlign="center" width="20" format="n0" />
            <ColumnDirective field="lastTime" headerText="Dérniere Vente" textAlign="center" headerTextAlign="center" width="30" format="n0" template={productsLastTimeTemplate} />
            <ColumnDirective field="total" headerText="Chiffre d'affaire" textAlign="center" headerTextAlign="center" width="30" format="c2" />
            <ColumnDirective field="revenue" headerText="Bénéfice" textAlign="center" headerTextAlign="center" width="30" format="c2" />
            <ColumnDirective field="buyPrice" validationRules={textValidation} headerText="Prix Achat" textAlign="center" headerTextAlign="center" width="40" format="c2" />
            <ColumnDirective field="sellPrice" validationRules={textValidation} headerText="Prix Vente Détail" textAlign="center" headerTextAlign="center" width="40" format="c2" />
            <ColumnDirective field="sellPriceGros" headerText="Prix Vente Gros" textAlign="center" headerTextAlign="center" visible={false} width="40" format="c2" />
            <ColumnDirective field="expired" headerText="Expiration" textAlign="center" headerTextAlign="center" visible={false} width="30" type="datetime" format="dd/MM/yyyy" />
            <ColumnDirective field="notification" headerText="Notification" textAlign="center" headerTextAlign="center" visible={false} width="30" type="datetime" format="dd/MM/yyyy" />
            <ColumnDirective field="comment" headerText="Commentaire" textAlign="center" headerTextAlign="center" visible={false} width="40" />
            <ColumnDirective field="status" headerText="Status" headerTextAlign="center" textAlign="center" template={productsGridStatus} width="30" />
          </ColumnsDirective>
          <Inject services={[Resize, Selection, Reorder, Search, Toolbar, Edit, ColumnChooser, Sort, Print, Filter, PdfExport]} />
        </GridComponent>
        <div ref={gridRef} className={` ${showPrintDiv && "hidden"} h-[297mm] w-[210mm] `}>
          <div className="bg-white shadow-lg rounded-sm border border-slate-200 relative">
            <div>
              <div className="overflow-x-auto">
                <div className="flex gap-2 p-2">
                  <span className="text-lg mr-2">Liste Inventaire:</span>
                  <button className={`inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border border-slate-200 hover:border-slate-300 shadow-sm bg-white text-slate-500 duration-150 ease-in-out`}>
                    Nombre Produits:
                    <span className="ml-1  text-emerald-600">{productsData.length}</span>
                  </button>
                  <button className={`inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border border-slate-200 hover:border-slate-300 shadow-sm bg-white text-slate-500 duration-150 ease-in-out`}>
                    Nombre Articles:
                    <span className="ml-1  text-emerald-600">{productsData.reduce((acc, cur) => acc + cur.quantity, 0)}</span>
                  </button>
                  <button className={`inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border border-slate-200 hover:border-slate-300 shadow-sm bg-white text-slate-500 duration-150 ease-in-out`}>
                    Capital Stock:
                    <span className="ml-1  text-emerald-600">{toCurrency(productsData.reduce((prevProduct, currProduct) => prevProduct + currProduct.quantity * currProduct.buyPrice, 0))}</span>
                  </button>
                  {/* <button className={normalButton}>
                    Capital Detail:
                    <span className="ml-1  text-emerald-600">{toCurrency(productsData.reduce((prevProduct, currProduct) => prevProduct + currProduct.quantity * currProduct.sellPrice, 0))}</span>
                  </button> */}
                </div>
                <table className="table-auto w-full  divide-slate-200 ">
                  <thead className="text-xs uppercase text-center text-slate-500 bg-slate-50 border-t border-slate-200">
                    <tr>
                      <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                        <div className="font-semibold text-center">ID</div>
                      </th>
                      <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                        <div className="font-semibold text-center">Désignation</div>
                      </th>
                      <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                        <div className="font-semibold text-center">Qté</div>
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
                    {productsData.map((product) => (
                      <tr className="text-center " key={product._id}>
                        <td className=" p-2">{"#" + product?._id.slice(-6)}</td>
                        <td>{product?.name}</td>
                        <td>{product?.quantity}</td>
                        <td>{product?.buyPrice && toCurrency(product?.buyPrice)}</td>
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
        </div>
      </div>
    </div>
  );
}
