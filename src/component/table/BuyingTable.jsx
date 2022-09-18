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
import { DialogComponent } from "@syncfusion/ej2-react-popups";
import Store from "electron-store";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { loadBuyings, loadProducts, loadProviders, useStore } from "../../contexts/Store";
import AddDepense from "../avance/AddDepense";
import ProductFormTemplate from "../form/ProductForm";
import Localization from "../Localization";
import TextBox from "./../button/TextBox";
import DepenseList from "./../list/DepenseList";
import SelectedProductsView from "./templates/SelectedProductsbuy";
import Status from "./templates/VendingsStatus";

const { ipcRenderer } = require("electron");
// ******** Get Buying List  ********
loadBuyings();
Localization("produits");

export default function BuyingTable() {
  // ******** Column Templates  ********
  const buyingGridStatus = (props) => <Status {...props} />;
  const selectedProductsView = (props) => <SelectedProductsView {...props} />;
  const buyingFormTemplate = (props) => <ProductFormTemplate {...props} />;
  const buyingIdTemplate = (props) => <div>{"#" + props.index}</div>;
  // ******** Grid Table  ********
  const providersData = useStore((state) => state.providers);
  const toolbarOptions = [{ text: "Modifier", tooltipText: "Modifier", prefixIcon: "e-edit", id: "edit" }, "Delete", "Search", "Print", "ColumnChooser"];
  const [active, setActive] = useState({ all: true, paid: false, unpaid: false, deposit: false });
  const editing = { allowDeleting: true, allowAdding: true, mode: "Dialog", showDeleteConfirmDialog: true, template: buyingFormTemplate };
  let grid;
  const [pin, setPin] = useState(false);
  const [selectedProd, setSelectedProd] = useState();
  const [wrongPin, setWrongPin] = useState(false);
  const navigate = useNavigate();
  const productsList = useStore((state) => state.products);
  const toCurrency = useStore((state) => state.toCurrency);
  const schema = {
    restorQty: {
      type: "boolean",
      default: true,
    },
    restorCredit: {
      type: "boolean",
      default: true,
    },
  };
  const store = new Store({ schema });
  const theme = useStore((state) => state.theme);
  const restorQty = store?.get("restorQty");
  const restorCredit = store?.get("restorCredit");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownOpen2, setDropdownOpen2] = useState(false);
  const [showPrintDiv, setShowPrintDiv] = useState(true);
  const gridRef = useRef();
  const buyingData = useStore((state) => state.buyings).filter((buying) => filterBuying(buying));
  const activeButtoon = `inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border border-transparent shadow-sm ${theme.button} text-white duration-150 ease-in-out`;
   const normalButton = `inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border border-slate-200 hover:border-slate-300 shadow-sm ${theme.nav} ${theme.text} duration-150 ease-in-out`;
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
  function filterBuying(buying) {
    if (active.all === true) {
      return buying === buying;
    }
    if (active.paid === true) {
      return buying?.amount > 0 && buying?.amount === buying?.deposit;
    }
    if (active.unpaid === true) {
      return buying?.amount > 0 && buying?.deposit === 0;
    }
    if (active.deposit === true) {
      return buying?.amount > 0 && buying?.amount > buying?.deposit;
    }
  }
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
      case args.item.id.includes("edit"):
        if (grid?.getSelectedRecords().length === 0) {
          setDropdownOpen(true);
        } else if (store?.get("buyingPin")) {
          setSelectedProd(grid?.getSelectedRecords()[0]);
          setDropdownOpen2(true);
        } else if (grid.getSelectedRecords()[0].type === "bonAchat") {
          navigate("/bonAchat");
          useStore.setState((state) => ({
            bonAchat: {
              ...grid?.getSelectedRecords()[0],
              selectedProducts: grid.getSelectedRecords()[0].grid.map((prod) => {
                return { ...prod, oldSelectedQty: prod.selectedQuantity };
              }),
              oldSupplier: grid.getSelectedRecords()[0].supplier,
              oldAmount: grid.getSelectedRecords()[0].amount,
              oldDeposit: grid.getSelectedRecords()[0].deposit,
              isEdit: true,
              selectedProduct: null,
            },
          }));
        }
    }
  }
  function actionComplete(args) {
    if (args.requestType === "delete") {
      ipcRenderer.send("deleteBuying", args.data[0]);
      ipcRenderer.on("refreshGridBuying:delete", (e, res) => {
        // activity
        store?.set("activity", [
          ...store?.get("activity"),
          {
            date: new Date(),
            page: "Achat",
            action: "supprimer",
            title: "Achat Supprimer",
            item: args?.data,
            user: store?.get("user")?.userName,
            role: store?.get("user")?.isAdmin ? "Administrateur" : "Employée",
          },
        ]);
        // Toast
        useStore.setState({ toast: { show: true,title: "Achat Supprimer Du Stock", type: "error" } });
        setTimeout(() => {
          useStore.setState({ toast: { show: false}});
        }, 2000);
        loadBuyings();
        ipcRenderer.removeAllListeners("refreshGridBuying:delete");
        if (restorQty) {
          //restore old quantity
          args.data[0].grid.forEach((slectedProd) => {
            productsList.forEach((prod) => {
              prod._id === slectedProd._id && ipcRenderer.send("updateProduct", { _id: slectedProd._id, quantity: parseInt(prod.quantity) - parseInt(slectedProd.selectedQuantity) });
            });
            ipcRenderer.on("refreshGridProduct:update", (e, res) => {
              loadProducts();
              ipcRenderer.removeAllListeners("refreshGridProduct:update");
            });
          });
        }
        if (restorCredit) {
          // restore old supplier credit
          providersData.forEach((provider) => {
            if (provider._id === args.data[0].supplier._id && args.data[0].supplier.name != "Standard") {
              ipcRenderer.send("updateProvider", {
                _id: provider._id,
                credit: parseInt(provider.credit) - parseInt(args.data[0].amount - args.data[0].deposit),
              });
              ipcRenderer.on("refreshGridProvider:update", (e, res) => {
                loadProviders();
                ipcRenderer.removeAllListeners("refreshGridProvider:update");
              });
            }
          });
        }
      });
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
  return (
    <div className="p-2 h-screen">
      <div className="mb-4 mx-4 flex justify-between">
        <ul className="flex flex-wrap -m-1">
          <li className="m-1">
            <button
              className={active.all ? activeButtoon : normalButton}
              onClick={() => {
                setActive((state) => ({ all: true, paid: false, unpaid: false, deposit: false }));
              }}>
              Tous <span className="ml-1 text-indigo-200">{useStore((state) => state.buyings).length}</span>
            </button>
          </li>
          <li className="m-1">
            <button
              className={active.paid ? activeButtoon : normalButton}
              onClick={() => {
                setActive((state) => ({ all: false, paid: true, unpaid: false, deposit: false }));
              }}>
              Payé <span className="ml-1  text-emerald-600">{useStore((state) => state.buyings).filter((buying) => buying?.amount > 0 && buying?.amount === buying?.deposit).length}</span>
            </button>
          </li>
          <li className="m-1">
            <button
              className={active.deposit ? activeButtoon : normalButton}
              onClick={() => {
                setActive((state) => ({ all: false, paid: false, unpaid: false, deposit: true }));
              }}>
              Vérsement <span className="ml-1 text-amber-600">{useStore((state) => state.buyings).filter((buying) => buying?.amount > 0 && buying?.amount > buying?.deposit).length}</span>
            </button>
          </li>
          <li className="m-1">
            <button
              className={active.unpaid ? activeButtoon : normalButton}
              onClick={() => {
                setActive((state) => ({ all: false, paid: false, unpaid: true, deposit: false }));
              }}>
              Non Payé <span className="ml-1 text-rose-500">{useStore((state) => state.buyings).filter((buying) => buying?.amount > 0 && buying?.deposit === 0).length}</span>
            </button>
          </li>
        </ul>
        <div className="flex gap-2">
          <AddDepense />
          <DepenseList />
        </div>
      </div>
      <div className="mx-2 h-[calc(100vh_-_200px)]">
        <GridComponent
          ref={(g) => (grid = g)}
          dataSource={buyingData?.reverse()}
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
            <ColumnDirective field="id" headerText="ID" textAlign="center" headerTextAlign="center" width="15" template={buyingIdTemplate} />
            <ColumnDirective field="time" headerText="Date" textAlign="center" headerTextAlign="center" width="30" type="datetime" format="dd/MM/yyyy" />
            <ColumnDirective field="grid" headerText="Produits" textAlign="center" headerTextAlign="center" width="50" template={selectedProductsView} />
            <ColumnDirective field="supplier.name" headerText="Fournisseur" textAlign="center" headerTextAlign="center" width="40" />
            <ColumnDirective field="total" headerText="Montant" textAlign="center" headerTextAlign="center" width="40" format="c2" />
            <ColumnDirective field="rebate" headerText="Remise" textAlign="center" headerTextAlign="center" width="40" format="c2" />
            <ColumnDirective field="deposit" headerText="Versement" textAlign="center" headerTextAlign="center" width="40" format="c2" />
            <ColumnDirective field="amount" headerText="Total Payé" textAlign="center" headerTextAlign="center" width="40" format="c2" />
            <ColumnDirective field="comment" headerText="Commentaire" textAlign="center" headerTextAlign="center" visible={false} width="40" />
            <ColumnDirective field="status" headerText="Status" headerTextAlign="center" textAlign="center" template={buyingGridStatus} width="30" />
          </ColumnsDirective>
          <Inject services={[Resize, Selection, Reorder, Search, Toolbar, Edit, ColumnChooser, Sort, Print, Filter, PdfExport]} />
        </GridComponent>
        <div ref={gridRef} className={` ${showPrintDiv && "hidden"} h-[297mm] w-[210mm] `}>
          <div className="bg-white shadow-lg rounded-sm border border-slate-200 relative">
            <div>
              <div className="overflow-x-auto">
                <div className="flex gap-2 p-2">
                  <span className="text-lg mr-2">Liste Achats:</span>
                  <button className={normalButton}>
                    Nombre Achats:
                    <span className="ml-1  text-emerald-600">{buyingData?.length}</span>
                  </button>
                  <button className={normalButton}>
                    Nombre Articles:
                    <span className="ml-1  text-emerald-600">{buyingData?.reduce((acc, buying) => acc + buying.grid.reduce((accu, product) => accu + parseInt(product.selectedQuantity), 0), 0)}</span>
                  </button>
                  <button className={normalButton}>
                    Total Achats:
                    <span className="ml-1  text-emerald-600">{toCurrency(buyingData.reduce((acc, cur) => acc + cur.amount, 0))}</span>
                  </button>
                  {/* <button className={normalButton}>
                    Capital Detail:
                    <span className="ml-1  text-emerald-600">{toCurrency(buyingData.reduce((prevProduct, currProduct) => prevProduct + currProduct.quantity * currProduct.sellPrice, 0))}</span>
                  </button> */}
                </div>
                <table className="table-auto w-full  divide-slate-200 ">
                  <thead className="text-xs uppercase text-center text-slate-500 bg-slate-50 border-t border-slate-200">
                    <tr>
                      <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                        <div className="font-semibold text-center">ID</div>
                      </th>
                      <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                        <div className="font-semibold text-center">Fourniseur</div>
                      </th>
                      <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                        <div className="font-semibold text-center">Montant</div>
                      </th>
                      <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                        <div className="font-semibold text-center">Remise</div>
                      </th>
                      <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                        <div className="font-semibold text-center">Vérsement</div>
                      </th>
                      <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                        <div className="font-semibold text-center">Total payé</div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {buyingData.map((buying) => (
                      <tr className="text-center " key={buying._id}>
                        <td className=" p-2">{"#" + buying?._id.slice(-6)}</td>
                        <td>{buying?.supplier.name}</td>
                        <td>{toCurrency(buying?.total)}</td>
                        <td>{toCurrency(buying?.rebate)}</td>
                        <td>{toCurrency(buying?.deposit)}</td>
                        <td>{toCurrency(buying?.amount)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <DialogComponent
        visible={dropdownOpen}
        closeOnEscape
        width="400"
        open={() => setDropdownOpen(true)}
        close={() => setDropdownOpen(false)}
        footerTemplate={() => (
          <div>
            <ul className="flex items-center justify-end gap-6">
              <li>
                <button
                  className="btn-xs bg-indigo-500 hover:bg-indigo-600 text-white"
                  onClick={() => {
                    setDropdownOpen(false);
                  }}>
                  Ok
                </button>
              </li>
            </ul>
          </div>
        )}>
        Aucune ligne sélectionnée pour la modification
      </DialogComponent>
      <DialogComponent
        header="Autorisation 🔒"
        visible={dropdownOpen2}
        showCloseIcon={true}
        closeOnEscape
        width="200"
        open={() => setDropdownOpen2(true)}
        close={() => setDropdownOpen2(false)}
        footerTemplate={() => (
          <div>
            <ul className="flex items-center justify-end gap-6">
              <li>
                <button
                  className="btn-xs bg-indigo-500 hover:bg-indigo-600 text-white"
                  onClick={() => {
                    if (pin === store.get("pin")) {
                      if (selectedProd?.type === "bonAchat") {
                        navigate("/bonAchat");
                        useStore.setState((state) => ({
                          bonAchat: {
                            ...selectedProd,
                            selectedProducts: selectedProd.grid.map((prod) => {
                              return { ...prod, oldSelectedQty: prod.selectedQuantity };
                            }),
                            oldSupplier: selectedProd.supplier,
                            oldAmount: selectedProd.amount,
                            oldDeposit: selectedProd.deposit,
                            isEdit: true,
                            selectedProduct: null,
                          },
                        }));
                      }

                      setDropdownOpen2(false);
                    } else {
                      setWrongPin(true);
                    }
                  }}>
                  Ajouter
                </button>
              </li>
              <li>
                <button
                  className="btn-xs bg-white border-slate-200 hover:border-slate-300 text-slate-500 hover:text-slate-600"
                  onClick={(e) => {
                    setDropdownOpen2(false);
                  }}>
                  Annuler
                </button>
              </li>
            </ul>
          </div>
        )}>
        {" "}
        <div className="flex flex-col justify-start items-start">
          <label className="text-sm font-medium mr-2 mb-1" htmlFor="name">
            Code Pin
          </label>
          <TextBox
            id="name"
            onChange={(e) => {
              setWrongPin(false);
              setPin(e.value);
            }}
            className="form-input w-full"
            min={0}
            htmlAttributes={{ maxlength: "6", type: "password" }}
            type="number"
            showSpinButton={false}
            format="N0"
          />
          {wrongPin && <span className="m-1 text-xs text-red-400">Code pin inccorecte</span>}
        </div>
      </DialogComponent>
    </div>
  );
}
