import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col justify-between">

      {/* Top */}
      <div>
        <div className="flex items-center justify-center gap-2 mt-6 mb-10">
          <div className="bg-blue-600 p-3 rounded-xl shadow-sm">
            <svg width="20" height="20" fill="white" viewBox="0 0 24 24">
              <path d="M4 18V6h2v10h12v2H4zm4-4V8h2v6H8zm4 0V4h2v10h-2zm4 0v-3h2v3h-2z" />
            </svg>
          </div>
          <span className="text-3xl font-semibold text-gray-900">
            Trade<span className="text-blue-600">Pulse</span>
          </span>
        </div>

        <nav className="mt-6 space-y-1 px-4">

          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `block px-4 py-2 rounded-lg text-sm font-medium ${isActive
                ? "bg-blue-600 text-white"
                : "text-gray-600 hover:bg-gray-100"
              }`
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/trade-history"
            className="block px-4 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100"
          >
            Trade History
          </NavLink>

          <NavLink
            to="/settings"
            className="block px-4 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100"
          >
            Settings
          </NavLink>

        </nav>
      </div>

      {/* Bottom */}
      <div className="p-4 border-t border-gray-200">
        <p className="text-sm text-green-600 mb-2">● Connected</p>
        <button
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.href = "/login";
          }}
          className="text-sm text-gray-500 hover:text-red-500"
        >
          Disconnect
        </button>
      </div>

    </div>
  );
};

export default Sidebar;
