import React from "react";

const PromoBanner = ({massage}) => {
  return (
    <div className=" min-w-screen h-[55px] bg-red-500 text-lx  
    text-center  text-white ">
      <p>
       {massage}
      </p>
    </div>
  );
}

export default PromoBanner;
