import { TreeViewComponent } from "@syncfusion/ej2-react-navigations";
import React from "react";
import { useStore } from "./../../../contexts/Store";

export default function SelectedProductsView(props) {
   const normalButton =
     "inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-1  border border-slate-200 hover:border-slate-300 shadow-sm bg-white text-slate-500 duration-150 ease-in-out";
const toCurrency = useStore((state) => state.toCurrency);
  const treeViewTemplate = (prop) => (
    <table className="table-auto w-full">
      <tbody>
        <tr className="">
          <td className="text-slate-600  font-medium text-left  px-2">
            <span>📦{prop?.name}</span>
          </td>
          <td className="px-2">
            {prop?.quantity > 0 && (
              <div className={normalButton}>
                Quantité: <span className="text-green-600 ml-1">{prop?.quantity}</span>
              </div>
            )}
          </td>
          <td>
            {prop?.sellPrice > 0 && (
              <div className={normalButton}>
                Prix Vente: <span className="text-green-600 ml-1">{toCurrency(prop?.sellPrice)}</span>
              </div>
            )}
          </td>
        </tr>
      </tbody>
    </table>
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
