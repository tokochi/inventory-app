import React from "react";
import { TreeViewComponent } from "@syncfusion/ej2-react-navigations";


export default function SelectedProductsView(props) {
   const normalButton =
     "inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-1  border border-slate-200 hover:border-slate-300 shadow-sm bg-white text-slate-500 duration-150 ease-in-out";
  function toCurrency(num) {
    let str = num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + "DA";
    str = str.replace("DZD", "DA");
    str = str.replace(",", " ");
    return str;
  }
  const treeViewTemplate = (prop) => (
    <div className="flex gap-2 items-center justify-between ">
      <div className="text-slate-600 text-left font-medium min-w-[40px] text-md ">
        <span>📦{prop?.name}</span>
      </div>
      <div>
        {prop?.quantity && (
          <div className={normalButton}>
            Qté: <span className="text-green-600 min-w-[20px] pl-1">{prop?.quantity}</span>
          </div>
        )}
        {prop?.sellPrice && (
          <div className={normalButton}>
            Prix: <span className="text-green-600 min-w-[30px] pl-1">{toCurrency(prop?.sellPrice)}</span>
          </div>
        )}
      </div>
    </div>
  );

  const hierarchicalData = [
    {
      id: "01",
      name: "Produits",
      subChild:
           props.grid.map((prodct, index) => {
              return { name: prodct.name, id: index, quantity: prodct.selectedQuantity, sellPrice: prodct.sellPrice };
            })
    },
  ];
  const dataSource = { dataSource: hierarchicalData, id: "id", text: "name", child: "subChild" };
  return <TreeViewComponent name="students" id="students" fields={dataSource} nodeTemplate={treeViewTemplate}></TreeViewComponent>;
}
