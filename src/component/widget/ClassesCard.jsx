import React from "react";
import Classes from "../../data/icons/classe.png";
import { useStore, loadClasses } from "./../../contexts/Store";
loadClasses();

export default function ClassesCard() {
  const classesList = useStore.getState().classes;
  return (
    <div className="flex flex-1 h-[120px] bg-main-bg justify-between shadow-md border border-gray-100  rounded-md p-2">
      <div id="left" className="flex flex-col justify-between">
        <span className="text-lg text-gray-500 font-medium">Classes</span>
        <span className="text-3xl text-gray-700 font-thin">{classesList.length}</span>
        <span className="text-xs text-gray-700 font-thin border-b-1 border-gray-600 max-w-max">Voire la List</span>
      </div>
      <div id="right" className="self-end">
        <img className="w-10  " src={Classes} alt="Classes " />
      </div>
    </div>
  );
}
