import Store from "electron-store";
import moment from "moment/min/moment-with-locales";
import React from "react";
import { ToWords } from "to-words";
import { useStore } from "../contexts/Store";



export default function PrintInvoiceCaisse() {
  const vendingsData = useStore((state) => state.vendings);
  const caisse = useStore((state) => state.caisse);
  const schema = {
    company: {
      type: "object",
    },
  };
  const store = new Store({ schema });
  function toCurrency(num) {
    let str = "0.00DA";
    if (num != null && !isNaN(num)) {
      str = num?.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      str = str.replace(",", " ");
    }
    return str;
  }
  const toWords = new ToWords({
    localeCode: "fr-FR",
    converterOptions: {
      currency: false,
      ignoreDecimal: false,
      ignoreZeroCurrency: false,
      doNotAddOnly: false,
    },
  });
  return (
    <div className={`p-1 relative font-sans h-full w-[58mm] bg-white`}>
      <div id="title" className="flex items-center flex-col">
        <span className="text-[15px] w-full font-mono text-center border-b-[1.5px] border-dashed  border-gray-900  uppercase">{store?.get("company")?.name}</span>

        <span className="font-mono w-full text-[12px]  text-center uppercase border-b-[1.5px] border-dashed  border-gray-900 ">
          {"Ticket:" + "0"}
          {caisse.index || parseInt(vendingsData.length + 1)}/{new Date().getFullYear()}
        </span>
      </div>
      <table className="mt-2 w-full text-[10px] border-b-[1px] border-dashed  border-gray-900">
        <thead className=" uppercase w-full font-normal  border-b-[1.5px] border-dashed  border-gray-900">
          <tr>
            <th className=" first:pl-2 last:pr-2 ">
              <div className="font-semibold">Qte</div>
            </th>
            <th className="px-2 ">
              <div className="font-semibold text-center">Produit</div>
            </th>
            <th className="px-2 first:pl-2 last:pr-2  ">
              <div className="font-semibold text-center">PUHT</div>
            </th>
            <th className="px-2 first:pl-2 last:pr-2">
              <div className="font-semibold text-center">Total</div>
            </th>
          </tr>
        </thead>
        <tbody className="uppercase ">
          {caisse.selectedProducts.map((product, index) => (
            <tr className="text-center " key={product._id}>
              <td className="w-[5mm] font-semibold text-center">{product?.selectedQuantity}</td>
              <td className="w-[35mm] font-semibold text-left">{product?.name}</td>
              <td className="w-[10mm] text-right font-semibold">{toCurrency(product?.sellPrice)}</td>
              <td className="w-[10mm] text-right font-semibold">{toCurrency(product?.sellPrice * product?.selectedQuantity)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <table>
        <tbody className="uppercase font-normal text-xs">
          <tr className=" ">
            <td className="w-[15mm] font-mono text-[10px]">{caisse.selectedProducts.reduce((accS, curS) => accS + parseInt(curS.selectedQuantity), 0)} ART</td>
            <td className="w-[35mm] font-mono text-left text-[10px]">total a payer:</td>
            <td className="w-[20mm] font-bold text-[11px] text-right  ">{toCurrency(caisse.amount)}</td>
          </tr>
        </tbody>
      </table>
      <div className="flex flex-col text-[10px] font-mono">
        <div id="comapnyInfo" className="flex gap-2 ">
          <span className="font-mono">Le: </span>
          <span className=" "> {moment(caisse.time).format("D/M/yyyy HH:mm:ss")}</span>
        </div>
        <div id="comapnyInfo" className="flex gap-2">
          <span className="font-mono uppercase">CLIENT: </span>
          <span className="uppercases ">{caisse.client.name}</span>
        </div>
        {caisse.client.name !== "Standard" && (
          <div id="comapnyInfo" className="flex gap-2">
            <span className="uppercase">vérsement: </span>
            <span className=" uppercases ">{toCurrency(caisse.deposit)}</span>
          </div>
        )}
        <div id="comapnyInfo" className="flex gap-2">
          <span className="">VENDEUR: </span>
          <span className=""> {store?.get("user").name}</span>
        </div>
        <div id="comapnyInfo" className="flex gap-2">
          <span className="">CAISSE N°: </span>
          <span className=""> {store?.get("user")?.caisse}</span>
        </div>
        <div id="comapnyInfo" className="flex flex-col w-full  text-center uppercase">
          <span>merci pour votre visit</span>
          <span>bienvenue a tout moment</span>
          <span>Tél:{store?.get("company").phone.toString()?.match(/.{2}/g)?.join(" ")}</span>
        </div>
      </div>
    </div>
  );
}
