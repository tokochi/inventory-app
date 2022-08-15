import React, { useState } from "react";


function Header({ children, title, value, subTitle }) {


  return (
    <main>
      <div className="px-4 sm:px-6 lg:px-8 py-4 w-full max-w-9xl mx-auto ">
        <div className="sm:flex sm:justify-between sm:items-center mb-4 ">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-2xl md:text-3xl text-slate-800 font-bold">{title}</h1>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Header;
