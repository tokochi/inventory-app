import React, { useState, useRef, useEffect } from "react";
import Store from "electron-store";
import TextBox from "../button/TextBox";
import PopupDialog from "../dialog/PopupDialog";
import { DatePickerComponent } from "@syncfusion/ej2-react-calendars";

export default function ProductForm(props) {
  const labelclassName = "p-4 w-[170px] text-sm font-medium";
  const schema = {
    unit: { type: "array" },
    brand: { type: "array" },
    category: { type: "array" },
  };
  const store = new Store({ schema });
  //  store?.delete("unit");
  //  store?.delete("brand");
  //  store?.delete("category");
  const [close, setClose] = useState(false);
  const [unit, setUnit] = useState(props?.unit || "U");
  const [quantity, setQuantity] = useState(props?.quantity || null);
  const [qtyAlert, setQtyAlert] = useState(props?.qtyAlert);
  const [buyPrice, setBuyPrice] = useState(props?.buyPrice);
  const [sellPrice, setSellPrice] = useState(props?.sellPrice);
  const [sellPriceGros, setSellPriceGros] = useState(props?.sellPriceGros);
  const [expired, setExpired] = useState(false);
  const [addUnit, setAddUnit] = useState("");
  const [addBrand, setAddBrand] = useState("");
  const [addCategory, setAddCategory] = useState("");
  const unitList = store?.get("unit") || [];
  const brand = store?.get("brand") || [];
  const category = store?.get("category") || [];
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
            <td className="w-[320px]">
              <TextBox type="text" id="name" width="full" value={props?.name} title="Désignation du Produit" />
            </td>
          </tr>
          <tr>
            <td className={labelclassName}>Marque:</td>
            <td>
              <div className="flex gap-2">
                <TextBox type="dropdown" id="brand" width="full" value={props?.brand} dataSource={store?.get("brand")} popupHeight="200px" title="Choisir la Marque" />
                <PopupDialog
                  id="addBrand"
                  close={close}
                  header="Ajouter une Marque"
                  width="330px"
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
                                brand.push(addBrand);
                                store.set("brand", [...new Set(brand)]);
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
                  width="full"
                  value={unit}
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
                                unitList.push(addUnit);
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
                <TextBox type="dropdown" id="category" width="full" value={props?.category} dataSource={store?.get("category")} popupHeight="200px" title="Choisir la Catégorie" />
                <PopupDialog
                  id="addCategory"
                  close={close}
                  header="Ajouter une Catégorie"
                  width="330px"
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
                                category.push(addCategory);
                                store.set("category", [...new Set(category)]);
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
            <td className="w-[320px]">
              <div className="flex gap-2">
                <div className="border-slate-200 w-[177px]  border rounded-l hover:border-slate-300 focus:border-indigo-300 shadow-sm">
                  <DatePickerComponent
                    id="expired"
                    name="expired"
                    enabled={expired}
                    width="175"
                    value={props?.expired}
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
              <TextBox
                type="number"
                format="N0"
                label={unit}
                id="quantity"
                width="w-[200px]"
                step={5}
                min={0}
                value={quantity}
                onChange={(e) => e.value != null && setQuantity(e.value)}
                title="Quantité"
              />
            </td>
          </tr>
          <tr>
            <td className={labelclassName}>Quantité Alerté:</td>
            <td>
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
            <td className="w-[320px]">
              <TextBox type="text" multiline id="comment" width="full" value={props?.comment} title="Remarque sur le Produit" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
