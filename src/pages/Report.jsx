import React, { useState, useRef, useEffect } from "react";
import { DateRangePickerComponent } from "@syncfusion/ej2-react-calendars";
import {
  ChartComponent,
  Inject,
  LineSeries,
  ColumnSeries,
  DateTime,
  DateTimeCategory,
  SeriesCollectionDirective,
  SeriesDirective,
  Category,
  Legend,
  DataLabel,
  Tooltip,
} from "@syncfusion/ej2-react-charts";
import { useStore } from "../contexts/Store";
import { TooltipComponent } from "@syncfusion/ej2-react-popups";
import moment from "moment";

export default function Report() {
  const normalButton =
    "inline-flex text-left items-center justify-between text-sm font-medium leading-5 rounded-full px-2  border border-slate-200 hover:border-slate-300 shadow-sm bg-white text-slate-500 duration-150 ease-in-out";
  const [date, setDate] = useState([]);
  const vendingsData = useStore((state) => state.vendings).filter((vente) => (date?.length > 0 ? new Date(date[0]) < new Date(vente.time) && new Date(vente.time) < new Date(date[1]) : vente));
  const productsData = useStore((state) => state.products);
  const customersData = useStore((state) => state.customers);
  const providersData =  useStore((state) => state.providers);
  const buyingData = useStore((state) => state.buyings).filter((vente) => (date?.length > 0 ? new Date(date[0]) < new Date(vente.time) && new Date(vente.time) < new Date(date[1]) : vente));
  const buyingQuantity = useStore((state) => state.buyings).reduce((acc, buying) => acc + buying.grid.reduce((accu, product) => accu+parseInt(product.selectedQuantity),0),0);
  const buyingTotal = buyingData.reduce((acc, cur) => acc + cur.amount, 0);
  const providerCredit = providersData.reduce((acc, cur) => acc + cur.credit, 0);
  const total = vendingsData.reduce((acc, cur) => acc + cur.amount, 0);
  const totalRemise = vendingsData.reduce((acc, cur) => acc + cur.rebate, 0);
  const NumRemise = vendingsData.reduce((acc, cur) => acc + (cur.rebate > 0 && 1), 0);
  const totalCredit = customersData.reduce((acc, cur) => acc + cur.credit, 0);
  const totalQty = vendingsData.reduce((acc, cur) => acc + cur.grid.reduce((accS, curS) => accS + curS.selectedQuantity, 0), 0);
  const productsQty = productsData.reduce((acc, cur) => acc + cur.quantity, 0);
  const average = total / vendingsData?.length || 0;
  const averageBuy = buyingTotal / buyingData?.length || 0;
  const totalBuyPrice = vendingsData.reduce((acc, cur) => acc + cur.totalbuyPrice, 0);
  const prodTotalSellPrice = productsData.reduce((acc, cur) => acc + cur.sellPrice * cur.quantity, 0);
  const prodTotalSellPriceGros = productsData.reduce((acc, cur) => acc + cur.sellPriceGros * cur.quantity, 0);
  const prodTotalBuyPrice = productsData.reduce((acc, cur) => acc + cur.buyPrice * cur.quantity, 0);
  const margin = (total - totalBuyPrice) / total || 0;
  const marginProducts = (prodTotalSellPrice - prodTotalBuyPrice) / prodTotalSellPrice || 0;
  const marginCredit = (total - totalCredit) / total || 1;
  const marginCreditSupplier = (prodTotalBuyPrice - providerCredit) / prodTotalBuyPrice || 1;
  const marginRemise = (total - totalRemise) / total || 1;
  const averageProducts = prodTotalBuyPrice / productsQty || 0;
  const dataSource = getMonthlySales().sort((objA, objB) => Number(objA.month) - Number(objB.month));

  function getTopProducts() {
    const count = vendingsData.reduce((acc, actual) => acc.concat(actual["grid"] || []), []);
    const sumPerQuantity = count.reduce((acc, cur) => {
      acc[cur.name] = parseInt(acc[cur.name]) + parseInt(cur.selectedQuantity) || parseInt(cur.selectedQuantity);
      return acc;
    }, {});
    const sortable = Object.entries(sumPerQuantity)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => parseInt(b.value) - parseInt(a.value))
      .slice(0, 5);
    return sortable;
  }
 
  function getMonthlySales() {
    const mapDayToMonth = vendingsData.map((vente) => ({ ...vente, day: moment(vente.time).format("L") }));
    const sumPerMonth = mapDayToMonth.reduce((acc, cur) => {
      acc[cur.day] = acc[cur.day] + parseInt(cur.amount) || parseInt(cur.amount);
      return acc;
    }, {});
    const result = Object.keys(sumPerMonth).map((e) => ({ month: new Date(e), value: sumPerMonth[e] }));
    return result;
  }
  function toCurrency(num) {
    let str = num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + "DA";
    str = str.replace("DZD", "DA");
    // str = str.replace(",", " ");
    return str;
  }
  return (
    <div className="p-5 ">
      <div className="mb-4  flex  justify-end">
        <div className="w-[300px] border-slate-200  border rounded-l hover:border-slate-300 focus:border-indigo-300 shadow-sm">
          <DateRangePickerComponent
            id="date"
            name="date"
            firstDayOfWeek={6}
            // startDate={moment().subtract(1, "year")._d}
            // endDate={moment()._d}
            width="300"
            //value={date}
            onChange={(e) => setDate(e.value)}
            placeholder="Choisir Période"
            format="dddd MMMM y"
            floatLabelType="Never"
          />
        </div>
      </div>
      <div id="cards" className="grid grid-cols-1 gap-5 ">
        <div className="grid grid-cols-4 gap-6">
          <div id="card1" className="flex min-w-[300px]  bg-white shadow-lg rounded-sm border border-slate-200">
            <div className="pl-5 py-2 flex ">
              <div className="">
                <h2 className="text-lg text-center font-semibold  text-slate-800">Clients</h2>
                <hr className="w-full mb-4" />
                <div className="flex gap-2 flex-col mb-4 justify-center">
                  <div className={normalButton}>
                    Nombre Total Clients:<span className="text-green-600 ml-2">{customersData.length}</span>
                  </div>
                  <div className={normalButton}>
                    Moyenne Achat Client:<span className="text-green-600 ml-2">{toCurrency(average)}</span>
                  </div>
                </div>
                <div className="text-xs font-semibold text-slate-400 uppercase mb-1">Total Crédit Client</div>
                <div className="flex items-start">
                  <div className="text-3xl font-bold text-slate-800 pl-2 mr-2">{totalCredit.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}DA</div>
                  <div className={`text-sm font-[500] text-center text-white px-1.5 ${marginCredit === 1 ? "bg-emerald-500" : "bg-rose-500"}  rounded-full`}>
                    {(marginCredit * 100 - 100).toFixed(2)}%
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div id="card2" className="flex min-w-[300px] bg-white shadow-lg rounded-sm border border-slate-200">
            <div className="pl-5 py-2 flex ">
              <div className="">
                <h2 className="text-lg text-center font-semibold  text-slate-800">Remises</h2>
                <hr className="w-full mb-4" />
                <div className="flex gap-2 flex-col mb-4 justify-center">
                  <div className={normalButton}>
                    Nombre Total Remise:<span className="text-green-600 ml-2">{NumRemise}</span>
                  </div>
                  <div className={normalButton}>
                    Moyenne Remise Client:<span className="text-green-600 ml-2">{toCurrency(totalRemise / NumRemise || 0)}</span>
                  </div>
                </div>
                <div className="text-xs font-semibold text-slate-400 uppercase mb-1">Total Remise</div>
                <div className="flex items-start">
                  <div className="text-3xl font-bold text-slate-800 pl-2 mr-2">{toCurrency(totalRemise)}</div>
                  <div className={`text-sm font-[500] text-center text-white px-1.5 ${marginRemise === 1 ? "bg-emerald-500" : "bg-rose-500"} rounded-full`}>
                    {(marginRemise * 100 - 100).toFixed(2)}%
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div id="card3" className="flex min-w-[300px] bg-white shadow-lg rounded-sm border border-slate-200">
            <div className="pl-5 py-2 flex ">
              <div className="">
                <h2 className="text-lg text-center font-semibold  text-slate-800">Fournisseurs</h2>
                <hr className="w-full mb-4" />
                <div className="flex gap-2 flex-col mb-4 justify-center">
                  <div className={normalButton}>
                    Nombre Total Fournisseurs:<span className="text-green-600 ml-2">{providersData.length}</span>
                  </div>
                  <div className={normalButton}>
                    Quantité Produits Achter:<span className="text-green-600 ml-2">{buyingQuantity}</span>
                  </div>
                </div>
                <div className="text-xs font-semibold text-slate-400 uppercase mb-1">Total Crédit Fournisseurs</div>
                <div className="flex items-start">
                  <div className="text-3xl font-bold text-slate-800 pl-2 mr-2">{toCurrency(providerCredit)}</div>
                  <div className={`text-sm font-[500] text-center text-white px-1.5  bg-rose-500 rounded-full`}>{(marginCreditSupplier * 100 - 100).toFixed(2)}%</div>
                </div>
              </div>
            </div>
          </div>
          <div id="card4" className="flex min-w-[300px] bg-white shadow-lg rounded-sm border border-slate-200">
            <div className="pl-5 py-2 flex ">
              <div className="">
                <h2 className="text-lg text-center font-semibold  text-slate-800">Achats</h2>
                <hr className="w-full mb-4" />
                <div className="flex gap-2 flex-col mb-4 justify-center">
                  <div className={normalButton}>
                    Nombre Total Achat:<span className="text-green-600 ml-2">{buyingData.length}</span>
                  </div>
                  <div className={normalButton}>
                    Moyenne Achat :<span className="text-green-600 ml-2">{toCurrency(averageBuy)}</span>
                  </div>
                </div>
                <div className="text-xs font-semibold text-slate-400 uppercase mb-1">Total Achats</div>
                <div className="flex items-start">
                  <div className="text-3xl font-bold text-slate-800 pl-2 mr-2">{buyingTotal.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}DA</div>
                  {/* <div className={`text-sm font-[500] text-center text-white px-1.5  bg-rose-500 rounded-full`}>{(marginCredit * 100 - 100).toFixed(2)}%</div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div id="longCard1" className="flex  bg-white shadow-lg rounded-sm border border-slate-200">
          <div className="pl-5 py-2 flex w-[330px]">
            <div className="">
              <h2 className="text-lg text-center font-semibold  text-slate-800">Revenues</h2>
              <hr className="w-full mb-4" />
              <div className="flex gap-2 flex-col mb-4 justify-center">
                <div className={normalButton}>
                  Nombre Total Ventes:<span className="text-green-600 ml-2">{vendingsData.length}</span>
                </div>
                <div className={normalButton}>
                  Quantité Produits Vendu:<span className="text-green-600 ml-2">{totalQty}</span>
                </div>
                <div className={normalButton}>
                  Chiffre D'affaires Ventes:
                  <span className="text-green-600 ml-2">{toCurrency(total)}</span>
                </div>
                <div className={normalButton}>
                  Total Achats des Ventes:<span className="text-green-600 ml-2">{toCurrency(totalBuyPrice)}</span>
                </div>

                <div className={normalButton}>
                  Moyenne par Vente:<span className="text-green-600 ml-2">{toCurrency(average)}</span>
                </div>
              </div>
              <div className="text-xs font-semibold text-slate-400 uppercase mb-1">Bénifice</div>
              <div className="flex items-start">
                <div className="text-3xl font-bold text-slate-800 pl-2 mr-2">{toCurrency(total - totalBuyPrice)}</div>
                {!isNaN(margin) && (
                  <div className={`text-sm font-[500] text-center text-white px-1.5 ${Math.sign(margin) === 1 ? "bg-emerald-500" : "bg-amber-500"}   rounded-full`}>
                    {Math.sign(margin) === 1 ? "+" + parseInt(margin * 100) : parseInt(margin * 100)}%
                  </div>
                )}
              </div>
            </div>
          </div>
          <div id="chart1" className="p-2 flex-1 overflow-x-auto">
            <ChartComponent
              height="300"
              title="Analyse des Ventes"
              // width="1000"
              primaryXAxis={{
                valueType: "DateTime",
                minimum: date != null && date[0],
                labelFormat: "d MMM",
                //interval: 2,
                labelStyle: { color: "rgb(71 85 105)", fontWeight: "600", fontSize: "14px" },
                maximum: date != null && date[1],
                //intervalType: "Months",
                edgeLabelPlacement: "Hide",
                majorGridLines: { width: 0 },
              }}
              primaryYAxis={{ title: "Ventes", labelStyle: { color: "rgb(71 85 105)", fontWeight: "600", fontSize: "14px" }, labelFormat: "C2" }}
              tooltip={{ enable: true }}>
              <Inject services={[LineSeries, Category, DataLabel, DateTime, DateTimeCategory, Tooltip]}></Inject>
              <SeriesCollectionDirective>
                <SeriesDirective dataSource={dataSource} xName="month" yName="value" type="Line" name="Ventes" marker={{ dataLabel: { visible: false }, visible: true }}></SeriesDirective>
              </SeriesCollectionDirective>
            </ChartComponent>
          </div>
        </div>
        <div id="longCard2" className="flex  bg-white shadow-lg rounded-sm border border-slate-200">
          <div className="pl-5 py-2 flex w-[330px]">
            <div className="">
              <h2 className="text-lg text-center font-semibold  text-slate-800">Stock</h2>
              <hr className="w-full mb-4" />
              <div className="flex gap-2 flex-col mb-4 justify-center">
                <div className={normalButton}>
                  Nombre Total Produits:<span className="text-green-600 ml-2">{productsData.length}</span>
                </div>
                <div className={normalButton}>
                  Quantité Total Produits:<span className="text-green-600 ml-2">{productsQty}</span>
                </div>
                <div className={normalButton}>
                  Capital Achat Stock:
                  <span className="text-green-600 ml-2">{toCurrency(prodTotalBuyPrice)}</span>
                </div>
                <div className={normalButton}>
                  Chiffre D'affaires Stock:
                  <span className="text-green-600 ml-2">{toCurrency(prodTotalSellPrice)}</span>
                </div>
                {/* <div className={normalButton}>
                  Total Gros Produits:<span className="text-green-600 ml-2">{prodTotalSellPriceGros.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}DA</span>
                </div> */}
                <div className={normalButton}>
                  Moyenne Achat Produit:<span className="text-green-600 ml-2">{toCurrency(averageProducts)}</span>
                </div>
              </div>
              <div className="text-xs font-semibold text-slate-400 uppercase mb-1">Bénifice Stock</div>
              <div className="flex items-start">
                <div className="text-3xl font-bold text-slate-800 pl-2 mr-2">{toCurrency(prodTotalSellPrice - prodTotalBuyPrice)}</div>
                {!isNaN(marginProducts) && (
                  <div className={`text-sm font-[500] text-center text-white px-1.5 ${Math.sign(marginProducts) === 1 ? "bg-emerald-500" : "bg-amber-500"}   rounded-full`}>
                    {Math.sign(marginProducts) === 1 ? "+" + parseInt(marginProducts * 100) : parseInt(marginProducts * 100)}%
                  </div>
                )}
              </div>
            </div>
          </div>
          <div id="chart2" className=" p-2 flex-1 overflow-x-auto">
            <ChartComponent
              height="300"
              title="Top 5 Produits Vendu"
              primaryXAxis={{
                valueType: "Category",
                labelStyle: { color: "rgb(71 85 105)", fontWeight: "600", fontSize: "14px" },
                edgeLabelPlacement: "Hide",
                majorGridLines: { width: 0 },
              }}
              primaryYAxis={{ title: "Quantité", labelStyle: { color: "rgb(71 85 105)", fontWeight: "600", fontSize: "14px" }, labelFormat: "n0" }}
              tooltip={{ enable: true }}>
              <Inject services={[ColumnSeries, Category, DataLabel, DateTime, DateTimeCategory, Tooltip]}></Inject>
              <SeriesCollectionDirective>
                <SeriesDirective dataSource={getTopProducts()} xName="name" yName="value" type="Column" name="Ventes" marker={{ dataLabel: { visible: true }, visible: true }}></SeriesDirective>
              </SeriesCollectionDirective>
            </ChartComponent>
          </div>
        </div>
      </div>
    </div>
  );
}
