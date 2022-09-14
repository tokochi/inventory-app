import React from "react";
import VendingTable from "../component/table/VendingTable";
import Header from "../component/layout/Header";
import sell from "./../data/icons/sell.png";

export default function Vending() {
  return (
    <>
      <div className="flex items-center justify-between mr-10">
        <div className="flex items-center">
          <Header title="Ventes" />
          <img src={sell} width="30" className="" />
        </div>
      </div>
      <VendingTable />
    </>
  );
}
