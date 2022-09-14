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
import PrintInvoice from "../component/invoice/PrintInvoiceFacture";
import { loadCustomers, loadProducts, loadVendings, useStore } from "../contexts/Store";
import ProductFormPopUp from "./../component/form/ProductFormPopUp";
import add from "./../data/icons/add.png";
import deletePng from "./../data/icons/delete.png";
import deletePng2 from "./../data/icons/delete2.png";
import done from "./../data/icons/done.png";
import minus from "./../data/icons/minus.png";
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
export default function Facture(props) {
  //************State**************************
  const schema = { company: { type: "object" } };
  const store = new Store({ schema });
  const company = store?.get("company");
  const [activeRow, setActiveRow] = useState(false);
  const [indexRow, setIndexRow] = useState(false);
  const productsData = useStore((state) => state.products).filter((product) => !useStore.getState().facture.selectedProducts.some((selected) => selected._id === product._id));
  const facture = useStore((state) => state.facture);
  const setTotalFacture = useStore((state) => state.setTotalFacture);
  const customersData = useStore((state) => state.customers);
  const productsList = useStore((state) => state.products);
  const vendingsData = useStore((state) => state.vendings);
  const [showPrintDiv, setShowPrintDiv] = useState(true);
  const gridRef = useRef();
  const [title, setTitle] = useState(0);
  const [date, setDate] = useState(new Date());
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
  const toCurrency = useStore((state) => state.toCurrency);
  useEffect(() => {
    if (!showPrintDiv) {
      reactToPrint();
      setShowPrintDiv(true);
    }
  }, [showPrintDiv]);
  useEffect(() => {
    useStore.setState((state) => ({ facture: { ...state.facture, autoCompleteObj } }));
  }, [autoCompleteObj]);

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

  const productsTemplate = (props) => (
    <table className="table-auto w-full">
      <tbody>
        <tr className={`${props?.quantity === 0 && "bg-red-50"}`}>
          <td className="text-slate-600  font-medium  text-lg min-w-[400px] px-2">
            <span>📦{props?.name}</span>
          </td>
          <td className="px-2">
            <div className={`${normalButton} ${props?.quantity === 0 && "bg-red-100"}`}>
              Quantité: <span className={`text-green-600 ml-1 ${props?.quantity === 0 && "text-rose-600"}`}>{props?.quantity}</span>
            </div>
          </td>
          <td>
            <div className={`${normalButton} ${props.buyPrice >= props.sellPrice && "bg-red-100"}`}>
              Prix Vente:{" "}
              <span className={`text-green-600 ml-1 ${props.buyPrice >= props.sellPrice && "text-rose-600"}`}>
                {facture.mode === "Détail" ? toCurrency(props?.sellPrice) : toCurrency(props?.sellPriceGros)}
              </span>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  );

  return (
    <div className="bg-white m-2 shadow-lg rounded-sm   relative ">
      <div className="flex h-full  justify-center">
        <div id="left" className="bg-white   flex-1 min-w-[480px]">
          <div className="flex  items-center justify-center my-2">
            <hr className="w-[150px]" />
            <span className="mx-1">Info Commercial</span>
            <hr className="w-[150px]" />
          </div>
          <div id="companyInfo" className="flex  items-center my-2">
            <span className="px-4  text-sm font-medium min-w-[120px] ">Entreprise:</span>
            <TextBox
              type="text"
              id="brand"
              width="w-[200px]"
              value={company?.name}
              onChange={(e) => {
                const temp = store.get("company");
                e.value != null && store.set("company", { ...temp, name: e.value });
              }}
              title="Mon Entreprise"
            />
          </div>
          <div id="companyInfo" className="flex  items-center my-2">
            <span className="px-4  text-sm font-medium min-w-[120px] ">Téléphone:</span>
            <TextBox
              type="text"
              id="brand"
              width="w-[200px]"
              value={company?.phone}
              onChange={(e) => {
                const temp = store.get("company");
                e.value != null && store.set("company", { ...temp, phone: e.value });
              }}
              title="N° Téléphone"
            />
          </div>
          <div id="companyInfo" className="flex  items-center my-2">
            <span className="px-4  text-sm font-medium min-w-[120px] ">Adresse:</span>
            <TextBox
              type="text"
              id="brand"
              width="w-[300px]"
              value={company?.address}
              onChange={(e) => {
                const temp = store.get("company");
                e.value != null && store.set("company", { ...temp, address: e.value });
              }}
              title="adresse"
            />
          </div>
          <div id="companyInfo" className="flex  items-center my-2">
            <span className="px-4  text-sm font-medium min-w-[120px] ">N°RC:</span>
            <TextBox
              type="text"
              id="brand"
              width="w-[300px]"
              value={company?.rc}
              onChange={(e) => {
                const temp = store.get("company");
                e.value != null && store.set("company", { ...temp, rc: e.value });
              }}
              title="N° RC"
            />
          </div>
          <div id="companyInfo" className="flex  items-center my-2">
            <span className="px-4  text-sm font-medium min-w-[120px] ">N°IF:</span>
            <TextBox
              type="text"
              id="brand"
              width="w-[300px]"
              value={company?.if}
              onChange={(e) => {
                const temp = store.get("company");
                e.value != null && store.set("company", { ...temp, if: e.value });
              }}
              title="N° IF"
            />
          </div>
          <div className="flex  items-center justify-center my-2">
            <hr className="w-[150px]" />
            <span className="mx-1">Info Facture</span>
            <hr className="w-[150px]" />
          </div>
          <div id="mode" className="flex  items-center my-2">
            <span className="px-4  text-sm font-medium min-w-[120px] ">Mode Vente:</span>
            <TextBox
              type="dropdown"
              id="brand"
              width="w-[200px]"
              value={facture.mode}
              onChange={(e) => {
                e.value != null && useStore.setState((state) => ({ facture: { ...state.facture, mode: e.value } }));
                setTotalFacture();
              }}
              dataSource={["Détail", "Gros"]}
              popupHeight="200px"
              title="Mode Vente"
            />
          </div>
          <div id="client" className="flex items-center  mb-2">
            <span className="px-4  text-sm font-medium min-w-[120px]">Client:</span>
            <TextBox
              type="dropdown"
              id="brand"
              width="w-[200px]"
              value={facture.client.name}
              onChange={(e) => e.value != null && useStore.setState((state) => ({ facture: { ...state.facture, client: e.itemData } }))}
              fields={{ value: "name", text: "name" }}
              dataSource={[{ name: "Standard" }, ...customersData]}
              popupHeight="200px"
              title="Standard"
            />
            {facture.client.name != "Standard" && (
              <div style={{ marginLeft: "4px" }} className={normalButton}>
                Crédit: <span className="text-rose-600 ml-1">{facture.client.credit > 0 ? toCurrency(facture.client.credit) : toCurrency(0)}</span>
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
              value={facture.paymentType}
              onChange={(e) => e.value != null && useStore.setState((state) => ({ facture: { ...state.facture, paymentType: e.value } }))}
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
              max={facture.total}
              step={100}
              id="brand"
              width="w-[200px]"
              value={facture.rebate}
              onChange={(e) => {
                e.value != null && useStore.setState((state) => ({ facture: { ...state.facture, rebate: e.value } }));
                setTotalFacture();
              }}
            />
          </div>
          {facture.client.name != "Standard" && (
            <div id="date" className="flex select-none items-center my-2">
              <span className="px-4  text-sm font-medium min-w-[120px] ">Vérsement:</span>
              <TextBox
                type="number"
                format="C2"
                min={0}
                max={facture.amount}
                step={100}
                id="brand"
                width="w-[200px]"
                value={facture.deposit}
                onChange={(e) => e.value != null && useStore.setState((state) => ({ facture: { ...state.facture, deposit: e.value } }))}
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
              value={facture.total}
              //  onChange={(e) => e.value != null && useStore.setState((state) => ({ facture: { ...state.facture, deposit: e.value } }))}
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
              value={facture.tva}
              onChange={(e) => {
                e.value != null && useStore.setState((state) => ({ facture: { ...state.facture, tva: e.value } }));
                setTotalFacture();
              }}
            />
          </div>
          <hr className="m-2 w-[100px] ml-[100px]" />
          <div id="option" className="flex items-center ml-10 w-[300px] border p-2 border-slate-400">
            <span className=" font-medium text-slate-700 min-w-[100px]">Total à Payer TTC:</span>
            <span className="font-semibold ml-2 text-slate-600">{toCurrency(facture.amount)}</span>
          </div>
        </div>
        <div id="right" className="w-full flex flex-col  select-none">
          <Wrapper>
            <div id="selectProduct" className="p-2 flex bg-slate-500 text-white">
              <button
                ref={addListBtn}
                onClick={() => {
                  useStore.setState(() => ({ dropdownOpen: true }));
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
                change={(e) => {
                  if (e.itemData?._id != null && e.itemData.quantity >= 1) {
                    if (useStore.getState().facture.selectedProducts.some((selected) => selected._id === e.itemData._id) === false) {
                      useStore.setState((state) => ({
                        facture: {
                          ...state.facture,
                          selectedProducts: [...state.facture.selectedProducts, { ...e.itemData, selectedQuantity: parseInt(1), index: state.facture.selectedProducts.length + 1 }],
                        },
                      }));
                    } else {
                      useStore.setState((state) => ({
                        facture: {
                          ...state.facture,
                          selectedProducts: useStore
                            .getState()
                            .facture.selectedProducts.map((prod) => (prod._id === e.itemData._id ? { ...prod, selectedQuantity: parseInt(prod.selectedQuantity + 1) } : prod)),
                        },
                      }));
                    }
                    facture.autoCompleteObj.clear();
                    setTotalFacture();
                  }
                }}
                filtering={(e) => {
                  setTitle(e.text);
                  const barCodeProd = productsList.find((prod) => prod.barCode === e.text);
                  if (barCodeProd != undefined) {
                    if (facture.selectedProducts.some((selected) => selected._id === barCodeProd._id) === false) {
                      useStore.setState((state) => ({
                        facture: {
                          ...state.facture,
                          selectedProducts: [
                            ...state.facture.selectedProducts,
                            { ...productsList.find((prod) => prod.barCode === e.text), selectedQuantity: parseInt(1), index: state.facture.selectedProducts.length + 1 },
                          ],
                        },
                      }));
                    } else {
                      useStore.setState((state) => ({
                        facture: {
                          ...state.facture,
                          selectedProducts: facture.selectedProducts.map((prod) => (prod._id === barCodeProd._id ? { ...prod, selectedQuantity: parseInt(prod.selectedQuantity + 1) } : prod)),
                        },
                      }));
                    }
                    facture.autoCompleteObj.focusOut();
                    facture.autoCompleteObj.clear();
                    facture.autoCompleteObj.focusIn();
                  }
                }}
                valueTemplate={productsTemplate}
                itemTemplate={productsTemplate}
                dataSource={productsData}
                fields={{ value: "name", text: "name" }}
                placeholder="Ajouter un Produit (F5)"
              />
            </div>
          </Wrapper>
          <div id="grid" className=" bg-white border shrink-0 border-slate-200 ">
            <div className="bg-white overflow-y-auto h-[530px] shadow-lg rounded-sm border border-slate-200">
              <table className="w-full relative   divide-slate-200">
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
                      <div className="font-semibold text-center">PUHT</div>
                    </th>

                    <th className="px-2 sticky top-0 z-10 first:pl-5 last:pr-5 py-3 whitespace-nowrap w-1/4">
                      <div className="font-semibold text-center">Total</div>
                    </th>
                    <th className="px-2 sticky top-0 z-10 first:pl-5 last:pr-5 py-3 whitespace-nowrap w-1/4">
                      <div className="font-semibold text-center"></div>
                    </th>
                  </tr>
                </thead>
                <tbody className="">
                  {facture.selectedProducts.map((product, indx) => (
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
                            const UpdatedProducts = useStore.getState().facture.selectedProducts.map((prod) => (e.target.id === prod._id ? { ...product, selectedQuantity: e.target.value } : prod));
                            useStore.setState((state) => ({ facture: { ...state.facture, selectedProducts: UpdatedProducts } }));
                            setTotalFacture();
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
                      <td>{facture.mode === "Détail" ? toCurrency(product?.sellPrice) : toCurrency(product?.sellPriceGros)}</td>
                      <td>{facture.mode === "Détail" ? toCurrency(product?.sellPrice * product?.selectedQuantity) : toCurrency(product?.sellPriceGros * product?.selectedQuantity)}</td>
                      <td>
                        <button
                          className=" p-1.5"
                          onClick={(e) => {
                            const UpdatedProducts = useStore.getState().facture.selectedProducts.filter((prod) => product._id !== prod._id);
                            useStore.setState((state) => ({ facture: { ...state.facture, selectedProducts: UpdatedProducts } }));
                            setTotalFacture();
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
              Facture N°:<span className="text-green-600"> {vendingsData.length + 1} </span>
            </div>
            <div>
              Produits:<span className="text-green-600"> {facture.selectedProducts.length}</span>
            </div>
          </div>
          <div id="validation" className="flex gap-2 items-center p-2 ">
            <div className="bg-emerald-600 shrink-0 hover:bg-emerald-400 p-4">
              <button
                ref={addQtyBtn}
                onClick={() => {
                  const UpdatedProducts = useStore
                    .getState()
                    .facture.selectedProducts.map((product) =>
                      product._id === indexRow && product.quantity > product.selectedQuantity && product.selectedQuantity >= 1
                        ? { ...product, selectedQuantity: parseFloat(product.selectedQuantity) + 1 }
                        : product
                    );
                  useStore.setState((state) => ({ facture: { ...state.facture, selectedProducts: UpdatedProducts } }));
                  setTotalFacture();
                }}
                className="text-xl  text-white gap-2 rounded-sm items-center flex">
                <span>Qté</span>
                <img src={add} className="w-10" />
              </button>
            </div>
            <div className="bg-red-600 shrink-0 hover:bg-red-400 p-4">
              <button
                ref={subQtyBtn}
                onClick={() => {
                  const UpdatedProducts = useStore
                    .getState()
                    .facture.selectedProducts.map((product) =>
                      product._id === indexRow && product.quantity > product.selectedQuantity && product.selectedQuantity > 1
                        ? { ...product, selectedQuantity: parseFloat(product.selectedQuantity) - 1 }
                        : product
                    );
                  useStore.setState((state) => ({ facture: { ...state.facture, selectedProducts: UpdatedProducts } }));
                  setTotalFacture();
                }}
                className="text-xl  text-white gap-2 rounded-sm items-center flex">
                <span>Qté</span>
                <img src={minus} className="w-10" />
              </button>
            </div>
            <div className="bg-green-500 shrink-0 hover:bg-green-700 p-[9px]">
              <button
                ref={validateBtn}
                onClick={() => {
                  if (facture.isEdit === true) {
                    // update vending List
                    ipcRenderer.send("updateVending", {
                      ...facture,
                      autoCompleteObj: {},
                      totalbuyPrice: facture.selectedProducts.reduce((acc, cur) => acc + cur.buyPrice * cur.selectedQuantity, 0).toFixed(2),
                      grid: facture.selectedProducts,
                    });
                    ipcRenderer.on("refreshGridVending:update", (e, res) => {
                      store?.set("activity", [
                        ...store?.get("activity"),
                        {
                          date: new Date(),
                          page: "Facture",
                          action: "modifier",
                          title: "Facture Modifier",
                          item: JSON.parse(res),
                          user: store?.get("user")?.userName,
                          role: store?.get("user")?.isAdmin ? "Administrateur" : "Employée",
                        },
                      ]);
                      loadVendings();
                      useStore.setState({ toast: { show: true, title: "Vente Modifier Avec Succés", type: "success" } });
                      setTimeout(() => {
                        useStore.setState({ toast: { show: false } });
                      }, 2000);
                      facture.selectedProducts.forEach((prod) => {
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
                      if (facture.oldClient._id != facture.client._id) {
                        customersData.forEach((customer) => {
                          if (customer._id === facture.oldClient._id) {
                            ipcRenderer.send("updateCustomer", { _id: facture.oldClient._id, credit: (parseInt(customer.credit) - parseInt(facture.oldAmount - facture.oldDeposit)).toFixed(2) });
                          }
                          // add credit to new Client
                          if (customer._id === facture.client._id && facture.client.name != "Standard") {
                            ipcRenderer.send("updateCustomer", {
                              _id: facture.client._id,
                              credit: (parseInt(customer.credit) + parseInt(facture.amount - facture.deposit)).toFixed(2),
                            });
                          }
                        });
                        ipcRenderer.on("refreshGridCustomer:update", (e, res) => {
                          loadCustomers();
                          ipcRenderer.removeAllListeners("refreshGridCustomer:update");
                        });
                      }
                      // client didnt change
                      if (facture.client.name != "Standard" && facture.oldClient._id === facture.client._id) {
                        customersData.forEach((customer) => {
                          if (customer._id === facture.client._id) {
                            ipcRenderer.send("updateCustomer", {
                              _id: facture.client._id,
                              credit: parseInt(customer.credit) - parseInt(facture.oldAmount - facture.oldDeposit) + parseInt(facture.amount - facture.deposit),
                            });
                            ipcRenderer.on("refreshGridCustomer:update", (e, res) => {
                              loadCustomers();
                              ipcRenderer.removeAllListeners("refreshGridCustomer:update");
                            });
                          }
                        });
                      }

                      ipcRenderer.removeAllListeners("refreshGridVending:update");
                    });
                  } else {
                    // add new vending
                    facture.amount != 0 &&
                      ipcRenderer.send("addVending", {
                        time: new Date(),
                        index: vendingsData.length + 1,
                        paymentType: facture.paymentType,
                        client: { name: facture.client.name, _id: facture.client._id, credit: facture.client.credit },
                        type: "facture",
                        mode: facture.mode,
                        tva: facture.tva,
                        rebate: facture.rebate.toFixed(2),
                        deposit: facture.deposit.toFixed(2),
                        amount: facture.amount.toFixed(2),
                        total: facture.total.toFixed(2),
                        totalbuyPrice: facture.selectedProducts.reduce((acc, cur) => acc + cur.buyPrice * cur.selectedQuantity, 0).toFixed(2),
                        grid: facture.selectedProducts,
                      });
                    ipcRenderer.on("refreshGridVending:add", (e, res) => {
                      store?.set("activity", [
                        ...store?.get("activity"),
                        {
                          date: new Date(),
                          page: "Facture",
                          action: "ajouter",
                          item: JSON.parse(res),
                          title: "Nouvelle Facture Ajouter",
                          user: store?.get("user")?.userName,
                          role: store?.get("user")?.isAdmin ? "Administrateur" : "Employée",
                        },
                      ]);
                      useStore.setState({ toast: { show: true, title: "Vente Ajouter Avec Succés", type: "success" } });
                      setTimeout(() => {
                        useStore.setState({ toast: { show: false } });
                      }, 2000);
                      loadVendings();
                      facture.selectedProducts.forEach((prod) => {
                        // quantity update
                        productsList.forEach((curProduct) => {
                          if (curProduct._id === prod._id) {
                            ipcRenderer.send("updateProduct", {
                              _id: prod._id,
                              quantity: parseInt(prod.quantity) - parseInt(prod.selectedQuantity),
                            });
                          }
                        });
                      });
                      if (facture.client.name != "Standard" && facture.amount - facture.deposit > 0) {
                        customersData.forEach((customer) => {
                          if (customer._id === facture.client._id) {
                            // add credit
                            ipcRenderer.send("updateCustomer", { _id: facture.client._id, credit: (parseInt(customer.credit) + parseInt(facture.amount - facture.deposit)).toFixed(2) });
                            ipcRenderer.on("refreshGridCustomer:update", (e, res) => {
                              loadCustomers();
                              ipcRenderer.removeAllListeners("refreshGridCustomer:update");
                            });
                          }
                        });
                      }

                      ipcRenderer.removeAllListeners("refreshGridVending:add");
                    });
                  }

                  ipcRenderer.on("refreshGridProduct:update", (e, res) => {
                    loadProducts();
                    ipcRenderer.removeAllListeners("refreshGridProduct:update");
                  });
                  useStore.setState((state) => ({
                    facture: { mode: "Détail", client: { name: "Standard" }, amount: 0, tva: 0, total: 0, rebate: 0, deposit: 0, selectedProducts: [], selectedProduct: null },
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
            <div className="bg-lime-500 shrink-0 hover:bg-lime-700 p-[9px]">
              <button ref={printBtn} className="text-xl  text-white gap-2 rounded-sm items-center flex" onClick={() => setShowPrintDiv(false)}>
                <div className="flex flex-col">
                  <span>Imprimer</span>
                  <span className="text-base">(F2)</span>
                </div>
                <img src={print} className="w-10" />
              </button>
            </div>
            <div className="bg-rose-500 shrink-0 hover:bg-rose-700 p-[9px]">
              <button
                ref={deleteBtn}
                onClick={() => {
                  useStore.setState((state) => ({ facture: { ...state.facture, selectedProducts: [] } }));
                  setTotalFacture();
                }}
                className="text-xl  text-white gap-2 rounded-sm items-center flex">
                <div className="flex flex-col">
                  <span>Suprimer</span>
                  <span className="text-base">(Suppr)</span>
                </div>
                <img src={deletePng} className="w-10" />
              </button>
            </div>
          </div>
        </div>
        <ProductFormPopUp title={title} />
        <div ref={gridRef} className={`${showPrintDiv && "hidden"} `}>
          <PrintInvoice />
        </div>
      </div>
    </div>
  );
}
