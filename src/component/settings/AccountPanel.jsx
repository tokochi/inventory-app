import React, { useState, useEffect } from "react";
import Image from "../../data/icons/user.png";
import { DatePickerComponent } from "@syncfusion/ej2-react-calendars";
import { loadCustomers, loadVendings, loadProducts, useStore } from "../../contexts/Store";
import Store from "electron-store";
import { v4 as uuidv4 } from "uuid";
import add from "./../../data/icons/add.png";
import deletePng from "./../../data/icons/delete.png";
import edit from "./../../data/icons/edit.png";
import { Link, useNavigate } from "react-router-dom";
import PopupDialog from "../dialog/PopupDialog";

export default function AccountPanel() {
  const schema = {
    user: { default: {pages:[]}, type: "object" },
    users: {
      type: "array",
      default: [],
    },
  };
   const navigate = useNavigate();
  const store = new Store({ schema });
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [refresh, setRefresh] = useState(false);

  const users = store?.get("users");
  console.log("🚀 ~ file: AccountPanel.jsx ~ line 27 ~ AccountPanel ~ users", users)

  return (
    <div className="grow">
      <div className=" p-6 space-y-6">
        <h2 className="text-2xl text-slate-800 font-bold mb-5">Mon Compte</h2>
        <div className="flex gap-10">
          <section>
            <div className="p-4 font-semibold w-[300px] text-lg text-slate-600 rounded-t-md border border-slate-300  bg-slate-200 ">Photo de profile</div>
            <div className="w-[300px] border text-center shadow-md border-slate-300">
              <div className="flex gap-5 items-center justify-between p-2">
                <div className="">
                  <img className="w-[100px] h-[100px] rounded-full bg-contain" src={store?.get("user")?.logo || Image} width="80" height="80" alt="User upload" />
                </div>
                <div className="flex p-2 items-center ">
                  <label
                    htmlFor="dropzone-file"
                    className="flex flex-col justify-center items-center h-[115px] p-4 bg-gray-50 rounded-lg border-2 border-gray-300 border-dashed cursor-pointer  hover:bg-gray-10">
                    <div className="flex flex-col justify-center items-center pt-5 pb-6">
                      <svg aria-hidden="true" className="mb-3 w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                      </svg>
                      <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">Changer Photo</p>
                    </div>
                    <input
                      id="dropzone-file"
                      onChange={(e) => {
                        const temp = store.get("user");
                        store.set("user", { ...temp, logo: e.target.files[0].path });
                        const temparray = users.filter((user) => user.userName !== temp.userName);
                        store.set("users", [...temparray, { ...temp, logo: e.target.files[0].path }]);
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
          <section className="max-w-[600px] overflow-auto">
            <div className=" ">
              <div className="p-4 font-semibold  text-lg text-slate-600 rounded-t-md border border-slate-300  bg-slate-200 ">Liste Utilisateurs</div>
              <div className=" border text-center shadow-md border-slate-300">
                <div className="flex overflow-auto gap-5 items-center justify-between p-2">
                  {store?.get("users").map((user) => (
                    <div key={uuidv4()} className="border border-slate-300  p-2">
                      <div className="flex items-center justify-between">
                        <div key={uuidv4()} className="w-20 relative">
                          <img className="w-[80px] h-[80px] rounded-full bg-contain" src={user?.logo || Image} width="80" height="80" />
                          {user.userName === store.get("user").userName && <div className="absolute top-0 right-0 w-4 h-4 animate-pulse bg-emerald-500 border-2 border-white rounded-full"></div>}
                        </div>
                        <div key={uuidv4()} className="flex flex-col p-2 items-center text-slate-600">
                          <span className="font-semibold">{user.userName}</span>
                          <span className="text-sm italic">Administrateur</span>
                          <span className="">{user.email}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-end gap-4 ">
                        <button
                          id={user}
                          disabled={user.userName === store.get("user").userName}
                          onClick={(e) => {
                            const temparray = users.filter((cur) => cur.userName !== user.userName);
                            store.set("users", temparray);
                            setRefresh(!refresh);
                          }}
                          className="btn bg-indigo-500  hover:bg-indigo-600 text-white ">
                          <img className="w-[20px] h-[20px] " src={deletePng} />
                        </button>
                        {/* <PopupDialog
                          id="addBrand"
                          close={close}
                          header="Pages Autorisé"
                          width="330px"
                          bg="bg-indigo-500"
                          svg={
                            <svg className="w-[20px] h-[20px]  text-white shrink-0" viewBox="0 0 24 24">
                              <path
                                d="M18.414062 2C18.158188 2 17.902031 2.0974687 17.707031 2.2929688L16 4L20 8L21.707031 6.2929688C22.098031 5.9019687 22.098031 5.2689063 21.707031 4.8789062L19.121094 2.2929688C18.925594 2.0974687 18.669937 2 18.414062 2 z M 14.5 5.5L3 17L3 21L7 21L18.5 9.5L14.5 5.5 z"
                                fill="#fff"
                              />
                            </svg>
                          }>
                          <table className="table-auto w-full">
                            <tbody>
                              <tr className="border-b border-slate-200">
                                <td className="flex flex-col justify-center">
                                  <span className="text-slate-800 text-lg font-semibold">Ventes</span>
                                  <span className="text-slate-800 text-sm italic">ajouter, supprimer, modifier</span>
                                </td>
                                <td className="">
                                  <div className="form-switch">
                                    <input
                                      type="checkbox"
                                      id="comments"
                                      className="sr-only"
                                      onChange={() => {
                                        const temp = store.get("user");
                                        const filtredPages = temp.pages.filter((page) => page !== "vente");
                                        e.target.checked? store.set("user", { ...temp, pages: [...temp.pages, "vente"] }) : store.set("user", { ...temp, pages: filtredPages });
                                        const temparray = users.filter((user) => user.userName !== temp.userName);
                                       e.target.checked
                                         ? store.set("users", [...temparray, { ...temp, pages: [...temp.pages, "vente"] }])
                                         : store.set("users", [...temparray, { ...temp, pages: filtredPages }]);
                                      }}
                                    />
                                    <label className="bg-slate-400" htmlFor="comments">
                                      <span className="bg-white shadow-sm" aria-hidden="true"></span>
                                    </label>
                                  </div>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </PopupDialog> */}
                      </div>
                    </div>
                  ))}
                  <div className="">
                    <button onClick={() => navigate("/add")} className="btn bg-indigo-500 w-[50px] h-[50px] hover:bg-indigo-600 text-white">
                      <img className="w-[30px] h-[30px] " src={add} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
        <section>
          <div className="sm:flex sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mt-5">
            <div className="sm:w-1/3">
              <label className="block text-sm font-medium mb-1" htmlFor="name">
                Nom d'utilisateur
              </label>
              <input
                id="name"
                onChange={(e) => {
                  const temp = store.get("user");
                  e.target.value != null && store.set("user", { ...temp, userName: e.target.value });
                  const temparray = users.filter((user) => user.userName !== temp.userName);
                  store.set("users", [...temparray, { ...temp, userName: e.target.value }]);
                  setRefresh(!refresh);
                }}
                value={store?.get("user")?.userName || "admin"}
                className="form-input w-full"
                type="text"
                required
              />
            </div>
            <div className="sm:w-1/3">
              <label className="block text-sm font-medium mb-1" htmlFor="business-id">
                Nom Complet
              </label>
              <input
                id="business-id"
                onChange={(e) => {
                  const temp = store.get("user");
                  e.target.value != null && store.set("user", { ...temp, name: e.target.value });
                  const temparray = users.filter((user) => user.userName !== temp.userName);
                  store.set("users", [...temparray, { ...temp, name: e.target.value }]);
                  setRefresh(!refresh);
                }}
                value={store?.get("user")?.name}
                className="form-input w-full"
                type="text"
              />
            </div>
            <div className="sm:w-1/3">
              <label className="block text-sm font-medium mb-1" htmlFor="location">
                Date de naissance
              </label>
              <div className="border rounded border-slate-200 hover:border-slate-300 focus:border-indigo-300 shadow-sm">
                <DatePickerComponent
                  id="birthdate"
                  name="birthdate"
                  change={(e) => {
                    const temp = store.get("user");
                    e.value != null && store.set("user", { ...temp, birthdate: e.value });
                    const temparray = users.filter((user) => user.userName !== temp.userName);
                    store.set("users", [...temparray, { ...temp, birthdate: e.target.value }]);
                    setRefresh(!refresh);
                  }}
                  value={store?.get("user")?.birthdate}
                  format="dddd MMMM y"
                  floatLabelType="Never"></DatePickerComponent>
              </div>
            </div>
          </div>
        </section>
        <section>
          <div className="sm:flex sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mt-5">
            <div className="sm:w-1/3">
              <label className="block text-sm font-medium mb-1" htmlFor="name">
                Email
              </label>
              <input
                id="name"
                onChange={(e) => {
                  const temp = store.get("user");
                  e.target.value != null && store.set("user", { ...temp, email: e.target.value });
                  const temparray = users.filter((user) => user.userName !== temp.userName);
                  store.set("users", [...temparray, { ...temp, email: e.target.value }]);
                  setRefresh(!refresh);
                }}
                value={store?.get("user")?.email}
                className="form-input w-full"
                type="text"
              />
            </div>
            <div className="sm:w-1/3">
              <label className="block text-sm font-medium mb-1" htmlFor="business-id">
                Télephone
              </label>
              <input
                id="business-id"
                onChange={(e) => {
                  const temp = store.get("user");
                  e.target.value != null && store.set("user", { ...temp, phone: e.target.value });
                  const temparray = users.filter((user) => user.userName !== temp.userName);
                  store.set("users", [...temparray, { ...temp, phone: e.target.value }]);
                  setRefresh(!refresh);
                }}
                value={store?.get("user")?.phone}
                className="form-input w-full"
                type="text"
              />
            </div>
            <div className="sm:w-1/3">
              <label className="block text-sm font-medium mb-1" htmlFor="location">
                Addresse
              </label>
              <input
                id="location"
                onChange={(e) => {
                  const temp = store.get("user");
                  e.target.value != null && store.set("user", { ...temp, address: e.target.value });
                  const temparray = users.filter((user) => user.userName !== temp.userName);
                  store.set("users", [...temparray, { ...temp, address: e.target.value }]);
                  setRefresh(!refresh);
                }}
                value={store?.get("user")?.address}
                className="form-input w-full"
                type="text"
              />
            </div>
          </div>
        </section>
        <section>
          <h2 className="text-xl leading-snug text-slate-800 font-bold mb-1">Mot de passe</h2>

          <div className="mt-5">
            <button
              onClick={(e) => {
                setShowPassword(true);
              }}
              className={`btn ${showPassword && "hidden"} border-slate-200 shadow-sm text-indigo-500`}>
              Definir un nouveau mot de passe
            </button>
          </div>
          {showPassword && (
            <div className="flex gap-4">
              <div className="sm:w-1/3">
                <label className="block text-sm font-medium mb-1" htmlFor="name">
                  Mot de passe
                </label>
                <input
                  id="name"
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                  className="form-input w-full"
                  type="password"
                />
              </div>

              <div className="sm:w-1/3">
                <label className="block text-sm font-medium mb-1" htmlFor="name">
                  Confirmer le mot de passe
                </label>
                <input
                  id="name"
                  onChange={(e) => {
                    const users = store.get("users");
                    const temparray = users.filter((user) => user.userName !== temp.userName);
                    e.target.value === password && store.set("users", [...temparray, { ...temp, password: e.target.value }]);
                  }}
                  className="form-input w-full"
                  type="password"
                />
              </div>
            </div>
          )}
        </section>
      </div>
      <footer>
        <div className="flex flex-col px-6 py-5 border-t border-slate-200">
          <div className="flex self-end">
            <button
              onClick={(e) => {
                const user = store.get("user");
                store.set("user", { userName: user.userName });
                location.reload();
              }}
              // type="submit"
              className="btn border-slate-200 hover:border-slate-300 text-slate-600">
              Reset
            </button>
            <button
              type="submit"
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
