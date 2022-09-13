import Store from "electron-store";
import moment from "moment/min/moment-with-locales";
import React from "react";
import { ToWords } from "to-words";
import { useStore } from "../../contexts/Store";

export default function PrintInvoiceFacture() {
  const vendingsData = useStore((state) => state.vendings);
  const facture = useStore((state) => state.facture);
  const schema = {
    company: {
      type: "object",
    },
  };
  const store = new Store({ schema });
  const toCurrency = useStore((state) => state.toCurrency);
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
    <div className={`p-10 relative font-sans h-[297mm] w-[210mm] bg-white`}>
      <div className="flex justify-between">
        <div id="title" className="flex flex-col">
          <span className="text-xl font-semibold">
            {"Facture N° " + " 00"}
            {facture.index || parseInt(vendingsData.length + 1)} / {new Date().getFullYear()}
          </span>
          <div className="text-md font-semibold mt-2">
            N°RC:
            <span className="text-md font-normal ml-2">{store?.get("company")?.rc}</span>
          </div>
          <div className="font-semibold">
            N°IF:
            <span className="font-normal ml-2">{store?.get("company")?.if}</span>
          </div>
        </div>
        <div id="comapnyInfo" className="flex flex-col mt-4">
          <span className="font-semibold">{store?.get("company")?.name}</span>
          <span className="">{store?.get("company")?.address}</span>
          <span className="">Tél:{store?.get("company")?.phone?.toString()?.match(/.{2}/g)?.join(" ")}</span>
        </div>
      </div>
      <div className="flex justify-between mb-4">
        {facture.client.name != "Standard" && (
          <div id="title" className="flex gap-2 font-semibold">
            Facture À:
            <div className="flex flex-col">
              <span className="font-normal">{facture.client.name}</span>
              <span className="font-normal">{facture.client?.phone?.toString()?.match(/.{2}/g)?.join(" ")}</span>
            </div>
          </div>
        )}
        <div id="comapnyInfo" className="flex gap-2 mt-4 ">
          <span className="font-semibold">Le: </span>
          {moment(facture.time).format("D/M/yyyy")}
        </div>
      </div>
      <table className="table-auto w-full  divide-slate-200 border ">
        <thead className="text-xs uppercase text-center text-slate-600 bg-slate-50 border-t border-slate-200">
          <tr>
            <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
              <div className="font-semibold text-center">N°</div>
            </th>
            <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
              <div className="font-semibold text-center">Designation</div>
            </th>
            <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
              <div className="font-semibold text-center">Qte</div>
            </th>
            <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
              <div className="font-semibold text-center">Prix Vente U</div>
            </th>
            <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
              <div className="font-semibold text-center">Montant</div>
            </th>
          </tr>
        </thead>
        <tbody>
          {facture.selectedProducts.map((product, index) => (
            <tr className="text-center " key={product._id}>
              <td className=" p-2">{"#" + parseInt(index + 1)}</td>
              <td>{product?.name}</td>
              <td>{product?.selectedQuantity}</td>
              <td>{toCurrency(product?.sellPrice)}</td>
              <td>{toCurrency(product?.sellPrice * product?.selectedQuantity)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex mt-4 justify-end items-end mr-8">
        <table>
          <tbody>
            <tr>
              <td className="font-semibold w-[120px]">Total HT</td>
              <td className="text-right">{toCurrency(facture.total)}</td>
            </tr>
            <tr>
              <td className="font-semibold">Remise</td>
              <td className=" text-right">{toCurrency(facture.rebate)}</td>
            </tr>
            <tr>
              <td className="font-semibold">Versement</td>
              <td className="text-right">{toCurrency(facture.deposit)}</td>
            </tr>
            <tr>
              <td className="font-semibold">TVA</td>
              <td className="text-right">{facture.tva}%</td>
            </tr>
            <tr className="border-t border-slate-400">
              <td className="font-semibold  pt-4"> Total TTC</td>
              <td className="pt-4 text-right">{toCurrency(facture.amount)}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="mr-4 text-xs flex flex-col">
        Arrêtée la présente facture à la somme de : <span className="">{toWords.convert(facture.amount)} Dinars</span>
      </div>
      <div className="font-semibold absolute bottom-[150px] left-[150px]">Signature </div>
    </div>
  );
}
