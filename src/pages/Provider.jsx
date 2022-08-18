import React, { useState } from "react";
import ProviderTable from "../component/table/ProviderTable";
import Header from "./../component/layout/Header";
import supplierPNG from "./../data/icons/supplier.png";

export default function Provider() {
  return (
    <>
      <div className="flex items-center">
        <Header title="Fournisseur" />
        <img src={supplierPNG} width="30" className="pb-4"/>
      </div>
      <ProviderTable />
    </>
  );
}
