import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard } from 'lucide-react'; // Example icon

const Sidebar = () => {
  return (
    <aside className="w-64 flex-shrink-0 bg-sidebar text-gray-300 p-4">
      <div className="flex items-center justify-center mb-10">
        <h1 className="text-2xl font-bold text-white">SchoolPay</h1>
      </div>
      <nav>
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex items-center px-4 py-2 mt-5 rounded-md transition-colors duration-200 ${
              isActive
                ? 'bg-sidebar-active text-white'
                : 'hover:bg-gray-700 hover:text-white'
            }`
          }
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="mx-4 font-medium">Dashboard</span>
        </NavLink>
        {/* Add more NavLink items here for other pages */}
      </nav>
    </aside>
  );
};

export default Sidebar;