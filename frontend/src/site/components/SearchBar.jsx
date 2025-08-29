import React from "react";

const SearchBar = ({ search, setSearch }) => (
  <input
    type="text"
    placeholder="جستجوی محصول..."
    className=" w-2/3 md:w-1/2 px-4 py-2 rounded-2xl shadow-lg 
        border-4 border-blue-700 text-blue-800 focus:outline-none"
    value={search}
    onChange={(e) => setSearch(e.target.value)}
  />
);

export default SearchBar;
