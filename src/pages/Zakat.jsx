import React, { useState } from "react";
import TextBox from "../component/button/TextBox";
import { useStore } from "../contexts/Store";
import Header from "./../component/layout/Header";
export default function Zakat() {
  const vendingsData = useStore((state) => state.vendings);
  const productsData = useStore((state) => state.products);
  const customersData = useStore((state) => state.customers);
  const providersData = useStore((state) => state.providers);
  const depenseData = useStore((state) => state.depenses);
  const depenseTotal = depenseData.reduce((acc, cur) => acc + cur.amount, 0);
  const providerCredit = providersData.reduce((acc, cur) => acc + cur.credit, 0);
  const customerCredit = customersData.reduce((acc, cur) => acc + cur.credit, 0);
  const total = productsData.reduce((acc, cur) => acc + cur.sellPrice * cur.quantity, 0);
  const [amount, setAmount] = useState(0);
  const [credit, setCredit] = useState(0);
  const totalZakat = parseInt(total) + parseInt(amount) + parseInt(customerCredit) - parseInt(providerCredit) - parseInt(credit);
const toCurrency = useStore((state) => state.toCurrency);
  return (
    <>
      <Header title="El-Zakat ☪" />
      <div className="bg-slate-700  shadow-lg rounded-sm border border-slate-200 relative mx-10">
        <div className="flex gap-2">
          <div id="left" className="p-4 shrink-0 flex-0">
            <div className="flex flex-col gap-4 mb-4 rounded-sm border border-slate-200 p-2">
              <div className="flex gap-2 items-center justify-between ">
                <span className="text-white text-xl font-semibold">رأس المال بسعر التجزئة : </span>
                <TextBox type="number" readonly showSpinButton={false} format="N2" label="DA" id="credit" width="w-[200px]" value={total} step={100} min={0} title="رأس المال بسعر التجزئة" />
              </div>
              <div className="flex gap-2 items-center justify-between">
                <span className="text-white text-xl font-semibold">رأس المال نقدا :</span>
                <TextBox
                  type="number"
                  format="N2"
                  label="DA"
                  id="amount"
                  width="w-[200px]"
                  onChange={(e) => {
                    e.value != null && setAmount(e.value);
                  }}
                  step={100}
                  min={0}
                  title="رأس المال نقدا"
                />
              </div>
              <div className="flex gap-2 items-center justify-between">
                <span className="text-white text-xl font-semibold">ديون الزبائن :</span>
                <TextBox type="number" readonly showSpinButton={false} format="N2" label="DA" id="credit" width="w-[200px]" value={customerCredit} step={100} min={0} title="Montant Avance" />
              </div>
              <div className="flex gap-2 items-center justify-between">
                <span className="text-white text-xl font-semibold">ديون الموردين :</span>
                <TextBox type="number" readonly showSpinButton={false} format="N2" label="DA" id="credit" width="w-[200px]" value={providerCredit} step={100} min={0} title="Montant Avance" />
              </div>
              <div className="flex gap-2 items-center justify-between">
                <span className="text-white text-xl font-semibold">ديون أخرى :</span>
                <TextBox
                  type="number"
                  format="N2"
                  label="DA"
                  id="amount"
                  width="w-[200px]"
                  onChange={(e) => {
                    e.value != null && setCredit(e.value);
                  }}
                  step={100}
                  min={0}
                  title="ديون أخرى"
                />
              </div>
            </div>
            <div className="flex flex-col gap-4 rounded-sm border border-slate-200 p-2">
              <div className="flex gap-2 items-center justify-between">
                <span className="text-white text-xl font-semibold">المبلغ الاجمالي :</span>
                <TextBox type="number" readonly showSpinButton={false} format="N2" label="DA" id="credit" width="w-[200px]" value={totalZakat} step={100} min={0} title="Montant Avance" />
              </div>
              <div className="flex gap-2 items-center ">
                <span className="text-white text-xl font-semibold mr-20">مقدار الزكاة :</span>
                <div className="text-2xl font-bold  text-emerald-500 pl-2 ">{toCurrency(totalZakat * 0.025)}</div>
              </div>
            </div>
          </div>
          <div id="right" className="rounded-sm  border border-slate-200 p-2 m-4">
            <div className="text-white text-xl flex flex-col items-center gap-10">
              <span className=" font-semibold ">: كيفية حساب المبلغ الاجمالي</span>
              <span className="text-center ">قيمة السلعة (بسعر السوق) + رأس المال نقدا + الديون المنتظر سدادها + ما على التاجر من ديون</span>
              <span className=" font-semibold ">: كيفية حساب المبلغ الواجب اخراجه للزكاة</span>
              <span className=" ">المبلغ الاجمالي x 2.5%</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
