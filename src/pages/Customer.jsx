import React, { useState } from "react";
import CustomersTable from "../component/table/CustomerTable";
import Header from "./../component/layout/Header";
import customerPNG from "./../data/icons/users.png";
export default function Customers() {
  return (
    <>
      <div className="flex items-center">
        <Header title="Clients" />
        <img src={customerPNG} width="30"  />
      </div>
      <CustomersTable />
    </>
  );
}
