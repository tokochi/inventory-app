import React, { useState } from "react";
import BuyingTable from '../component/table/BuyingTable';
import Header from '../component/layout/Header';
import buy from "./../data/icons/buying.png";
export default function Buying() {

  return (
    <>
      <div className="flex items-center">
      <Header title="Achats" />
        <img src={buy} width="30" className="pb-4"/>
      </div>
      <BuyingTable />
    </>
  );
}
