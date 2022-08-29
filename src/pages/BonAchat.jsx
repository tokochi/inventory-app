import { DatePickerComponent } from "@syncfusion/ej2-react-calendars";
import { AutoCompleteComponent } from "@syncfusion/ej2-react-dropdowns";
import Store from "electron-store";
import "moment/locale/fr";
import moment from "moment/min/moment-with-locales";
import React, { useEffect, useRef, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { useReactToPrint } from "react-to-print";
import styled from "styled-components";
import TextBox from "../component/button/TextBox";
import PrintInvoice from "../component/PrintInvoiceBonAchat";
import Toast from "../component/Toast";
import { loadBuyings, loadProducts, loadProviders, useStore } from "../contexts/Store";
import add from "./../data/icons/add.png";
import deletePng from "./../data/icons/delete.png";
import deletePng2 from "./../data/icons/delete2.png";
import done from "./../data/icons/done.png";
import minus from "./../data/icons/minus.png";
import newPng from "./../data/icons/new.png";
import print from "./../data/icons/print.png";
const { ipcRenderer } = require("electron");

moment.locale("fr");

const Wrapper = styled.div`
  & .e-ddl.e-input-group.e-control-wrapper .e-input {
    padding-left: 0.5rem;
    margin: 0;
    padding-right: 0.5rem;
    background-color: rgb(249 250 251 / 1);
    padding-top: 0rem;
    padding-bottom: 0rem;
    font-size: 20px;
    font-weight: 400;
    line-height: 1.5715;
    color: rgb(71 85 105 / 1);
  }
  & .e-input-group:not(.e-success):not(.e-warning):not(.e-error):not(.e-float-icon-left) {
    padding-top: 2px;
    padding-bottom: 2px;
  }
`;
export default function BonAchat() {
  const schema = {
    company: {
      type: "object",
    },
  };
  const store = new Store({ schema });
  const company = store?.get("company");
  const [activeRow, setActiveRow] = useState(false);
  const [indexRow, setIndexRow] = useState(false);
  const productsData = useStore((state) => state.products).filter((product) => !useStore.getState().bonAchat.selectedProducts.some((selected) => selected._id === product._id));
  const bonAchat = useStore((state) => state.bonAchat);
  const productsList = useStore((state) => state.products);
  const setTotalBonAchat = useStore((state) => state.setTotalBonAchat);
  const providersData = useStore((state) => state.providers);
  const buyingsData = useStore((state) => state.buyings);
  const [toastAdd, setToastAdd] = useState(false);
  const [toastEdit, setToastEdit] = useState(false);
  const [showPrintDiv, setShowPrintDiv] = useState(true);
  const gridRef = useRef();
  const [date, setDate] = useState(new Date());
  let autoCompleteObj;
  const normalButton =
    "inline-flex  items-center justify-center text-sm font-medium leading-5 rounded-full px-2  border border-slate-200 hover:border-slate-300 shadow-sm bg-white text-slate-500 duration-150 ease-in-out";

  function addSelectedProducts(e) {
    e.value != null && useStore.setState((state) => ({ bonAchat: { ...state.bonAchat, selectedProduct: e.itemData } }));
  }
  function addSelectedProductstoGrid() {
    if (useStore.getState().bonAchat.selectedProduct != null) {
      useStore.setState((state) => ({
        bonAchat: {
          ...state.bonAchat,
          selectedProducts: [...state.bonAchat.selectedProducts, { ...state.bonAchat.selectedProduct, selectedQuantity: parseInt(1), index: state.bonAchat.selectedProducts.length + 1 }],
        },
      }));
      autoCompleteObj.clear();
      useStore.setState((state) => ({ bonAchat: { ...state.bonAchat, selectedProduct: null } }));
    }
  }
  useHotkeys("f3", addSelectedProductstoGrid);
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
    if (!showPrintDiv) {
      reactToPrint();
      setShowPrintDiv(true);
    }
  }, [showPrintDiv]);
  const productsTemplate = (props) => (
    <table className="table-auto w-full">
      <tbody>
        <tr className={`${props?.quantity === 0 && "bg-red-300"}`}>
          <td className="text-slate-600  font-medium  text-lg min-w-[400px] px-2">
            <span>📦{props?.name}</span>
          </td>
          <td className="px-2">
            <div className={normalButton}>
              Quantité: <span className="text-green-600 ">{props?.quantity}</span>
            </div>
          </td>
          <td>
            <div className={normalButton}>
              Dérnier Prix Achat: <span className="text-green-600 ">{toCurrency(props?.buyPrice)}</span>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  );
  useEffect(() => {
    if (toastAdd) {
      setTimeout(() => setToastAdd(false), 4000);
    }

    if (toastEdit) {
      setTimeout(() => setToastEdit(false), 4000);
    }
  }, [toastAdd, toastEdit]);
  function toCurrency(num) {
    let str = num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + "DA";
    str = str.replace("DZD", "DA");
    str = str.replace(",", " ");
    return str;
  }
  return (
    <div className="bg-white m-2 shadow-lg rounded-sm   relative ">
      <div className="flex h-full justify-center">
        <div id="left" className="bg-white   flex-1 min-w-[480px]">
          <div className="flex  items-center justify-center my-2">
            <hr className="w-[150px]" />
            <span className="mx-1">Info BonAchat</span>
            <hr className="w-[150px]" />
          </div>
          <div id="supplier" className="flex items-center  mb-2">
            <span className="px-4  text-sm font-medium min-w-[120px]">Supplier:</span>
            <TextBox
              type="dropdown"
              id="brand"
              width="w-[200px]"
              value={bonAchat.supplier.name}
              onChange={(e) => e.value != null && useStore.setState((state) => ({ bonAchat: { ...state.bonAchat, supplier: e.itemData } }))}
              fields={{ value: "name", text: "name" }}
              dataSource={[{ name: "Standard" }, ...providersData]}
              popupHeight="200px"
              title="Standard"
            />
            {bonAchat.supplier.name != "Standard" && (
              <div style={{ marginLeft: "4px" }} className={normalButton}>
                Déttes: <span className="text-rose-600 ml-1">{bonAchat.supplier.credit > 0 ? toCurrency(bonAchat.supplier.credit) : toCurrency(0)}</span>
              </div>
            )}
          </div>
          <div id="date" className="flex select-none items-center my-2">
            <span className="px-4  text-sm font-medium min-w-[120px] ">Date:</span>
            <div className="border-slate-200 w-[200px]  border rounded-l hover:border-slate-300 focus:border-indigo-300 shadow-sm">
              <DatePickerComponent
                id="expired"
                name="expired"
                width="198"
                value={date}
                onChange={(e) => setDate(e.value)}
                placeholder="Date"
                format="dddd MMMM y"
                floatLabelType="Never"></DatePickerComponent>
            </div>
          </div>
          <div id="date" className="flex select-none items-center my-2">
            <span className="px-4  text-sm font-medium min-w-[120px] ">Paiement:</span>
            <TextBox
              type="dropdown"
              id="paymentType"
              width="w-[200px]"
              value={bonAchat.paymentType}
              onChange={(e) => e.value != null && useStore.setState((state) => ({ bonAchat: { ...state.bonAchat, paymentType: e.value } }))}
              dataSource={["Espéce", "Chéque", "Virement"]}
              popupHeight="200px"
              title="Mode de Paiement"
            />
          </div>
          <div className="flex  items-center justify-center my-2">
            <hr className="w-[150px]" />
            <span className="mx-1">Montant</span>
            <hr className="w-[150px]" />
          </div>
          <div id="date" className="flex select-none items-center my-2">
            <span className="px-4  text-sm font-medium min-w-[120px] ">Remise:</span>
            <TextBox
              type="number"
              format="C2"
              min={0}
              max={bonAchat.total}
              step={100}
              id="brand"
              width="w-[200px]"
              value={bonAchat.rebate}
              onChange={(e) => {
                e.value != null && useStore.setState((state) => ({ bonAchat: { ...state.bonAchat, rebate: e.value } }));
                setTotalBonAchat();
              }}
            />
          </div>
          {bonAchat.supplier.name != "Standard" && (
            <div id="date" className="flex select-none items-center my-2">
              <span className="px-4  text-sm font-medium min-w-[120px] ">Vérsement:</span>
              <TextBox
                type="number"
                format="C2"
                min={0}
                max={bonAchat.amount}
                step={100}
                id="brand"
                width="w-[200px]"
                value={bonAchat.deposit}
                onChange={(e) => e.value != null && useStore.setState((state) => ({ bonAchat: { ...state.bonAchat, deposit: e.value } }))}
              />
            </div>
          )}
          <div id="date" className="flex select-none items-center my-2">
            <span className="px-4  text-sm font-medium min-w-[120px] ">Total HT:</span>
            <TextBox
              type="number"
              format="C2"
              readOnly
              step={100}
              id="brand"
              width="w-[200px]"
              value={bonAchat.total}
              //  onChange={(e) => e.value != null && useStore.setState((state) => ({ bonAchat: { ...state.bonAchat, deposit: e.value } }))}
            />
          </div>
          <div id="date" className="flex select-none items-center my-2">
            <span className="px-4  text-sm font-medium min-w-[120px] ">TVA:</span>
            <TextBox
              type="number"
              format="P2"
              min={0}
              step={0.01}
              id="brand"
              width="w-[200px]"
              value={bonAchat.tva}
              onChange={(e) => {
                e.value != null && useStore.setState((state) => ({ bonAchat: { ...state.bonAchat, tva: e.value } }));
                setTotalBonAchat();
              }}
            />
          </div>
          <hr className="m-2 w-[100px] ml-[100px]" />
          <div id="option" className="flex items-center ml-10 w-[300px] border p-2 border-slate-400">
            <span className=" font-medium text-slate-700 min-w-[100px]">Total à Payer TTC:</span>
            <span className="font-semibold ml-2 text-slate-600">{toCurrency(bonAchat.amount)}</span>
          </div>
        </div>
        <div id="right" className="w-full flex flex-col  select-none">
          <Wrapper>
            <div id="selectProduct" className="p-2 flex bg-slate-500 text-white">
              <button
                onClick={() => {
                  addSelectedProductstoGrid();
                }}>
                <svg className="w-8 hover:opacity-80 " viewBox="0 0 44 40">
                  <path fill="#7db382" d="M20,38.5C9.799,38.5,1.5,30.201,1.5,20S9.799,1.5,20,1.5S38.5,9.799,38.5,20S30.201,38.5,20,38.5z" />
                  <path fill="#5e9c76" d="M20,2c9.925,0,18,8.075,18,18s-8.075,18-18,18S2,29.925,2,20S10.075,2,20,2 M20,1 C9.507,1,1,9.507,1,20s8.507,19,19,19s19-8.507,19-19S30.493,1,20,1L20,1z" />
                  <path fill="#fff" d="M10 18H30V22H10z" />
                  <path fill="#fff" d="M10 18H30V22H10z" transform="rotate(90 20 20)" />
                </svg>
              </button>
              <AutoCompleteComponent
                ref={(g) => (autoCompleteObj = g)}
                id="vegetables"
                autofill
                sortOrder="Ascending"
                ignoreCase
                showPopupButton
                showClearButton
                allowCustom
                popupHeight="500"
                //customValueSpecifier={(e) => console.log(e)}
                change={(e) => {
                  e.value != null && addSelectedProducts(e);
                  setTotalBonAchat();
                }}
                valueTemplate={productsTemplate}
                itemTemplate={productsTemplate}
                dataSource={productsData}
                fields={{ value: "name", text: "name" }}
                placeholder="Ajouter un Produit (F5)"
              />
            </div>
          </Wrapper>
          <div id="grid" className=" bg-white border  border-slate-200 ">
            <div className="bg-white overflow-y-auto h-[530px] shadow-lg rounded-sm border border-slate-200">
              <table className="w-full relative  divide-y divide-slate-200">
                <thead className="text-xs sticky top-0 z-10 uppercase  text-center text-slate-500 bg-slate-50 border-t border-slate-200">
                  <tr className="sticky top-0 z-10 ">
                    <th className="px-2 sticky top-0 z-10 first:pl-5 last:pr-5 py-3 whitespace-nowrap w-40">
                      <div className="font-semibold text-center">ID</div>
                    </th>
                    <th className="px-2 sticky top-0 z-10 first:pl-5 last:pr-5 py-3 whitespace-nowrap w-2/4">
                      <div className="font-semibold text-center">Désignation</div>
                    </th>
                    <th className="px-2 sticky top-0 z-10 first:pl-5 last:pr-5 py-3 whitespace-nowrap w-20">
                      <div className="font-semibold text-center">Quantité</div>
                    </th>
                    <th className="px-2 sticky top-0 z-10 first:pl-5 last:pr-5 py-3 whitespace-nowrap w-20">
                      <div className="font-semibold text-center">Dérnier Prix Achat</div>
                    </th>
                    <th className="px-2 sticky top-0 z-10 first:pl-5 last:pr-5 py-3 whitespace-nowrap w-1/4">
                      <div className="font-semibold text-center">Prix Achat</div>
                    </th>

                    <th className="px-2 sticky top-0 z-10 first:pl-5 last:pr-5 py-3 whitespace-nowrap w-1/4">
                      <div className="font-semibold text-center">Montant</div>
                    </th>
                    <th className="px-2 sticky top-0 z-10 first:pl-5 last:pr-5 py-3 whitespace-nowrap w-1/4">
                      <div className="font-semibold text-center"></div>
                    </th>
                  </tr>
                </thead>
                <tbody className="">
                  {bonAchat.selectedProducts.map((product, indx) => (
                    <tr
                      className={`text-center ${activeRow && product._id === indexRow && "bg-sky-200"}`}
                      onClick={(e) => {
                        setIndexRow(product._id);
                        setActiveRow(true);
                      }}
                      key={indx}>
                      <td className="text-center p-2">#{indx + 1}</td>
                      <td className="text-center p-2">{product.name}</td>
                      <td>
                        <input
                          onChange={(e) => {
                            const UpdatedProducts = useStore.getState().bonAchat.selectedProducts.map((prod) => (e.target.id === prod._id ? { ...product, selectedQuantity: e.target.value } : prod));
                            useStore.setState((state) => ({ bonAchat: { ...state.bonAchat, selectedProducts: UpdatedProducts } }));
                            setTotalBonAchat();
                          }}
                          id={product._id}
                          name={product._id}
                          type="number"
                          min="1"
                          value={product?.selectedQuantity}
                          className="w-[100px]  text-center border-none"
                        />
                      </td>
                      <td>{product?.lastBuyPrice && toCurrency(product?.lastBuyPrice)}</td>
                      <td>
                        <input
                          onChange={(e) => {
                            const UpdatedProducts = useStore
                              .getState()
                              .bonAchat.selectedProducts.map((prod) => (e.target.id === prod._id ? { ...product, buyPrice: parseInt(e.target.value).toFixed(2) } : prod));
                            useStore.setState((state) => ({ bonAchat: { ...state.bonAchat, selectedProducts: UpdatedProducts } }));
                            setTotalBonAchat();
                          }}
                          id={product._id}
                          name={product._id}
                          type="number"
                          min="0"
                          step="100"
                          //max={product?.quantity}
                          value={parseInt(product?.buyPrice).toFixed(2)}
                          className="w-[100px]  text-right border-none"
                        />
                        DA
                      </td>
                      <td>{toCurrency(product?.buyPrice * product?.selectedQuantity)}</td>
                      <td>
                        <button
                          className=" p-1.5"
                          onClick={(e) => {
                            const UpdatedProducts = useStore.getState().bonAchat.selectedProducts.filter((prod) => product._id !== prod._id);
                            useStore.setState((state) => ({ bonAchat: { ...state.bonAchat, selectedProducts: UpdatedProducts } }));
                            setTotalBonAchat();
                          }}>
                          <img src={deletePng2} width="25" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="flex items-center justify-around gap-4 px-2 py-1 bg-white">
            <div>
              BonAchat N°:<span className="text-green-600"> {buyingsData.length + 1} </span>
            </div>
            <div>
              Produits:<span className="text-green-600"> {bonAchat.selectedProducts.length}</span>
            </div>
          </div>
          <div id="validation" className="flex gap-2 items-center p-2 min-w-[850px]">
            <div className="bg-emerald-600 hover:bg-emerald-400 p-4">
              <button
                onClick={() => {
                  const UpdatedProducts = useStore
                    .getState()
                    .bonAchat.selectedProducts.map((product) =>
                      product._id === indexRow && product.quantity > product.selectedQuantity && product.selectedQuantity >= 1
                        ? { ...product, selectedQuantity: parseFloat(product.selectedQuantity) + 1 }
                        : product
                    );
                  useStore.setState((state) => ({ bonAchat: { ...state.bonAchat, selectedProducts: UpdatedProducts } }));
                  setTotalBonAchat();
                }}
                className="text-xl  text-white gap-2 rounded-sm items-center flex">
                <span>Qté</span>
                <img src={add} className="w-10" />
              </button>
            </div>
            <div className="bg-red-600 hover:bg-red-400 p-4">
              <button
                onClick={() => {
                  const UpdatedProducts = useStore
                    .getState()
                    .bonAchat.selectedProducts.map((product) =>
                      product._id === indexRow && product.quantity > product.selectedQuantity && product.selectedQuantity > 1
                        ? { ...product, selectedQuantity: parseFloat(product.selectedQuantity) - 1 }
                        : product
                    );
                  useStore.setState((state) => ({ bonAchat: { ...state.bonAchat, selectedProducts: UpdatedProducts } }));
                  setTotalBonAchat();
                }}
                className="text-xl  text-white gap-2 rounded-sm items-center flex">
                <span>Qté</span>
                <img src={minus} className="w-10" />
              </button>
            </div>
            <div className="bg-green-500 hover:bg-green-700 p-[9px]">
              <button
                onClick={() => {
                  if (bonAchat.isEdit === true) {
                    // update buying List

                    ipcRenderer.send("updateBuying", {
                      ...bonAchat,
                      supplier: { name: bonAchat.supplier.name, _id: bonAchat.supplier._id, credit: bonAchat.supplier.credit },
                      totalbuyPrice: bonAchat.selectedProducts.reduce((acc, cur) => acc + cur.buyPrice * cur.selectedQuantity, 0).toFixed(2),
                      totalSellPriceGros: bonAchat.selectedProducts.reduce((acc, cur) => acc + cur.sellPriceGros * cur.selectedQuantity, 0).toFixed(2),
                      grid: bonAchat.selectedProducts,
                    });
                    ipcRenderer.on("refreshGridBuying:update", (e, res) => {
                      bonAchat.selectedProducts.forEach((prod) => {
                        // quantity update
                        productsList.forEach((curProduct) => {
                          if (curProduct._id === prod._id) {
                            ipcRenderer.send("updateProduct", {
                              _id: prod._id,
                              quantity: parseInt(curProduct.quantity) - parseInt(prod?.oldSelectedQty) + parseInt(prod.selectedQuantity),
                            });
                          }
                        });
                      });
                      loadBuyings();

                      // clear oldSupplier credit if changed
                      if (bonAchat.oldSupplier._id != bonAchat.supplier._id) {
                        providersData.forEach((provider) => {
                          if (provider._id === bonAchat.oldSupplier._id) {
                            ipcRenderer.send("updateProvider", { _id: bonAchat.oldSupplier._id, credit: (parseInt(provider.credit) - parseInt(bonAchat.oldAmount - bonAchat.oldDeposit)).toFixed(2) });
                          }
                          // add credit to new Supplier
                          if (provider._id === bonAchat.supplier._id && bonAchat.supplier.name != "Standard") {
                            ipcRenderer.send("updateProvider", {
                              _id: bonAchat.supplier._id,
                              credit: (parseInt(provider.credit) + parseInt(bonAchat.amount - bonAchat.deposit)).toFixed(2),
                            });
                          }
                        });
                        ipcRenderer.on("refreshGridProvider:update", (e, res) => {
                          loadProviders();
                        });
                      }
                      if (bonAchat.supplier.name != "Standard" && bonAchat.oldSupplier._id === bonAchat.supplier._id) {
                        // supplier didnt change

                        providersData.forEach((provider) => {
                          if (provider._id === bonAchat.supplier._id) {
                            ipcRenderer.send("updateProvider", {
                              _id: bonAchat.supplier._id,
                              credit: parseInt(provider.credit) - parseInt(bonAchat.oldAmount - bonAchat.oldDeposit) + parseInt(bonAchat.amount - bonAchat.deposit),
                            });
                            ipcRenderer.on("refreshGridProvider:update", (e, res) => {
                              loadProviders();
                            });
                          }
                        });
                      }
                      setToastEdit(true);
                    });
                  } else {
                    // add new buying
                    bonAchat.amount != 0 &&
                      ipcRenderer.send("addBuying", {
                        time: new Date(),
                        index: buyingsData.length + 1,
                        paymentType: bonAchat.paymentType,
                        supplier: { name: bonAchat.supplier.name, _id: bonAchat.supplier._id, credit: bonAchat.supplier.credit },
                        type: "bonAchat",
                        mode: bonAchat.mode,
                        tva: bonAchat.tva,
                        rebate: bonAchat.rebate.toFixed(2),
                        deposit: bonAchat.deposit.toFixed(2),
                        amount: bonAchat.amount.toFixed(2),
                        total: bonAchat.total.toFixed(2),
                        totalSellPrice: bonAchat.selectedProducts.reduce((acc, cur) => acc + cur.sellPrice * cur.selectedQuantity, 0).toFixed(2),
                        totalbuyPrice: bonAchat.selectedProducts.reduce((acc, cur) => acc + cur.buyPrice * cur.selectedQuantity, 0).toFixed(2),
                        totalSellPriceGros: bonAchat.selectedProducts.reduce((acc, cur) => acc + cur.sellPriceGros * cur.selectedQuantity, 0).toFixed(2),
                        grid: bonAchat.selectedProducts,
                      });
                    ipcRenderer.on("refreshGridBuying:add", (e, res) => {
                      bonAchat.selectedProducts.forEach((prod) => {
                        // quantity update
                        ipcRenderer.send("updateProduct", { _id: prod._id, quantity: parseInt(prod.quantity) + parseInt(prod.selectedQuantity) });
                      });
                      loadBuyings();
                      if (bonAchat.supplier.name != "Standard" && bonAchat.amount - bonAchat.deposit > 0) {
                        providersData.forEach((provider) => {
                          if (provider._id === bonAchat.supplier._id) {
                            // add credit
                            ipcRenderer.send("updateProvider", { _id: bonAchat.supplier._id, credit: (parseInt(provider.credit) + parseInt(bonAchat.amount - bonAchat.deposit)).toFixed(2) });
                            ipcRenderer.on("refreshGridProvider:update", (e, res) => {
                              loadProviders();
                            });
                          }
                        });
                      }
                      setToastAdd(true);
                    });
                  }
                  ipcRenderer.on("refreshGridProduct:update", (e, res) => {
                    loadProducts();
                  });
                  useStore.setState((state) => ({
                    bonAchat: {
                      mode: "Détail",
                      supplier: { name: "Standard" },
                      paymentType: "Espéce",
                      amount: 0,
                      total: 0,
                      tva: 0,
                      rebate: 0,
                      deposit: 0,
                      selectedProducts: [],
                      selectedProduct: null,
                    },
                  }));
                  setSupplier({ name: "Standard" });
                }}
                className="text-xl  text-white gap-2 rounded-sm items-center flex">
                <div className="flex flex-col">
                  <span>Valider</span>
                  <span className="text-base">(F1)</span>
                </div>
                <img src={done} className="w-10" />
              </button>
            </div>
            <div className="bg-lime-500 hover:bg-lime-700 p-[9px]">
              <button className="text-xl  text-white gap-2 rounded-sm items-center flex" onClick={() => setShowPrintDiv(false)}>
                <div className="flex flex-col">
                  <span>Imprimer</span>
                  <span className="text-base">(F2)</span>
                </div>
                <img src={print} className="w-10" />
              </button>
            </div>
            <div className="bg-rose-500 hover:bg-rose-700 p-[9px]">
              <button
                onClick={() => {
                  useStore.setState((state) => ({ bonAchat: { ...state.bonAchat, selectedProducts: [] } }));
                  setTotalBonAchat();
                }}
                className="text-xl  text-white gap-2 rounded-sm items-center flex">
                <div className="flex flex-col">
                  <span>Suprimer</span>
                  <span className="text-base">(Suppr)</span>
                </div>
                <img src={deletePng} className="w-10" />
              </button>
            </div>
            <div className="bg-blue-500 hover:bg-blue-700 p-[9px]">
              <button className="text-xl  text-white gap-2 rounded-sm items-center flex">
                <div className="flex flex-col">
                  <span>Nouveau</span>
                  <span className="text-base">(F6)</span>
                </div>
                <img src={newPng} className="w-10" />
              </button>
            </div>
          </div>
        </div>
      </div>
      <div ref={gridRef} className={`${showPrintDiv && "hidden"} `}>
        <PrintInvoice />
      </div>
      <Toast type="success" open={toastEdit} setOpen={setToastEdit}>
        Bon d'achat Modifier avec succès.
      </Toast>
      <Toast type="success" open={toastAdd} setOpen={setToastAdd}>
        Bon d'achat Ajouter avec succès.
      </Toast>
    </div>
  );
}
