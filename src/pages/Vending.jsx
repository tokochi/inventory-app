import React, { useState } from "react";
import VendingTable from '../component/table/VendingTable';
import Header from '../component/layout/Header';
import sell from "./../data/icons/sell.png";
import caisse from "./../data/icons/caisse.png";
import invoice from "./../data/icons/document.png";
import report from "./../data/icons/report.png";
import vente from "./../data/icons/vente.png";
import { NavLink } from "react-router-dom";
import { HashRouter, Routes, Route } from "react-router-dom";
import Caisse from './Caisse';
import Facture from './Facture';
import Revenu from './Revenu';

export default function Vending() {
const [active, setActive] = useState({ list: true, caisse: false, facture: false, revenu: false });
    const activeButtoon =
      "inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border border-transparent shadow-sm bg-indigo-400 text-white duration-150 ease-in-out";
    const normalButton =
      "inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border border-slate-200 hover:border-slate-300 shadow-sm bg-white text-slate-500 duration-150 ease-in-out";
  
  
  return (
    <>
      <div className="flex items-center justify-between mr-10">
        <div className="flex items-center">
          <Header title="Ventes" />
          <img src={sell} width="30" className="" />
        </div>
     
      
      </div>
 <VendingTable/>
    </>
  );
}
