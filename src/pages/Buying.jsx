import React, { useState } from "react";
import BuyingTable from '../component/table/BuyingTable';
import Header from '../component/layout/Header';

export default function Buying() {

  return (
    <>
      <Header title="Achats   📦" />

      <BuyingTable />
    </>
  );
}
