import { GridComponent, ColumnsDirective, ColumnDirective, Reorder, Selection, Resize, Inject, Edit, Sort, Filter } from "@syncfusion/ej2-react-grids";
import { useStore, loadCustomers, loadVendings, loadProducts } from "../contexts/Store";
import TextBox from "../component/button/TextBox";
import add from "./../data/icons/add.png";
import React, { useState, useRef, useEffect } from "react";
import Store from "electron-store";
import "moment/locale/fr";
import moment from "moment/min/moment-with-locales";
import styled from "styled-components";
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
  const [amount, setAmoun] = useState(25000);
  // const [mode, setMode] = useState("Détail");
  const [rebate, setRebate] = useState(0);
  const productsData = () => useStore((state) => state.products);
  const mode = () => useStore((state) => state.mode);
  const customersData = () => useStore((state) => state.customers);
  const vendingsData = () => useStore((state) => state.vendings);
  const editing = { allowDeleting: true, allowEditing: true, allowAdding: true, mode: "Batch" };
  let autoCompleteObj;
  const normalButton =
    "inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border border-slate-200 hover:border-slate-300 shadow-sm bg-white text-slate-500 duration-150 ease-in-out";

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
 useEffect(() => {
   
 }, [mode]);

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
              onChange={(e) => e.value != null && useStore.setState({ mode: e.value })}
              dataSource={["Détail", "Gros"]}
              popupHeight="200px"
              title="Mode Vente"
            />
          </div>
          <div className="flex items-center gap-[41px]">
            <span className="px-4  text-sm font-medium">Client:</span>
            <TextBox type="dropdown" id="brand" width="w-[200px]" value="Détail" dataSource={["Détail", "Gros"]} popupHeight="200px" title="Mode Vente" />
          </div>
          <div id="favori" className=" "></div>
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
                  Produits:<span className="text-green-600"> 4</span>
                </div>
              </div>
            </div>
            <div id="total_screen" className="mx-4 ">
              <div className="text-xl text-white">Total</div>
              <div className="text-green-600 text-8xl select-none">{amount}.00</div>
            </div>
          </div>
          <Wrapper>
            <div id="selectProduct" className="m-4 flex gap-4 text-white">
              <button onClick={() => autoCompleteObj.refresh()}>
                <img src={add} width="40" />
              </button>
              <AutoCompleteComponent
                ref={(g) => (autoCompleteObj = g)}
                id="vegetables"
                autofill
                ignoreCase
                showPopupButton
                showClearButton
                allowCustom
                customValueSpecifier={(e) => console.log(e)}
                //change={(e) => console.log(autoCompleteObj)}
                valueTemplate={productsTemplate}
                itemTemplate={productsTemplate}
                dataSource={productsData()}
                fields={{ value: "name", text: "name" }}
                placeholder="List Produits"
              />
            </div>
          </Wrapper>
          <div id="grid" className=" "></div>
          <div id="validation" className=" "></div>
        </div>
      </div>
    </div>
  );
}
