import { AutoCompleteComponent } from "@syncfusion/ej2-react-dropdowns";
import "moment/locale/fr";
import moment from "moment/min/moment-with-locales";
import React, { useEffect, useRef, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { useReactToPrint } from "react-to-print";
import styled from "styled-components";
import TextBox from "../component/button/TextBox";
import MyTime from "../component/MyTime";
import PrintInvoice from "../component/PrintInvoiceCaisse";
import Toast from "../component/Toast";
import { loadCustomers, loadProducts, loadVendings, useStore } from "../contexts/Store";
import add from "./../data/icons/add.png";
import box from "./../data/icons/box.png";
import deletePng from "./../data/icons/delete.png";
import deletePng2 from "./../data/icons/delete2.png";
import done from "./../data/icons/done.png";
import fav from "./../data/icons/fav.png";
import minus from "./../data/icons/minus.png";
import newPng from "./../data/icons/new.png";
import nofav from "./../data/icons/nofav.png";
import print from "./../data/icons/print.png";
const { ipcRenderer } = require("electron");

moment.locale("fr");
loadCustomers();
loadVendings();
loadProducts();
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
export default function Caisse() {
  //************State**************************
  const [activeRow, setActiveRow] = useState(false);
  const [indexRow, setIndexRow] = useState(false);
  const productsData = useStore((state) => state.products).filter((product) => !useStore.getState().caisse.selectedProducts.some((selected) => selected._id === product._id));
  const productsList = useStore((state) => state.products);
  const caisse = useStore((state) => state.caisse);
  const setTotal = useStore((state) => state.setTotal);
  const customersData = useStore((state) => state.customers);
  const vendingsData = useStore((state) => state.vendings);
  const [toastAdd, setToastAdd] = useState(false);
  const [toastEdit, setToastEdit] = useState(false);
  const [showPrintDiv, setShowPrintDiv] = useState(true);
  const gridRef = useRef();
  let autoCompleteObj;
  const normalButton =
    "inline-flex  items-center justify-center text-sm font-medium leading-5 rounded-full px-2  border border-slate-200 hover:border-slate-300 shadow-sm bg-white text-slate-500 duration-150 ease-in-out";
  //************Keyboard shortcuts*********************
  let validateBtn = useRef();
  let addQtyBtn = useRef();
  let subQtyBtn = useRef();
  let deleteBtn = useRef();
  let printBtn = useRef();
  let addListBtn = useRef();
  let newTabBtn = useRef();
  useHotkeys("f1", () => validateBtn.current.click());
  useHotkeys("f2", () => printBtn.current.click());
  useHotkeys("Delete", () => deleteBtn.current.click());
  useHotkeys("num_add", () => addQtyBtn.current.click());
  useHotkeys("num_subtract", () => subQtyBtn.current.click());
  useHotkeys("f5", () => addListBtn.current.click());
  useHotkeys("f6", () => newTabBtn.current.click());
  //************UseEffects*********************
  function toCurrency(num) {
    let str = "0.00DA";
    if (num != null && !isNaN(num)) {
      str = num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + "DA";
      str = str.replace("DZD", "DA");
      str = str.replace(",", " ");
    }
    return str;
  }
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

  useEffect(() => {
    useStore.setState((state) => ({ caisse: { ...state.caisse, autoCompleteObj } }));
  }, [autoCompleteObj]);
  useEffect(() => {
    if (toastAdd) {
      setTimeout(() => setToastAdd(false), 4000);
    }
    if (toastEdit) {
      setTimeout(() => setToastEdit(false), 4000);
    }
  }, [toastAdd, toastEdit]);
  const productsTemplate = (props) => (
    <table className="table-auto w-full">
      <tbody>
        <tr className={`${props?.quantity === 0 && "bg-red-300"}`}>
          <td>
            <button
              onClick={(e) => {
                e.stopPropagation();
                useStore.getState().products.forEach((product) => {
                  if (product._id === props._id) {
                    ipcRenderer.send("updateProduct", { _id: product._id, fav: !product.fav });
                    ipcRenderer.on("refreshGridProduct:update", (e, res) => {
                      loadProducts();
                      ipcRenderer.removeAllListeners("refreshGridProduct:update");
                    });
                  }
                });
              }}
              className="pt-1 text-center">
              {<img src={props?.fav ? fav : nofav} width="25" className="pl-1" />}
            </button>
          </td>
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
              Prix Vente: <span className="text-green-600 ">{caisse.mode === "Détail" ? toCurrency(props?.sellPrice) : toCurrency(props?.sellPriceGros)}</span>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  );
  return (
    <div className="bg-white m-2 shadow-lg rounded-sm h-[700px]  relative ">
      <div className="flex  justify-center">
        <div id="left" className="bg-white flex-1 min-w-[545px]">
          <div id="option" className="flex  items-center my-2">
            <span className="px-4  text-sm font-medium min-w-[120px] ">Mode Vente:</span>
            <TextBox
              type="dropdown"
              id="brand"
              width="w-[200px]"
              value={caisse.mode}
              onChange={(e) => {
                e.value != null && useStore.setState((state) => ({ caisse: { ...state.caisse, mode: e.value } }));
                setTotal();
              }}
              dataSource={["Détail", "Gros"]}
              popupHeight="200px"
              title="Mode Vente"
            />
          </div>
          <div className="flex items-center  mb-2">
            <span className="px-4  text-sm font-medium min-w-[120px]">Client:</span>
            <TextBox
              type="dropdown"
              id="brand"
              width="w-[200px]"
              value={caisse.client.name}
              onChange={(e) => e.value != null && useStore.setState((state) => ({ caisse: { ...state.caisse, client: e.itemData } }))}
              fields={{ value: "name", text: "name" }}
              dataSource={[{ name: "Standard" }, ...customersData]}
              popupHeight="200px"
              title="Standard"
            />
            {caisse.client.name != "Standard" && (
              <div style={{ marginLeft: "4px" }} className={normalButton}>
                Crédit: <span className="text-rose-600 ml-1">{caisse.client.credit > 0 ? toCurrency(caisse.client.credit) : toCurrency(0)}</span>
              </div>
            )}
          </div>

          <div id="favori" className="bg-slate-800 h-[619px] overflow-auto w-full">
            <div className="text-white text-center w-full my-2 p-2">
              <div className="flex items-center justify-center">
                <img src={fav} width="25" className="pr-1 pb-1" />
                Produits Favoris
              </div>
            </div>
            <div className="flex flex-wrap ">
              {productsList.map(
                (product, ind) =>
                  product?.fav === true && (
                    <div
                      key={ind}
                      onClick={() => {
                        if (caisse.selectedProducts.find((prod) => prod._id === product._id)) {
                          const UpdatedProducts = caisse.selectedProducts.map((prod) =>
                            prod._id === product._id && prod.quantity > prod.selectedQuantity && prod.selectedQuantity >= 1
                              ? { ...prod, selectedQuantity: parseFloat(prod.selectedQuantity) + 1 }
                              : prod
                          );
                          useStore.setState((state) => ({ caisse: { ...state.caisse, selectedProducts: UpdatedProducts } }));
                          setTotal();
                        } else {
                          product.quantity >= 1 &&
                            useStore.setState((state) => ({
                              caisse: {
                                ...state.caisse,
                                selectedProducts: [...state.caisse.selectedProducts, { ...product, selectedQuantity: parseFloat(1), index: state.caisse.selectedProducts.length + 1 }],
                              },
                            }));
                          setTotal();
                        }
                      }}
                      style={{ backgroundImage: `url(${box})` }}
                      className={` m-2 w-[162px] h-[120px] select-none flex flex-col bg-center bg-auto justify-start cursor-pointer items-center rounded-lg px-2 py-1 border border-slate-200 hover:opacity-90 shadow-sm  text-slate-500 duration-150 ease-in-out`}>
                      <div className="flex gap-2 justify-center items-center ">
                        <span className="text-slate-900 text-sm font-semibold text-center ">{product.name.slice(0, 22)}</span>
                      </div>
                      <div className="p-2 flex flex-col gap-1">
                        <div className="inline-flex  items-center justify-center text-sm font-medium leading-5 rounded-full px-2  border border-slate-400  shadow-sm bg-[#fdd8a6] text-slate-600 duration-150 ease-in-out">
                          Quantité:<span className="text-green-700 pl-1"> {product.quantity}</span>
                        </div>
                        <div className="inline-flex  items-center justify-center text-sm font-medium leading-5 rounded-full px-2  border border-slate-400  shadow-sm bg-[#fdd8a6] text-slate-600 duration-150 ease-in-out">
                          Prix: <span className="text-green-700 pl-1">{caisse.mode === "Détail" ? toCurrency(product.sellPrice) : toCurrency(product.sellPriceGros)}</span>
                        </div>
                      </div>
                    </div>
                  )
              )}
            </div>
          </div>
        </div>
        <div id="right" className="w-full flex flex-col  bg-slate-600 select-none">
          <div id="black_screen" className="flex gap-4 bg-black rounded-sm">
            <div id="info_screen" className="text-xl text-white p-2 min-w-[250px]">
              <div id="date" className="flex items-center gap-10 mb-2  ">
                {caisse.isEdit === true ? <span className="text-2xl">{moment(caisse.time).format("HH:mm:ss")}</span> : <MyTime />}
                <span>{moment(caisse.time).format("L")}</span>
              </div>
              <div id="date" className="flex items-center gap-10">
                <div>
                  Vente N°:<span className="text-green-600"> {vendingsData.length + 1} </span>
                </div>
                <div>
                  Produits:<span className="text-green-600"> {caisse.selectedProducts.length}</span>
                </div>
              </div>
            </div>
            <div id="total_screen" className="min-w-[520px] ">
              <div className="text-xl text-white relative">Total</div>
              <span className="text-green-600 text-[76px] absolute top-0 select-none">{toCurrency(caisse.total)}</span>
            </div>
          </div>
          <Wrapper>
            <div id="selectProduct" className="m-2 flex  text-white">
              <button
                ref={addListBtn}
                onClick={() => {
                  if (useStore.getState().caisse.selectedProduct != null) {
                    useStore.setState((state) => ({
                      caisse: {
                        ...state.caisse,
                        selectedProducts: [...state.caisse.selectedProducts, { ...state.caisse.selectedProduct, selectedQuantity: parseFloat(1), index: state.caisse.selectedProducts.length + 1 }],
                      },
                    }));
                    autoCompleteObj.clear();
                    useStore.setState((state) => ({ caisse: { ...state.caisse, selectedProduct: null } }));
                  } else {
                    autoCompleteObj.showPopup();
                    autoCompleteObj.focusIn();
                  }
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
                  e.value != null && e.value != null && e.itemData.quantity > 0 && useStore.setState((state) => ({ caisse: { ...state.caisse, selectedProduct: e.itemData } }));
                  setTotal();
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
            <div className="bg-white overflow-y-auto h-[410px] shadow-lg rounded-sm border border-slate-200">
              <table className="w-full relative  divide-y divide-slate-200">
                <thead className="text-xs sticky top-0 z-10 uppercase  text-center text-slate-500 bg-slate-50 border-t border-slate-200">
                  <tr className="sticky top-0 z-10 ">
                    <th className="px-2 sticky top-0 z-10 first:pl-5 last:pr-5 py-3 whitespace-nowrap w-40">
                      <div className="font-semibold text-center">ID</div>
                    </th>
                    <th className="px-2 sticky top-0 z-10 first:pl-5 last:pr-5 py-3 whitespace-nowrap w-2/4">
                      <div className="font-semibold text-center">Désignation</div>
                    </th>
                    <th className="px-2 sticky top-0 z-10 first:pl-5 last:pr-5 py-3 whitespace-nowrap w-40">
                      <div className="font-semibold text-center">Quantité</div>
                    </th>
                    <th className="px-2 sticky top-0 z-10 first:pl-5 last:pr-5 py-3 whitespace-nowrap w-1/4">
                      <div className="font-semibold text-center">Prix Vente</div>
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
                  {caisse.selectedProducts.map((product, indx) => (
                    <tr
                      className={`text-center ${activeRow && product._id === indexRow && "bg-sky-200"}`}
                      onClick={(e) => {
                        setIndexRow(product._id);
                        useStore.setState({ indexRow: product._id });
                        setActiveRow(true);
                      }}
                      key={indx}>
                      <td className="text-center p-2">#{indx + 1}</td>
                      <td className="text-center p-2">{product.name}</td>
                      <td>
                        <input
                          onChange={(e) => {
                            const UpdatedProducts = useStore.getState().caisse.selectedProducts.map((prod) => (e.target.id === prod._id ? { ...product, selectedQuantity: e.target.value } : prod));
                            useStore.setState((state) => ({ caisse: { ...state.caisse, selectedProducts: UpdatedProducts } }));
                            setTotal();
                          }}
                          id={product._id}
                          name={product._id}
                          type="number"
                          min="1"
                          max={product?.quantity}
                          value={product?.selectedQuantity}
                          className="w-[100px]  text-center border-none"
                        />
                      </td>
                      <td>{caisse.mode === "Détail" ? toCurrency(product?.sellPrice) : toCurrency(product?.sellPriceGros)}</td>
                      <td>{caisse.mode === "Détail" ? toCurrency(product?.sellPrice * product?.selectedQuantity) : toCurrency(product?.sellPriceGros * product?.selectedQuantity)}</td>
                      <td>
                        <button
                          className=" p-1.5"
                          onClick={(e) => {
                            const UpdatedProducts = useStore.getState().caisse.selectedProducts.filter((prod) => product._id !== prod._id);
                            useStore.setState((state) => ({ caisse: { ...state.caisse, selectedProducts: UpdatedProducts } }));
                            setTotal();
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
          <div className="flex items-center justify-between gap-4 px-2 py-1 bg-white">
            <div id="option" className="flex items-center ">
              <span className="px-4  text-sm font-medium ">Remise:</span>
              <TextBox
                type="number"
                format="C2"
                min={0}
                max={caisse.total}
                step={100}
                id="brand"
                width="w-[140px]"
                value={caisse.rebate}
                onChange={(e) => {
                  e.value != null && useStore.setState((state) => ({ caisse: { ...state.caisse, rebate: e.value } }));
                  setTotal();
                }}
              />
            </div>
            {caisse.client.name != "Standard" && (
              <div id="option" className="flex items-center justify-center ">
                <span className="px-4  text-sm font-medium">Vérsement:</span>
                <TextBox
                  type="number"
                  format="C2"
                  min={0}
                  max={caisse.amount}
                  step={100}
                  id="brand"
                  width="w-[140px]"
                  value={caisse.deposit}
                  onChange={(e) => e.value != null && useStore.setState((state) => ({ caisse: { ...state.caisse, deposit: e.value } }))}
                />
              </div>
            )}
            <hr className="w-10" />
            <div id="option" className="flex items-center border p-2 border-slate-400">
              <span className=" font-medium text-slate-700 min-w-[100px]">Total à Payer TTC:</span>
              <span className="font-semibold ml-2 text-slate-600">{toCurrency(caisse.amount)}</span>
            </div>
          </div>
          <div id="validation" className="flex gap-2 items-center p-2 min-w-[850px]">
            <div className="bg-emerald-600 hover:bg-emerald-400 p-4">
              <button
                ref={addQtyBtn}
                onClick={() => {
                  const UpdatedProducts = useStore
                    .getState()
                    .caisse.selectedProducts.map((product) =>
                      product._id === indexRow && product.quantity > product.selectedQuantity && product.selectedQuantity >= 1
                        ? { ...product, selectedQuantity: parseFloat(product.selectedQuantity) + 1 }
                        : product
                    );
                  useStore.setState((state) => ({ caisse: { ...state.caisse, selectedProducts: UpdatedProducts } }));
                  setTotal();
                }}
                className="text-xl  text-white gap-2 rounded-sm items-center flex">
                <span className="">Qté</span>
                <img src={add} className="w-10" />
              </button>
            </div>
            <div className="bg-red-600 hover:bg-red-400 p-4">
              <button
                ref={subQtyBtn}
                onClick={() => {
                  const UpdatedProducts = useStore
                    .getState()
                    .caisse.selectedProducts.map((product) =>
                      product._id === indexRow && product.quantity > product.selectedQuantity && product.selectedQuantity > 1
                        ? { ...product, selectedQuantity: parseInt(product.selectedQuantity) - 1 }
                        : product
                    );
                  useStore.setState((state) => ({ caisse: { ...state.caisse, selectedProducts: UpdatedProducts } }));
                  setTotal();
                }}
                className="text-xl  text-white gap-2 rounded-sm items-center flex">
                <span>Qté</span>
                <img src={minus} className="w-10" />
              </button>
            </div>
            <div className="bg-green-500 hover:bg-green-700 p-[9px]">
              <button
                ref={validateBtn}
                onClick={() => {
                  if (caisse.isEdit === true) {
                    // update vending List
                    ipcRenderer.send("updateVending", {
                      ...caisse,
                      client: { name: caisse.client.name, _id: caisse.client._id, credit: caisse.client.credit },
                      totalbuyPrice: caisse.selectedProducts.reduce((acc, cur) => acc + cur.buyPrice * cur.selectedQuantity, 0).toFixed(2),
                      totalSellPriceGros: caisse.selectedProducts.reduce((acc, cur) => acc + cur.sellPriceGros * cur.selectedQuantity, 0).toFixed(2),
                      grid: caisse.selectedProducts,
                    });
                    ipcRenderer.on("refreshGridVending:update", (e, res) => {
                      loadVendings();

                      caisse.selectedProducts.forEach((prod) => {
                        // quantity update
                        productsList.forEach((curProduct) => {
                          if (curProduct._id === prod._id) {
                            ipcRenderer.send("updateProduct", {
                              _id: prod._id,
                              quantity: parseInt(curProduct.quantity) + (parseInt(prod?.oldSelectedQty || 0) - parseInt(prod.selectedQuantity)),
                            });
                          }
                        });
                      });
                      // clear oldClient credit if changed
                      if (caisse.oldClient._id != caisse.client._id) {
                        customersData.forEach((customer) => {
                          if (customer._id === caisse.oldClient._id) {
                            ipcRenderer.send("updateCustomer", { _id: caisse.oldClient._id, credit: (parseInt(customer.credit) - parseInt(caisse.oldAmount - caisse.oldDeposit)).toFixed(2) });
                          }
                          // add credit to new Client
                          if (customer._id === caisse.client._id && caisse.client.name != "Standard") {
                            ipcRenderer.send("updateCustomer", {
                              _id: caisse.client._id,
                              credit: (parseInt(customer.credit) + parseInt(caisse.amount - caisse.deposit)).toFixed(2),
                            });
                          }
                        });
                        ipcRenderer.on("refreshGridCustomer:update", (e, res) => {
                          loadCustomers();
                          ipcRenderer.removeAllListeners("refreshGridCustomer:update");
                        });
                      }
                      if (caisse.client.name != "Standard" && caisse.oldClient._id === caisse.client._id) {
                        // client didnt change

                        customersData.forEach((customer) => {
                          if (customer._id === caisse.client._id) {
                            ipcRenderer.send("updateCustomer", {
                              _id: caisse.client._id,
                              credit: parseInt(customer.credit) - parseInt(caisse.oldAmount - caisse.oldDeposit) + parseInt(caisse.amount - caisse.deposit),
                            });
                            ipcRenderer.on("refreshGridCustomer:update", (e, res) => {
                              loadCustomers();
                              ipcRenderer.removeAllListeners("refreshGridCustomer:update");
                            });
                          }
                        });
                      }
                      setToastEdit(true);
                      ipcRenderer.removeAllListeners("refreshGridVending:update");
                    });
                  } else {
                    // add new vending
                    caisse.amount != 0 &&
                      ipcRenderer.send("addVending", {
                        time: new Date(),
                        index: vendingsData.length + 1,
                        paymentType: "Espéce",
                        client: { name: caisse.client.name, _id: caisse.client._id, credit: caisse.client.credit },
                        type: "caisse",
                        mode: caisse.mode,
                        rebate: caisse.rebate.toFixed(2),
                        deposit: caisse.deposit.toFixed(2),
                        amount: caisse.amount.toFixed(2),
                        total: caisse.total.toFixed(2),
                        totalSellPrice: caisse.selectedProducts.reduce((acc, cur) => acc + cur.sellPrice * cur.selectedQuantity, 0).toFixed(2),
                        totalbuyPrice: caisse.selectedProducts.reduce((acc, cur) => acc + cur.buyPrice * cur.selectedQuantity, 0).toFixed(2),
                        totalSellPriceGros: caisse.selectedProducts.reduce((acc, cur) => acc + cur.sellPriceGros * cur.selectedQuantity, 0).toFixed(2),
                        grid: caisse.selectedProducts,
                      });
                    ipcRenderer.on("refreshGridVending:add", (e, res) => {
                      loadVendings();
                      caisse.selectedProducts.forEach((prod) => {
                        // quantity update
                        productsList.forEach((curProduct) => {
                          if (curProduct._id === prod._id) {
                            ipcRenderer.send("updateProduct", { _id: prod._id, quantity: parseInt(prod.quantity) - parseInt(prod.selectedQuantity) });
                          }
                        });
                      });

                      if (caisse.client.name != "Standard" && caisse.amount - caisse.deposit > 0) {
                        customersData.forEach((customer) => {
                          if (customer._id === caisse.client._id) {
                            // add credit
                            ipcRenderer.send("updateCustomer", { _id: caisse.client._id, credit: (parseInt(customer.credit) + parseInt(caisse.amount - caisse.deposit)).toFixed(2) });
                            ipcRenderer.on("refreshGridCustomer:update", (e, res) => {
                              loadCustomers();
                              ipcRenderer.removeAllListeners("refreshGridCustomer:update");
                            });
                          }
                        });
                      }
                      setToastAdd(true);
                      ipcRenderer.removeAllListeners("refreshGridVending:add");
                    });
                  }

                  ipcRenderer.on("refreshGridProduct:update", (e, res) => {
                    loadProducts();
                    ipcRenderer.removeAllListeners("refreshGridProduct:update");
                  });
                  useStore.setState((state) => ({
                    caisse: { mode: "Détail", client: { name: "Standard" }, autoCompleteObj, amount: 0, total: 0, rebate: 0, deposit: 0, selectedProducts: [], selectedProduct: null },
                  }));
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
              <button ref={printBtn} className="text-xl  text-white gap-2 rounded-sm items-center flex" onClick={() => setShowPrintDiv(false)}>
                <div className="flex flex-col">
                  <span>Imprimer</span>
                  <span className="text-base">(F2)</span>
                </div>
                <img src={print} className="w-10" />
              </button>
            </div>
            <div className="bg-rose-500 hover:bg-rose-700 p-[9px]">
              <button
                ref={deleteBtn}
                onClick={() => {
                  useStore.setState((state) => ({ caisse: { ...state.caisse, selectedProducts: [] } }));
                  setTotal();
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
              <button ref={newTabBtn} className="text-xl  text-white gap-2 rounded-sm items-center flex">
                <div className="flex flex-col">
                  <span>Nouveau</span>
                  <span className="text-base">(F6)</span>
                </div>
                <img src={newPng} className="w-10" />
              </button>
            </div>
          </div>
        </div>
        <div ref={gridRef} className={`${showPrintDiv && "hidden"} `}>
          <PrintInvoice />
        </div>
      </div>
      <Toast type="success" open={toastEdit} setOpen={setToastEdit}>
        Vente Modifier avec succès.
      </Toast>
      <Toast type="success" open={toastAdd} setOpen={setToastAdd}>
        Nouvelle Vente Ajouter avec succès.
      </Toast>
    </div>
  );
}
