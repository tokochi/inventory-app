import React, { useState, useEffect } from "react";
import facebook from "../../data/icons/facebook.png";
import logo from "../../data/icons/logo.png";
import card from "../../data/icons/visit.png";
import Store from "electron-store";
import Animation from "../animation";
export default function Company() {
  const schema = {
    company: {
      type: "object",
      default: {
        userName: "AMIN HAMIDI",
        address: "Hay Bensouna Nouvelle Ville",
        email: "Email@gmail.Com",
        phone: "05 40 22 27 82",
        fax: "027 78 78 78",
        site: "www.minishop-dz.com",
        name: "MiniShop Bensouna",
        facebook: "MiniShop Bensouna",
      },
    },
  };
  const [refresh, setRefresh] = useState(false);
  const store = new Store({ schema });

  return (
    <div className="grow overflow-y-auto h-[600px] ">
      <div className="p-6">
        <h2 className="text-2xl text-slate-800 font-bold ">Entreprise</h2>
          <Animation visible={true} from={{ x: 0, y: -400, opacity: 0 }} enter={{ x: 0, y: 0, opacity: 1 }} leave={{}}>
        <section className="flex  items-center justify-center">
          <div className="relative shrink-0 ">
            <img className="w-[700px] bg-transparent drop-shadow-md rounded-3xl" src={card} />
            <input
              id="name"
              onChange={(e) => {
                const temp = store.get("company");
                e.target.value != null && store.set("company", { ...temp, userName: e.target.value });
                setRefresh(!refresh);
              }}
              value={store?.get("company")?.userName}
              className="p-0 w-[300px] border-none  absolute font-semibold bg-transparent  text-2xl top-[40px] capitalize left-[70px] z-10"
              type="text"
            />
            <textarea
              id="name"
              onChange={(e) => {
                const temp = store.get("company");
                e.target.value != null && store.set("company", { ...temp, address: e.target.value });
                setRefresh(!refresh);
              }}
              value={store?.get("company")?.address}
              className="p-0 w-[250px] border-none absolute bg-transparent  text-lg top-[100px] capitalize left-[120px] z-10"
              type="text"
            />
            <input
              id="name"
              onChange={(e) => {
                const temp = store.get("company");
                e.target.value != null && store.set("company", { ...temp, email: e.target.value });
                setRefresh(!refresh);
              }}
              value={store?.get("company")?.email}
              className="p-0 w-[250px] border-none absolute bg-transparent  text-lg top-[180px] capitalize left-[120px] z-10"
              type="text"
            />
            <input
              id="name"
              onChange={(e) => {
                const temp = store.get("company");
                e.target.value != null && store.set("company", { ...temp, phone: e.target.value });
                setRefresh(!refresh);
              }}
              value={store?.get("company")?.phone}
              className="p-0 w-[250px] border-none absolute bg-transparent text-lg top-[240px] capitalize left-[120px] z-10"
              type="text"
            />
            <input
              id="name"
              onChange={(e) => {
                const temp = store.get("company");
                e.target.value != null && store.set("company", { ...temp, fax: e.target.value });
                setRefresh(!refresh);
              }}
              value={store?.get("company")?.fax}
              className="p-0 w-[250px] border-none absolute bg-transparent text-lg top-[260px] capitalize left-[120px] z-10"
              type="text"
            />
            <input
              id="name"
              onChange={(e) => {
                const temp = store.get("company");
                e.target.value != null && store.set("company", { ...temp, site: e.target.value });
                setRefresh(!refresh);
              }}
              value={store?.get("company")?.site}
              className="p-0 w-[250px] border-none absolute bg-transparent text-lg top-[320px]  left-[120px] z-10"
              type="text"
            />
            <input
              id="name"
              onChange={(e) => {
                const temp = store.get("company");
                e.target.value != null && store.set("company", { ...temp, name: e.target.value });
                setRefresh(!refresh);
              }}
              value={store?.get("company")?.name}
              className="p-0 w-[250px] border-none absolute bg-transparent text-center text-2xl font-semibold text-white top-[150px]  left-[420px] z-10"
              type="text"
            />
            <div className="flex gap-2 top-[350px] absolute left-[470px]">
              <img className="w-[30px] h-[30px]" src={facebook} />
              <input
                id="name"
                onChange={(e) => {
                  const temp = store.get("company");
                  e.target.value != null && store.set("company", { ...temp, facebook: e.target.value });
                  setRefresh(!refresh);
                }}
                value={store?.get("company")?.facebook}
                className="p-0 w-[150px] border-none bg-transparent text-center text-white z-10"
                type="text"
              />
            </div>
            <div className="absolute bg-transparent top-[50px]  left-[480px] ">
              <label htmlFor="dropzone-file" className="flex flex-col justify-center items-center h-20 p-4 bg-transparent rounded-lg  border-gray-300 border-dashed cursor-pointer  hover:bg-gray-10">
                <div className="flex flex-col justify-center items-center pt-5 pb-4">
                  <img htmlFor="dropzone-file" className="w-[100px] h-[100px] rounded-full bg-contain" src={store?.get("company")?.logo || logo} width="80" height="80" alt="User upload" />
                </div>
                <input
                  id="dropzone-file"
                  onChange={(e) => {
                    const temp = store.get("company");
                    store.set("company", { ...temp, logo: e.target?.files[0]?.path });
                    setRefresh(!refresh);
                  }}
                  type="file"
                  accept="image/*"
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </section>
</Animation>
        <section>
          <h2 className="text-xl leading-snug text-slate-800 font-bold mt-5">Informations Financière</h2>
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
