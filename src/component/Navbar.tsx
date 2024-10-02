import React from "react";

const Navbar = () => {
  return (
    <nav className="bg-white text-gray-400 w-full shadow-md">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        <ul className="flex space-x-6">
          <li>
            <a href="/parking" className="hover:text-black">
              Parking
            </a>
          </li>
          <li>
            <a href="/emission" className="hover:text-black">
              Calculator
            </a>
          </li>
          <li>
            <a href="/matching" className="hover:text-black">
              Matching
            </a>
          </li>
          <li>
            <a href="/mtn" className="hover:text-black">
              Maintanance
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
