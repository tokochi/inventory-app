import React from "react";
import CustomersTable from "../component/table/CustomerTable";
import Header from "./../component/layout/Header";
import customerPNG from "./../data/icons/users.png";
import { useStore, loadCustomers } from "../contexts/Store";
export default function Customers() {
  const theme = useStore((state) => state.theme);
  return (
    <>
      <div className="flex items-center">
        <Header title="Clients" />
        <img src={customerPNG} width="30" />
      </div>
      <CustomersTable />
    </>
  );
}
