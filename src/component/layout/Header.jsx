import React, { useState } from "react";


function Header({ children, title, value, subTitle }) {


  return (
    <main>
      <div className="py-4 pl-6 pr-4 p w-full max-w-9xl mx-auto ">
        <div className="sm:flex sm:justify-between sm:items-center  ">
          <div className="">
            <h1 className="text-2xl md:text-3xl text-slate-800 font-bold">{title}</h1>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Header;
