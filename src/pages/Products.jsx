import React, { useState } from "react";
import ProductsTable from '../component/table/ProductsTable';
import Header from './../component/layout/Header';

export default function Products() {

  return (
    <>
      <Header title="Produits   📦" />

      <ProductsTable />
    </>
  );
}
