import { SwitchComponent } from "@syncfusion/ej2-react-buttons";
import { DatePickerComponent } from "@syncfusion/ej2-react-calendars";
import Store from "electron-store";
import React, { useEffect, useState } from "react";
import TextBox from "../button/TextBox";
import { DialogComponent } from "@syncfusion/ej2-react-popups";
import {  useStore } from "../../contexts/Store";
import PopupDialog from "../dialog/PopupDialog";
import alarm from "./../../data/icons/alarm.png";
import deletePng2 from "./../../data/icons/delete2.png";


export default function ProductForm(props) {
  const labelclassName = "p-4 w-[170px] text-sm font-medium";
  const brandTemplate = (props) => (
    <div className="flex justify-between items-center">
      <div>{props.name}</div>
      <div>
        <button
          className=""
          onClick={(e) => {
            const temp = store?.get("brand").filter((brand) => brand.name !== props.name);
            store?.set("brand", temp);
          }}>
          <img src={deletePng2} width="15" />
        </button>
      </div>
    </div>
  );
  const unitTemplate = (props) => (
    <div className="flex justify-between items-center">
      <div>{props.name}</div>
      <div>
        <button
          className=""
          onClick={(e) => {
            const temp = store?.get("unit").filter((unit) => unit.name !== props.name);
            store?.set("unit", temp);
          }}>
          <img src={deletePng2} width="15" />
        </button>
      </div>
    </div>
  );
  const categoryTemplate = (props) => (
    <div className="flex justify-between items-center">
      <div>{props.name}</div>
      <div>
        <button
          className=""
          onClick={(e) => {
            const temp = store?.get("category").filter((category) => category.name !== props.name);
            store?.set("category", temp);
          }}>
          <img src={deletePng2} width="15" />
        </button>
      </div>
    </div>
  );
  const schema = {
    unit: { type: "array", default: [{ name: "U" }] },
    brand: { type: "array", default: [] },
    category: { type: "array", default: [] },
  };
  const store = new Store({ schema });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [close, setClose] = useState(false);
  const [notification, setNotification] = useState(true);
  const [name, setName] = useState(props?.name);
  const [barCode, setBarCode] = useState(props?.barCode);
  const [expireDate, setExpireDate] = useState(props?.expireDate);
  const [comment, setComment] = useState(props?.comment);
  const [unit, setUnit] = useState(props?.unit || "U");
  const [brand, setBrand] = useState(props?.brand || []);
  const [category, setCategory] = useState(props?.category || []);
  const [quantity, setQuantity] = useState(props?.quantity || null);
  const [qtyAlert, setQtyAlert] = useState(props?.qtyAlert);
  const [buyPrice, setBuyPrice] = useState(props?.buyPrice);
  const [sellPrice, setSellPrice] = useState(props?.sellPrice);
  const [sellPriceGros, setSellPriceGros] = useState(props?.sellPriceGros);
  const [expired, setExpired] = useState(false);
  const [addUnit, setAddUnit] = useState("");
  const [addBrand, setAddBrand] = useState("");
  const [addCategory, setAddCategory] = useState("");
  const [pin, setPin] = useState(false);
  const [auth, setAuth] = useState(false);
  const [wrongPin, setWrongPin] = useState(false);
  const unitList = store?.get("unit");
  const brandList = store?.get("brand");
  const gridProduct = useStore((state) => state.gridProduct);
  const categoryList = store?.get("category");
  const [margin, setMargin] = useState((sellPrice - buyPrice) / sellPrice);
  const [marginGros, setMarginGros] = useState((sellPriceGros - buyPrice) / sellPriceGros);
  useEffect(() => {
    setClose(false);
  }, [close]);
  return (
    <div>
      <table>
        <tbody>
          <tr>
            <td className={labelclassName}>Désignation:</td>
            <td className="w-[350px]">
              <TextBox
                type="text"
                id="name"
                width="full"
                onChange={(e) => {
                  e.value != null && setName(e.value);
                  gridProduct?.editModule?.editFormValidate();
                }}
                value={name}
                title="Désignation du Produit"
              />
            </td>
          </tr>
          <tr>
            <td className={labelclassName}>Code Barre:</td>
            <td className="w-[350px]">
              <TextBox type="number" format="N0" showSpinButton={false} id="barCode" width="w-full" onChange={(e) => e.value != null && setBarCode(e.value)} value={barCode} title="Code Barre" />
            </td>
          </tr>
          <tr>
            <td className={labelclassName}>Marque:</td>
            <td>
              <div className="flex gap-2">
                <TextBox
                  type="dropdown"
                  id="brand"
                  width="w-[200px]"
                  itemTemplate={brandTemplate}
                  value={brand}
                  fields={{ text: "name", value: "name" }}
                  onChange={(e) => e.value != null && setBrand(e.value)}
                  dataSource={store?.get("brand")}
                  popupHeight="200px"
                  title="Choisir la Marque"
                />
                <PopupDialog
                  id="addBrand"
                  close={close}
                  header="Ajouter une Marque"
                  width="330px"
                  bg="bg-white"
                  svg={
                    <svg className="w-4 h-4 fill-current text-indigo-500 shrink-0" viewBox="0 0 16 16">
                      <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
                    </svg>
                  }
                  footer={() => (
                    <div>
                      <ul className="flex items-center justify-end gap-6">
                        <li>
                          <button
                            className="btn-xs bg-indigo-500 hover:bg-indigo-600 text-white"
                            onClick={(e) => {
                              setClose(true);
                              if (addBrand.length > 0) {
                                brandList.push({ name: addBrand });
                                store.set("brand", [...new Set(brandList)]);
                              }
                            }}>
                            Ajouter
                          </button>
                        </li>
                        <li>
                          <button
                            className="btn-xs bg-white border-slate-200 hover:border-slate-300 text-slate-500 hover:text-slate-600"
                            onClick={(e) => {
                              setClose(true);
                            }}>
                            Annuler
                          </button>
                        </li>
                      </ul>
                    </div>
                  )}
                  content={() => (
                    <div>
                      <TextBox
                        type="text"
                        id="addBrand"
                        width="full"
                        onChange={(e) => {
                          setAddBrand(e.value);
                        }}
                        title="Nouvelle Marque"
                      />
                    </div>
                  )}></PopupDialog>
              </div>
            </td>
          </tr>
          <tr>
            <td className={labelclassName}>Unité:</td>
            <td>
              <div className="flex gap-2">
                <TextBox
                  type="dropdown"
                  id="unit"
                  width="w-[200px]"
                  value={unit}
                  itemTemplate={unitTemplate}
                  fields={{ text: "name", value: "name" }}
                  onChange={(e) => e.value != null && setUnit(e.value)}
                  dataSource={store?.get("unit")}
                  popupHeight="200px"
                  title="Choisir une Unité"
                />
                <PopupDialog
                  id="addUnit"
                  close={close}
                  header="Ajouter une Unité"
                  width="330px"
                  bg="bg-white"
                  svg={
                    <svg className="w-4 h-4 fill-current text-indigo-500 shrink-0" viewBox="0 0 16 16">
                      <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
                    </svg>
                  }
                  footer={() => (
                    <div>
                      <ul className="flex items-center justify-end gap-6">
                        <li>
                          <button
                            className="btn-xs bg-indigo-500 hover:bg-indigo-600 text-white"
                            onClick={() => {
                              setClose(true);
                              if (addUnit.length > 0) {
                                unitList.push({ name: addUnit });
                                store.set("unit", [...new Set(unitList)]);
                              }
                            }}>
                            Ajouter
                          </button>
                        </li>
                        <li>
                          <button
                            className="btn-xs bg-white border-slate-200 hover:border-slate-300 text-slate-500 hover:text-slate-600"
                            onClick={(e) => {
                              setClose(true);
                            }}>
                            Annuler
                          </button>
                        </li>
                      </ul>
                    </div>
                  )}
                  content={() => (
                    <div>
                      <TextBox
                        type="text"
                        id="addUnit"
                        width="full"
                        onChange={(e) => {
                          setAddUnit(e.value);
                        }}
                        title="Nouvelle Unité"
                      />
                    </div>
                  )}></PopupDialog>
              </div>
            </td>
          </tr>
          <tr>
            <td className={labelclassName}>Catégorie:</td>
            <td>
              <div className="flex gap-2">
                <TextBox
                  type="dropdown"
                  id="category"
                  width="w-[200px]"
                  value={category}
                  itemTemplate={categoryTemplate}
                  fields={{ text: "name", value: "name" }}
                  onChange={(e) => e.value != null && setCategory(e.value)}
                  dataSource={store?.get("category")}
                  popupHeight="200px"
                  title="Choisir la Catégorie"
                />
                <PopupDialog
                  id="addCategory"
                  close={close}
                  header="Ajouter une Catégorie"
                  width="330px"
                  bg="bg-white"
                  svg={
                    <svg className="w-4 h-4 fill-current text-indigo-500 shrink-0" viewBox="0 0 16 16">
                      <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
                    </svg>
                  }
                  footer={() => (
                    <div>
                      <ul className="flex items-center justify-end gap-6">
                        <li>
                          <button
                            className="btn-xs bg-indigo-500 hover:bg-indigo-600 text-white"
                            onClick={() => {
                              setClose(true);
                              if (addCategory.length > 0) {
                                categoryList.push({ name: addCategory });
                                store.set("category", [...new Set(categoryList)]);
                              }
                            }}>
                            Ajouter
                          </button>
                        </li>
                        <li>
                          <button
                            className="btn-xs bg-white border-slate-200 hover:border-slate-300 text-slate-500 hover:text-slate-600"
                            onClick={(e) => {
                              setClose(true);
                            }}>
                            Annuler
                          </button>
                        </li>
                      </ul>
                    </div>
                  )}
                  content={() => (
                    <div>
                      <TextBox
                        type="text"
                        id="addCategory"
                        width="full"
                        onChange={(e) => {
                          setAddCategory(e.value);
                        }}
                        title="Nouvelle Catégorie"
                      />
                    </div>
                  )}></PopupDialog>
              </div>
            </td>
          </tr>
          <tr>
            <td className={labelclassName}>Expiration:</td>
            <td className="w-[350px]">
              <div className="flex gap-2">
                <div className="border-slate-200 w-[177px]  border rounded-l hover:border-slate-300 focus:border-indigo-300 shadow-sm">
                  <DatePickerComponent
                    id="expired"
                    name="expired"
                    enabled={expired}
                    width="175"
                    onChange={(e) => e.value != null && setExpireDate(e.value)}
                    value={expireDate}
                    placeholder="Date d'expiration"
                    format="dddd MMMM y"
                    floatLabelType="Never"></DatePickerComponent>
                </div>{" "}
                <label className="flex items-center">
                  <input type="checkbox" className="form-checkbox " checked={expired} onChange={() => setExpired(!expired)} />
                </label>
              </div>
            </td>
          </tr>
          <tr>
            <td className={labelclassName}>Quantité:</td>
            <td>
              {store?.get("productPin") === false || auth === true || props.isAdd === true ? (
                <TextBox
                  type="number"
                  format="N0"
                  label={unit}
                  id="quantity"
                  width="w-[200px]"
                  step={5}
                  min={0}
                  value={quantity}
                  onChange={(e) => {
                    e.value != null && setQuantity(e.value);
                    gridProduct?.editModule?.editFormValidate();
                  }}
                  title="Quantité"
                />
              ) : (
                <div className="">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setDropdownOpen(true);
                    }}
                    className={`btn  border-slate-200 shadow-sm text-indigo-500`}>
                    besoin d'une autorisation 🔒
                  </button>
                </div>
              )}
            </td>
          </tr>
          <tr>
            <td className={labelclassName}>Quantité Alerté:</td>
            <td>
              <div className="flex gap-2 items-center">
                <TextBox
                  type="number"
                  format="N0"
                  width="w-[200px]"
                  enabled={quantity}
                  label={unit}
                  min={0}
                  step={5}
                  max={props.isAdd && quantity}
                  id="qtyAlert"
                  value={qtyAlert}
                  onChange={(e) => e.value != null && setQtyAlert(e.value)}
                  title="Quantité Alerté"
                />
                <img src={alarm} width="20" />
                <SwitchComponent id="notification" name="notification" value={notification} checked={notification} change={() => setNotification(!notification)}></SwitchComponent>
              </div>
            </td>
          </tr>
          <tr>
            <td className={labelclassName}>Prix d'achat:</td>
            <td>
              <TextBox
                type="number"
                format="N2"
                label="DA"
                min={0}
                // max={0}
                step={100}
                width="w-[200px]"
                id="buyPrice"
                value={buyPrice}
                onChange={(e) => {
                  gridProduct?.editModule?.editFormValidate();
                  e.value != null && setBuyPrice(e.value);
                  setMargin((sellPrice - e.value) / e.value);
                }}
                title="Prix d'achat"
              />
            </td>
          </tr>
          <tr>
            <td className={labelclassName}>Prix ​​de vente:</td>
            <td>
              <div className="flex gap-2">
                <TextBox
                  type="number"
                  format="N2"
                  label="DA"
                  width="w-[200px]"
                  id="sellPrice"
                  min={buyPrice}
                  step={100}
                  value={sellPrice}
                  onChange={(e) => {
                    gridProduct?.editModule?.editFormValidate();
                    e.value != null && setSellPrice(e.value);
                    setMargin((e.value - buyPrice) / buyPrice);
                  }}
                  title="Prix ​​de vente"
                />
                {margin != null && !isNaN(margin) && (
                  <div className={`text-sm font-[500] text-center text-white p-1 ${Math.sign(margin) === 1 ? "bg-emerald-500" : "bg-amber-500"}   rounded-full`}>
                    {Math.sign(margin) === 1 ? "+" + parseInt(margin * 100) : parseInt(margin * 100)}%
                  </div>
                )}
              </div>
            </td>
          </tr>
          <tr>
            <td className={labelclassName}>Prix ​​de vente Gros:</td>
            <td>
              <div className="flex gap-2">
                <TextBox
                  type="number"
                  format="N2"
                  label="DA"
                  width="w-[200px]"
                  id="sellPriceGros"
                  min={buyPrice}
                  step={100}
                  value={sellPriceGros}
                  onChange={(e) => {
                    e.value != null && setSellPriceGros(e.value);
                    setMarginGros((e.value - buyPrice) / buyPrice);
                  }}
                  title="Prix ​​de vente Gros"
                />
                {marginGros != null && !isNaN(marginGros) && (
                  <div className={`text-sm font-[500] text-center text-white p-1 ${Math.sign(marginGros) === 1 ? "bg-emerald-500" : "bg-amber-500"}   rounded-full`}>
                    {Math.sign(marginGros) === 1 ? "+" + parseInt(marginGros * 100) : parseInt(marginGros * 100)}%
                  </div>
                )}
              </div>
            </td>
          </tr>
          <tr>
            <td className={labelclassName}>Remarque:</td>
            <td className="w-[350px]">
              <TextBox type="text" multiline id="comment" width="full" onChange={(e) => e.value != null && setComment(e.value)} value={comment} title="Remarque sur le Produit" />
            </td>
          </tr>
        </tbody>
      </table>
      <DialogComponent
        header="Autorisation 🔒"
        visible={dropdownOpen}
        showCloseIcon={true}
        closeOnEscape
        width="200"
        open={() => setDropdownOpen(true)}
        close={() => setDropdownOpen(false)}
        footerTemplate={() => (
          <div>
            <ul className="flex items-center justify-end gap-6">
              <li>
                <button
                  className="btn-xs bg-indigo-500 hover:bg-indigo-600 text-white"
                  onClick={() => {
                    if (pin === store.get("pin")) {
                      setAuth(true);
                      setDropdownOpen(false);
                    } else {
                      setAuth(false);
                      setWrongPin(true);
                    }
                  }}>
                  Ajouter
                </button>
              </li>
              <li>
                <button
                  className="btn-xs bg-white border-slate-200 hover:border-slate-300 text-slate-500 hover:text-slate-600"
                  onClick={(e) => {
                    setDropdownOpen(false);
                  }}>
                  Annuler
                </button>
              </li>
            </ul>
          </div>
        )}>
        {" "}
        <div className="flex flex-col justify-start items-start">
          <label className="text-sm font-medium mr-2 mb-1" htmlFor="name">
            Code Pin
          </label>
          <TextBox
            id="name"
            onChange={(e) => {
              setWrongPin(false);
              setPin(e.value);
            }}
            className="form-input w-full"
            min={0}
            htmlAttributes={{ maxlength: "6", type: "password" }}
            type="number"
            showSpinButton={false}
            format="N0"
          />
          {wrongPin && <span className="m-1 text-xs text-red-400">Code pin inccorecte</span>}
        </div>
      </DialogComponent>
    </div>
  );
}
