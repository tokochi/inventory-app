import { GridComponent, ColumnsDirective, ColumnDirective, Reorder, Selection, Resize, Inject, Edit, Sort, Filter } from "@syncfusion/ej2-react-grids";
import { useStore, loadCustomers, loadVendings, loadProducts } from "../contexts/Store";
import TextBox from "../component/button/TextBox";
import { InPlaceEditorComponent } from "@syncfusion/ej2-react-inplace-editor";
import { useHotkeys } from "react-hotkeys-hook";
import React, { useState, useRef, useEffect } from "react";
import Store from "electron-store";
import "moment/locale/fr";
import moment from "moment/min/moment-with-locales";
import add from "./../data/icons/add.png";
import minus from "./../data/icons/minus.png";
import plus from "./../data/icons/plus.png";
import minus2 from "./../data/icons/minus2.png";
import print from "./../data/icons/print.png";
import done from "./../data/icons/done.png";
import deletePng from "./../data/icons/delete.png";
import newPng from "./../data/icons/new.png";
import styled from "styled-components";
import { TextBoxComponent } from "@syncfusion/ej2-react-inputs";
import { AutoCompleteComponent } from "@syncfusion/ej2-react-dropdowns";
moment.locale("fr");
loadCustomers();
loadVendings();

const Wrapper = styled.div`
  & .e-ddl.e-input-group.e-control-wrapper .e-input {
    padding-left: 0.5rem;
    margin: 0;
    padding-right: 0.5rem;
    background-color: rgb(249 250 251 / 1);
    padding-top: 0rem;
    padding-bottom: 0rem;
    font-size: 22px;
    font-weight: 400;
    line-height: 1.5715;
    color: rgb(71 85 105 / 1);
  }
  & .e-input-group:not(.e-success):not(.e-warning):not(.e-error):not(.e-float-icon-left) {
    padding-top: 0.5rem;
  }
`;
export default function Caisse() {
  const [date, setDate] = useState(new Date());
  const [amount, setAmount] = useState(25000);
  const [rebate, setRebate] = useState(0);
  const [total, setTotal] = useState(0);
  const productsData = () => useStore((state) => state.products).filter((product) => !useStore.getState().caisse.selectedProducts.some((selected) => selected._id === product._id));
  const mode = () => useStore((state) => state.caisse.mode);
  const customersData = () => useStore((state) => state.customers);
  const selectedProducts = () => useStore((state) => state.caisse.selectedProducts);
  const vendingsData = () => useStore((state) => state.vendings);
    const editing = { allowDeleting: true, allowEditing: true, allowAdding: true, mode: "Normal" };

  const normalButton =
    "inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border border-slate-200 hover:border-slate-300 shadow-sm bg-white text-slate-500 duration-150 ease-in-out";

  function addSelectedProducts(e) {
    e.value != null && useStore.setState((state) => ({ caisse: { ...state.caisse, selectedProduct: e.itemData } }));
  }
  function addSelectedProductstoGrid() {
    if (useStore.getState().caisse.selectedProduct != null) {
      useStore.setState((state) => ({
        caisse: {
          ...state.caisse,
          selectedProducts: [...state.caisse.selectedProducts, { ...state.caisse.selectedProduct, selectedQuantity: 1, index: state.caisse.selectedProducts.length + 1 }],
        },
      }));
      useStore.getState().caisse.autoCompleteObj.clear();
      useStore.setState((state) => ({ caisse: { ...state.caisse, selectedProduct: null } }));
    }
  }
  useHotkeys("f3", addSelectedProductstoGrid);
  const totalTemplate = (props) => <div id="total">{props.selectedQuantity * props.sellPrice}.00DA</div>;
  const quantityTemplate = (props) => (
    <div id="selectedQuantity" className="flex  justify-around items-center z-60">
      <span>{props.selectedQuantity}</span>
      <div>
        <button
          className="hover:bg-slate-300 p-1"
          onClick={(e) => {
            e.stopPropagation();
            const UpdatedProducts = useStore
              .getState()
              .caisse.selectedProducts.map((product) =>
                product._id === props._id && product.quantity > product.selectedQuantity ? { ...product, selectedQuantity: product.selectedQuantity + 1 } : product
              );

            useStore.setState((state) => ({ caisse: { ...state.caisse, selectedProducts: UpdatedProducts } }));
          }}>
          <img src={plus} className="w-5 " />
        </button>
        <button
          className="hover:bg-slate-300 p-1"
          onClick={(e) => {
            e.stopPropagation();
            const UpdatedProducts = useStore
              .getState()
              .caisse.selectedProducts.map((product) =>
                product._id === props._id && product.selectedQuantity>1 ? { ...product, selectedQuantity: product.selectedQuantity - 1 } : product
              );

            useStore.setState((state) => ({ caisse: { ...state.caisse, selectedProducts: UpdatedProducts } }));
          }}>
          <img src={minus2} className="w-5" />
        </button>
      </div>
    </div>
  );
  const productsTemplate = (props) => (
    <table>
      <tbody>
        <tr>
          <td>📦</td>
          <td className="text-slate-600 font-medium text-lg min-w-[250px]">{props?.name}</td>
          <td className="text-xs">
            <div className={normalButton}>
              Quantité: <span className="text-green-600 ml-1">{props?.quantity}</span>
            </div>
          </td>
          <td className="text-xs">
            <div className={normalButton}>
              Prix Vente: <span className="text-green-600 ml-1">{mode() === "Détail" ? props?.sellPrice : props?.sellPriceGros}.00DA</span>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  );
  useEffect(() => {
    setInterval(() => setDate(new Date()), 1000);
  }, []);

  function actionComplete(args) {
   console.log("🚀 ~ file: Caisse.jsx ~ line 134 ~ actionComplete ~ args", args)
   // console.log("🚀  grid.getCurrentViewRecords();", useStore.getState().grid.getCurrentViewRecords());
    switch (true) {
      case args.requestType === "save" && args.action === "add":
        // ipcRenderer.send("addCustomer", args.data);
        // ipcRenderer.on("refreshGridCustomer:add", (e, res) => {
        //   loadCustomers();
        // });
        break;
      case args.requestType === "beginEdit":
        // args.dialog.header = "Modifier un Client";
        break;
      case args.requestType === "save" && args.action === "edit":
        
        // ipcRenderer.send("updateCustomer", args.data);
        // ipcRenderer.on("refreshGridCustomer:update", (e, res) => {
        //   loadCustomers();
        // });
        break;
      case args.requestType === "add":
        // args.dialog.header = "Ajouter un Client";
        break;
      case args.requestType === "delete":
        // ipcRenderer.on("refreshGridCustomer:delete", (e, res) => {
        //   loadCustomers();
        // });
        break;
    }
  }

  return (
    <div className="bg-white m-2 shadow-lg rounded-sm  relative overflow-hidden">
      <div className="flex">
        <div className="min-w-[380px] p-2">
          <div id="option" className="flex items-center mb-2">
            <span className="px-4  text-sm font-medium">Mode Vente:</span>
            <TextBox
              type="dropdown"
              id="brand"
              width="w-[200px]"
              value={mode()}
              onChange={(e) => e.value != null && useStore.setState((state) => ({ caisse: { ...state.caisse, mode: e.value } }))}
              dataSource={["Détail", "Gros"]}
              popupHeight="200px"
              title="Mode Vente"
            />
          </div>
          <div className="flex items-center gap-[41px]">
            <span className="px-4  text-sm font-medium">Client:</span>
            <TextBox type="dropdown" id="brand" width="w-[200px]" value="Détail" dataSource={["Détail", "Gros"]} popupHeight="200px" title="Mode Vente" />
          </div>
          <div id="favori" className=" ">
            
          </div>
        </div>
        <div className="w-full bg-slate-700 select-none">
          <div id="black_screen" className="flex  bg-black rounded-sm  ">
            <div id="info_screen" className="text-xl text-white p-3 ">
              <div id="date" className="flex items-center gap-6 mb-4 min-w-[350px] ">
                <span className="text-2xl w-[100px]">{moment(date).format("HH:mm:ss")}</span>
                <span>{moment().format("dddd, D MMMM YYYY")}</span>
              </div>
              <div id="date" className="flex items-center gap-10 mb-4">
                <div>
                  Vente N°:<span className="text-green-600"> {vendingsData.length + 1} </span>
                </div>
                <div>
                  Produits:<span className="text-green-600"> {useStore.getState().caisse.selectedProducts.length}</span>
                </div>
              </div>
            </div>
            <div id="total_screen" className="mx-4 ">
              <div className="text-xl text-white">Total</div>
              <div className="text-green-600 text-8xl select-none">{amount}.00</div>
            </div>
          </div>
          <Wrapper>
            <div id="selectProduct" className="m-4 flex  text-white">
              <button
                onClick={() => {
                  addSelectedProductstoGrid();
                }}>
                <svg className="w-12 hover:opacity-80" viewBox="0 0 48 48">
                  <path fill="#7db382" d="M20,38.5C9.799,38.5,1.5,30.201,1.5,20S9.799,1.5,20,1.5S38.5,9.799,38.5,20S30.201,38.5,20,38.5z" />
                  <path fill="#5e9c76" d="M20,2c9.925,0,18,8.075,18,18s-8.075,18-18,18S2,29.925,2,20S10.075,2,20,2 M20,1 C9.507,1,1,9.507,1,20s8.507,19,19,19s19-8.507,19-19S30.493,1,20,1L20,1z" />
                  <path fill="#fff" d="M10 18H30V22H10z" />
                  <path fill="#fff" d="M10 18H30V22H10z" transform="rotate(90 20 20)" />
                </svg>
              </button>
              <AutoCompleteComponent
                ref={(g) => useStore.setState((state) => ({ caisse: { ...state.caisse, autoCompleteObj: g } }))}
                id="vegetables"
                autofill
                ignoreCase
                showPopupButton
                width="300"
                showClearButton
                allowCustom
                //customValueSpecifier={(e) => console.log(e)}
                change={(e) => {
                  e.value != null && addSelectedProducts(e);
                }}
                valueTemplate={productsTemplate}
                itemTemplate={productsTemplate}
                dataSource={productsData()}
                fields={{ value: "name", text: "name" }}
                placeholder="Ajouter un Produit (F5)"
              />
            </div>
          </Wrapper>
          <div id="grid" className="h-[400px] bg-white border border-slate-200">
            <GridComponent
              ref={(g) => useStore.setState((state) => ({ caisse: { ...state.caisse, grid: g } }))}
              dataSource={selectedProducts()}
              enableHover={false}
              allowKeyboard
              editSettings={editing}
              actionComplete={(props) => actionComplete(props)}
              allowSorting>
              <ColumnsDirective>
                <ColumnDirective field="index" headerText="N°" allowEditing={false} textAlign="center" headerTextAlign="center" width="30" />
                <ColumnDirective field="name" headerText="Désignation" allowEditing={false} textAlign="center" headerTextAlign="center" width="100" />
                <ColumnDirective
                  field="selectedQuantity"
                  headerText="Quantité"
                  editType="numericedit"
                  textAlign="center"
                  headerTextAlign="center"
                  width="40"
                  format="n0"
                />
                <ColumnDirective field="sellPrice" headerText="Prix Unitaire" allowEditing={false} textAlign="center" headerTextAlign="center" width="50" format="c2" />
                <ColumnDirective field="total" headerText="Montant" textAlign="center" allowEditing={false} headerTextAlign="center" width="50" format="c2" template={totalTemplate} />
              </ColumnsDirective>
              <Inject services={[Resize, Selection, Reorder, Edit, Sort, Filter]} />
            </GridComponent>
          </div>
          <div id="validation" className="flex gap-2 items-center p-2">
            <div className="bg-emerald-600 hover:bg-emerald-400 p-4">
              <button className="text-xl  text-white gap-2 rounded-sm items-center flex">
                <span>Qté</span>
                <img src={add} className="w-10" />
              </button>
            </div>
            <div className="bg-red-600 hover:bg-red-400 p-4">
              <button className="text-xl  text-white gap-2 rounded-sm items-center flex">
                <span>Qté</span>
                <img src={minus} className="w-10" />
              </button>
            </div>
            <div className="bg-green-500 hover:bg-green-700 p-[9px]">
              <button className="text-xl  text-white gap-2 rounded-sm items-center flex">
                <div className="flex flex-col">
                  <span>Valider</span>
                  <span className="text-base">(F1)</span>
                </div>
                <img src={done} className="w-10" />
              </button>
            </div>
            <div className="bg-lime-500 hover:bg-lime-700 p-[9px]">
              <button className="text-xl  text-white gap-2 rounded-sm items-center flex">
                <div className="flex flex-col">
                  <span>Imprimer</span>
                  <span className="text-base">(F2)</span>
                </div>
                <img src={print} className="w-10" />
              </button>
            </div>
            <div className="bg-rose-500 hover:bg-rose-700 p-[9px]">
              <button className="text-xl  text-white gap-2 rounded-sm items-center flex">
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
    </div>
  );
}
