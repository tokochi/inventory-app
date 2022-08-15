import React from "react";
import Students from "../../data/icons/students.png";
import { useStore, loadStudents } from "./../../contexts/Store";
loadStudents();

export default function StudentsCard() {
  const studentsList = useStore.getState().students;
  return (
    <div className="flex flex-1 h-[120px] bg-main-bg justify-between shadow-md border border-gray-100  rounded-md p-2">
      <div id="left" className="flex flex-col justify-between">
        <span className="text-lg text-gray-500 font-medium">Revenue</span>
        <span className="text-3xl text-gray-700 font-thin">2500,00DA</span>
        <span className="text-xs text-gray-700 font-thin border-b-1 border-gray-600 max-w-max">Voire la List</span>
      </div>
      <div id="right" className="self-end">
        <img className="w-10" src={Students} alt="Students " />
      </div>
    </div>
  );
}
