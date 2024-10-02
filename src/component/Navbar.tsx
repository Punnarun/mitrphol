import React from 'react';

const Navbar = () => {
    return (
      <nav className="bg-white text-gray-400">
        <div className="container mx-auto flex justify-between items-center py-4 px-6">
          <ul className="flex space-x-6">
            <li>
              <a href="/parking" className="hover:text-black">
                Parking
              </a>
            </li>
            <li>
              <a href="/emission" className="hover:text-black">
                CO₂ Emission
              </a>
            </li>
          </ul>
        </div>
      </nav>
    );
};

export default Navbar;
