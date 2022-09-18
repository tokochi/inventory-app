import React from "react";
import VendingTable from "../component/table/VendingTable";
import Header from "../component/layout/Header";
import sell from "./../data/icons/sell.png";
import { useStore } from "../contexts/Store";
export default function Vending() {
  const theme = useStore((state) => state.theme);
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
