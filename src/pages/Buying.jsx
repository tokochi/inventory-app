import React from "react";
import BuyingTable from "../component/table/BuyingTable";
import Header from "../component/layout/Header";
import buy from "./../data/icons/buying.png";
import { useStore } from "../contexts/Store";
export default function Buying() {
  const theme = useStore((state) => state.theme);
  return (
    <>
      <div className="flex items-center">
        <Header title="Achats" />
        <img src={buy} width="30" />
      </div>
      <BuyingTable />
    </>
  );
}
