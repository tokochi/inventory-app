import React from "react";
import ProviderTable from "../component/table/ProviderTable";
import Header from "./../component/layout/Header";
import supplierPNG from "./../data/icons/supplier.png";
import { useStore } from "../contexts/Store";
export default function Provider() {
  const theme = useStore((state) => state.theme);
  return (
    <>
      <div className="flex items-center">
        <Header title="Fournisseur" />
        <img src={supplierPNG} width="30" />
      </div>
      <ProviderTable />
    </>
  );
}
