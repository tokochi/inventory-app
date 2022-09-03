import React, { useState, useEffect } from "react";
import Image from "../../data/icons/user.png";
import { DatePickerComponent } from "@syncfusion/ej2-react-calendars";
import { loadCustomers, loadVendings, loadProducts, useStore } from "../../contexts/Store";
import Store from "electron-store";

export default function Company() {
  const schema = { company: { type: "object" } };
  const store = new Store({ schema });
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [refresh, setRefresh] = useState(false);
  return (
    <div className="grow">
      <div className=" p-6 space-y-6">
        <h2 className="text-2xl text-slate-800 font-bold mb-5">Entreprise</h2>
        <section>
          <div className="p-4 font-semibold w-[300px] text-lg text-slate-600 rounded-t-md border border-slate-300  bg-slate-200 ">Logo de l'entreprise</div>
          <div className="w-[300px] border text-center shadow-md border-gray-300">
            <div className="flex gap-5 items-center justify-between p-2">
              <div className="">
                <img className="w-[100px] h-[100px] rounded-full bg-contain" src={store?.get("company")?.logo || Image} width="80" height="80" alt="User upload" />
              </div>
              <div className="flex p-2 items-center ">
                <label
                  htmlFor="dropzone-file"
                  className="flex flex-col justify-center items-center h-32 p-4 bg-gray-50 rounded-lg border-2 border-gray-300 border-dashed cursor-pointer  hover:bg-gray-10">
                  <div className="flex flex-col justify-center items-center pt-5 pb-6">
                    <svg aria-hidden="true" className="mb-3 w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                    </svg>
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">Changer Logo</p>
                  </div>
                  <input
                    id="dropzone-file"
                    onChange={(e) => {
                      const temp = store.get("company");
                      store.set("company", { ...temp, logo: e.target.files[0].path });
                      setRefresh(!refresh);
                    }}
                    type="file"
                    accept="image/*"
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>
        </section>
        <section>
          <h2 className="text-xl leading-snug text-slate-800 font-bold mb-1">Détails de l'èntreprise</h2>
          <div className="flex items-center  space-x-4 mt-5">
            <div className="w-1/3">
              <label className="block text-sm font-medium mb-1" htmlFor="name">
                Nom de l'èntreprise
              </label>
              <input
                id="name"
                onChange={(e) => {
                  const temp = store.get("company");
                  e.target.value != null && store.set("company", { ...temp, userName: e.target.value });
                  setRefresh(!refresh);
                }}
                value={store?.get("company")?.userName}
                className="form-input w-full"
                type="text"
              />
            </div>
            <div className="w-1/3">
              <label className="block text-sm font-medium mb-1" htmlFor="name">
                Email
              </label>
              <input
                id="name"
                onChange={(e) => {
                  const temp = store.get("company");
                  e.target.value != null && store.set("company", { ...temp, email: e.target.value });
                  setRefresh(!refresh);
                }}
                value={store?.get("company")?.email}
                className="form-input w-full"
                type="text"
              />
            </div>
            <div className="w-1/3">
              <label className="block text-sm font-medium mb-1" htmlFor="business-id">
                Télephone
              </label>
              <input
                id="business-id"
                onChange={(e) => {
                  const temp = store.get("company");
                  e.target.value != null && store.set("company", { ...temp, phone: e.target.value });
                  setRefresh(!refresh);
                }}
                value={store?.get("company")?.phone}
                className="form-input w-full"
                type="text"
              />
            </div>
          </div>
        </section>
        <section>
          <div className="flex items-center  space-x-4 mt-5">
            <div className="w-1/3">
              <label className="block text-sm font-medium mb-1" htmlFor="location">
                Addresse
              </label>
              <input
                id="location"
                onChange={(e) => {
                  const temp = store.get("company");
                  e.target.value != null && store.set("company", { ...temp, address: e.target.value });
                  setRefresh(!refresh);
                }}
                value={store?.get("company")?.address}
                className="form-input w-full"
                type="text"
              />
            </div>
            <div className="w-1/3">
              <label className="block text-sm font-medium mb-1" htmlFor="business-id">
                Facebook
              </label>
              <input
                id="business-id"
                onChange={(e) => {
                  const temp = store.get("company");
                  e.target.value != null && store.set("company", { ...temp, facebook: e.target.value });
                  setRefresh(!refresh);
                }}
                value={store?.get("company")?.facebook}
                className="form-input w-full"
                type="text"
              />
            </div>
            <div className="w-1/3">
              <label className="block text-sm font-medium mb-1" htmlFor="location">
                Fax
              </label>
              <input
                id="location"
                onChange={(e) => {
                  const temp = store.get("company");
                  e.target.value != null && store.set("company", { ...temp, fax: e.target.value });
                  setRefresh(!refresh);
                }}
                value={store?.get("company")?.fax}
                className="form-input w-full"
                type="text"
              />
            </div>
          </div>
        </section>
        <section>
          <h2 className="text-xl leading-snug text-slate-800 font-bold mb-1">Informations Financière</h2>
          <div className="flex items-center  space-x-4 mt-5">
            <div className="w-1/3">
              <label className="block text-sm font-medium mb-1" htmlFor="location">
                N°RC
              </label>
              <input
                id="location"
                onChange={(e) => {
                  const temp = store.get("company");
                  e.target.value != null && store.set("company", { ...temp, rc: e.target.value });
                  setRefresh(!refresh);
                }}
                value={store?.get("company")?.rc}
                className="form-input w-full"
                type="text"
              />
            </div>
            <div className="w-1/3">
              <label className="block text-sm font-medium mb-1" htmlFor="location">
                N°IF
              </label>
              <input
                id="location"
                onChange={(e) => {
                  const temp = store.get("company");
                  e.target.value != null && store.set("company", { ...temp, if: e.target.value });
                  setRefresh(!refresh);
                }}
                value={store?.get("company")?.if}
                className="form-input w-full"
                type="text"
              />
            </div>
          </div>
        </section>
        <section>
          <div className="flex items-center  space-x-4 mt-5">
            <div className="w-1/3">
              <label className="block text-sm font-medium mb-1" htmlFor="location">
                CCP
              </label>
              <input
                id="location"
                onChange={(e) => {
                  const temp = store.get("company");
                  e.target.value != null && store.set("company", { ...temp, ccp: e.target.value });
                  setRefresh(!refresh);
                }}
                value={store?.get("company")?.ccp}
                className="form-input w-full"
                type="text"
              />
            </div>
            <div className="w-1/3">
              <label className="block text-sm font-medium mb-1" htmlFor="location">
                RIB
              </label>
              <input
                id="location"
                onChange={(e) => {
                  const temp = store.get("company");
                  e.target.value != null && store.set("company", { ...temp, rib: e.target.value });
                  setRefresh(!refresh);
                }}
                value={store?.get("company")?.rib}
                className="form-input w-full"
                type="text"
              />
            </div>
          </div>
        </section>
      </div>
      <footer>
        <div className="flex flex-col px-6 py-5 border-t border-slate-200">
          <div className="flex self-end">
            <button
              onClick={(e) => {
                store.set("company", {});
                location.reload();
              }}
              // type="submit"
              className="btn border-slate-200 hover:border-slate-300 text-slate-600">
              Reset
            </button>
            <button
              onClick={(e) => {
                window.location.reload();
              }}
              //  type="submit"
              className="btn bg-indigo-500 hover:bg-indigo-600 text-white ml-3">
              Sauvgarder
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
