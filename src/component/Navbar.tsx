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
            <a href="/matching" className="hover:text-black">
              Matching
            </a>
          </li>
          <li>
            <a href="/insurance" className="hover:text-black">
              Insurance
            </a>
          </li>
          <li>
            <a href="/maintenance" className="hover:text-black">
              Maintanance
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
