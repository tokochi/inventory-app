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
import { loadCustomers, loadProducts, loadVendings, useStore } from "../../contexts/Store";
import VendingFormTemplate from "../../pages/Facture";
import Localization from "../Localization";
import TextBox from "./../button/TextBox";
import SelectedProductsView from "./templates/SelectedProductsView";
import Status from "./templates/VendingsStatus";
const { ipcRenderer } = require("electron");
// ******** Get Vending List  ********
Localization("produits");
export default function VendingTable() {
  // ******** Column Templates  ********
  const [active, setActive] = useState({ all: true, paid: false, unpaid: false, deposit: false });
  const vendingGridStatus = (props) => <Status {...props} />;
  const selectedProductsView = (props) => <SelectedProductsView {...props} />;
  const vendingFormTemplate = (props) => <VendingFormTemplate {...props} />;
  const vendingIdTemplate = (props) => <div>{"#" + props.index}</div>;

  // ******** Grid Table  ********
  const navigate = useNavigate();
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
  const customersData = useStore((state) => state.customers);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const productsList = useStore((state) => state.products);
  const [dropdownOpen2, setDropdownOpen2] = useState(false);
  const [pin, setPin] = useState(false);
  const [selectedProd, setSelectedProd] = useState();
  const [wrongPin, setWrongPin] = useState(false);
  const activeButtoon = `inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border border-transparent shadow-sm ${theme.button} text-white duration-150 ease-in-out`;
  const normalButton = `inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border border-slate-200 hover:border-slate-300 shadow-sm ${theme.nav} ${theme.text} duration-150 ease-in-out`;
 const toCurrency = useStore((state) => state.toCurrency);
  const toolbarOptions = [{ text: "Modifier", tooltipText: "Modifier", prefixIcon: "e-edit", id: "edit" }, "Delete", "Search", "Print", "ColumnChooser"];
  const editing = { allowDeleting: true, allowAdding: true, mode: "Dialog", showDeleteConfirmDialog: true, template: vendingFormTemplate };
  const [showPrintDiv, setShowPrintDiv] = useState(true);
  const gridRef = useRef();
  const vendingData = useStore((state) => state.vendings).filter((vending) => filterVending(vending));
  let grid;
  function filterVending(vending) {
    if (active.all === true) {
      return vending === vending;
    }
    if (active.paid === true) {
      return vending?.amount > 0 && vending?.amount === vending?.deposit;
    }
    if (active.unpaid === true) {
      return vending?.amount > 0 && vending?.deposit === 0;
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
    if (args.item.id.includes("print")) {
      setShowPrintDiv(false);
    }
    if (args.item.id.includes("edit")) {
      if (grid?.getSelectedRecords().length === 0) {
        setDropdownOpen(true);
      }
      if (store?.get("vendingPin")) {
        setSelectedProd(grid?.getSelectedRecords()[0]);
        setDropdownOpen2(true);
      }
      if (grid?.getSelectedRecords()[0].type === "caisse") {
        navigate("/caisse");
        useStore.setState((state) => ({
          caisse: {
            ...grid.getSelectedRecords()[0],
            selectedProducts: grid.getSelectedRecords()[0].grid.map((prod) => {
              return { ...prod, oldSelectedQty: prod.selectedQuantity };
            }),
            oldClient: grid.getSelectedRecords()[0].client,
            oldAmount: grid.getSelectedRecords()[0].amount,
            oldDeposit: grid.getSelectedRecords()[0].deposit,
            isEdit: true,
            selectedProduct: null,
          },
        }));
      }
      if (grid?.getSelectedRecords()[0].type === "facture") {
        navigate("/facture");
        useStore.setState((state) => ({
          facture: {
            ...grid?.getSelectedRecords()[0],
            selectedProducts: grid.getSelectedRecords()[0].grid.map((prod) => {
              return { ...prod, oldSelectedQty: prod.selectedQuantity };
            }),
            oldClient: grid.getSelectedRecords()[0].client,
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
      ipcRenderer.send("deleteVending", args.data[0]);
      ipcRenderer.on("refreshGridVending:delete", (e, res) => {
        // Activity
        store?.set("activity", [
          ...store?.get("activity"),
          {
            date: new Date(),
            page: "Vente",
            action: "supprimer",
            title: "Vente Supprimer",
            item: args?.data[0],
            user: store?.get("user")?.userName,
            role: store?.get("user")?.isAdmin ? "Administrateur" : "Employée",
          },
        ]);
        // Toast
        useStore.setState({ toast: { show: true, title: "Vente Supprimer Du Stock", type: "error" } });
        setTimeout(() => {
          useStore.setState({ toast: { show: false } });
        }, 2000);
        loadVendings();
        ipcRenderer.removeAllListeners("refreshGridVending:delete");

        //restore old quantity
        if (restorQty) {
          args.data[0].grid.forEach((slectedProd) => {
            productsList.forEach((prod) => {
              prod._id === slectedProd._id && ipcRenderer.send("updateProduct", { _id: slectedProd._id, quantity: parseInt(prod.quantity) + parseInt(slectedProd.selectedQuantity) });
            });
            ipcRenderer.on("refreshGridProduct:update", (e, res) => {
              loadProducts();
              ipcRenderer.removeAllListeners("refreshGridProduct:update");
            });
          });
        }
        // restore old client credit
        if (restorCredit) {
          customersData.forEach((customer) => {
            if (customer._id === args.data[0].client._id && args.data[0].client.name != "Standard") {
              ipcRenderer.send("updateCustomer", {
                _id: customer._id,
                credit: parseInt(customer.credit) - parseInt(args.data[0].amount - args.data[0].deposit),
              });
              ipcRenderer.on("refreshGridCustomer:update", (e, res) => {
                loadCustomers();
                ipcRenderer.removeAllListeners("refreshGridCustomer:update");
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
        vendingForm: {},
      }));
    }
    if (args.requestType === "beginEdit") {
    }
  }
  return (
    <div className="p-2  h-screen">
      <div className="mb-4  mx-4 flex justify-between">
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
              Payé <span className="ml-1  text-emerald-600">{useStore((state) => state.vendings).filter((vending) => vending?.amount > 0 && vending?.amount === vending?.deposit).length}</span>
            </button>
          </li>
          <li className="m-1">
            <button
              className={active.deposit ? activeButtoon : normalButton}
              onClick={() => {
                setActive((state) => ({ all: false, paid: false, unpaid: false, deposit: true }));
              }}>
              Vérsement <span className="ml-1 text-amber-600">{useStore((state) => state.vendings).filter((vending) => vending?.amount > 0 && vending?.amount > vending?.deposit).length}</span>
            </button>
          </li>
          <li className="m-1">
            <button
              className={active.unpaid ? activeButtoon : normalButton}
              onClick={() => {
                setActive((state) => ({ all: false, paid: false, unpaid: true, deposit: false }));
              }}>
              Non Payé <span className="ml-1 text-rose-500">{useStore((state) => state.vendings).filter((vending) => vending?.amount > 0 && vending?.deposit === 0).length}</span>
            </button>
          </li>
        </ul>
      </div>
      <div className="mx-2  h-[calc(100vh_-_200px)]">
        <GridComponent
          ref={(g) => (grid = g)}
          dataSource={vendingData?.reverse()}
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
            <ColumnDirective field="index" headerText="ID" textAlign="center" headerTextAlign="center" width="15" template={vendingIdTemplate} />
            <ColumnDirective field="time" headerText="Date" textAlign="center" headerTextAlign="center" width="30" type="datetime" format="dd/MM/yyyy" />
            <ColumnDirective field="time" headerText="Heure" textAlign="center" headerTextAlign="center" width="20" type="datetime" format="HH:mm" />
            <ColumnDirective field="grid" headerText="Produits" textAlign="center" headerTextAlign="center" width="60" template={selectedProductsView} />
            <ColumnDirective field="client.name" headerText="Client" textAlign="center" headerTextAlign="center" width="40" />
            <ColumnDirective field="type" headerText="Type" textAlign="center" headerTextAlign="center" width="20" />
            <ColumnDirective field="total" headerText="Montant" textAlign="center" headerTextAlign="center" width="40" format="c2" />
            <ColumnDirective field="rebate" headerText="Remise" textAlign="center" headerTextAlign="center" width="40" format="c2" />
            <ColumnDirective field="deposit" headerText="Versement" textAlign="center" headerTextAlign="center" width="40" format="c2" />
            <ColumnDirective field="amount" headerText="Total Payé" textAlign="center" headerTextAlign="center" width="40" format="c2" />
            <ColumnDirective field="comment" headerText="Commentaire" textAlign="center" headerTextAlign="center" visible={false} width="40" />
            <ColumnDirective field="status" headerText="Status" headerTextAlign="center" textAlign="center" template={vendingGridStatus} width="30" />
          </ColumnsDirective>
          <Inject services={[Resize, Selection, Reorder, Search, Toolbar, Edit, ColumnChooser, Sort, Print, Filter, PdfExport]} />
        </GridComponent>
        <div ref={gridRef} className={`${showPrintDiv && "hidden"} h-[297mm] w-[210mm] `}>
          <div className="bg-white shadow-lg rounded-sm border border-slate-200 relative">
            <div>
              <div className="overflow-x-auto">
                <div className="flex gap-2 p-2">
                  <span className="text-lg mr-2">Liste Ventes:</span>
                  <button className={normalButton}>
                    Nombre Ventes:
                    <span className="ml-1  text-emerald-600">{vendingData?.length}</span>
                  </button>
                  <button className={normalButton}>
                    Articles Vendu:
                    <span className="ml-1  text-emerald-600">{vendingData?.reduce((acc, buying) => acc + buying.grid.reduce((accu, product) => accu + parseInt(product.selectedQuantity), 0), 0)}</span>
                  </button>
                  <button className={normalButton}>
                    Chiffre D'affaires:
                    <span className="ml-1  text-emerald-600">{toCurrency(vendingData.reduce((acc, cur) => acc + cur.amount, 0))}</span>
                  </button>
                  {/* <button className={normalButton}>
                    Capital Detail:
                    <span className="ml-1  text-emerald-600">{toCurrency(vendingData.reduce((prevProduct, currProduct) => prevProduct + currProduct.quantity * currProduct.sellPrice, 0))}</span>
                  </button> */}
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
                        <div className="font-semibold text-center">Montant</div>
                      </th>
                      <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                        <div className="font-semibold text-center">Remise</div>
                      </th>
                      <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                        <div className="font-semibold text-center">Véresement</div>
                      </th>
                      <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                        <div className="font-semibold text-center">Total Payé</div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {vendingData.map((vending) => (
                      <tr className="text-center " key={vending._id}>
                        <td className=" p-2">{"#" + vending?._id.slice(-6)}</td>
                        <td>{vending?.client.name}</td>
                        <td>{toCurrency(vending?.total)}</td>
                        <td>{toCurrency(vending?.rebate)}</td>
                        <td>{toCurrency(vending?.deposit)}</td>
                        <td>{toCurrency(vending?.amount)}</td>
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
                      if (selectedProd?.type === "caisse") {
                        navigate("/caisse");
                        useStore.setState((state) => ({
                          caisse: {
                            ...selectedProd,
                            selectedProducts: selectedProd?.grid.map((prod) => {
                              return { ...prod, oldSelectedQty: prod.selectedQuantity };
                            }),
                            oldClient: selectedProd?.client,
                            oldAmount: selectedProd?.amount,
                            oldDeposit: selectedProd?.deposit,
                            isEdit: true,
                            selectedProduct: null,
                          },
                        }));
                      }
                      if (selectedProd?.type === "facture") {
                        navigate("/facture");
                        useStore.setState((state) => ({
                          facture: {
                            ...selectedProd,
                            selectedProducts: selectedProd?.grid.map((prod) => {
                              return { ...prod, oldSelectedQty: prod.selectedQuantity };
                            }),
                            oldClient: selectedProd?.client,
                            oldAmount: selectedProd?.amount,
                            oldDeposit: selectedProd?.deposit,
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
