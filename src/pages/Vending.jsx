import React, { useState } from "react";
import VendingTable from '../component/table/VendingTable';
import Header from '../component/layout/Header';

export default function Vending() {

  return (
    <>
      <Header title="Ventes   📦" />

      <VendingTable />
    </>
  );
}
