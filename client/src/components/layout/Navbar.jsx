import { useEffect, useState } from "react";

const Navbar = () => {
const [user, setUser] = useState(null);

useEffect(() => {
  const storedUser = localStorage.getItem("user");

  if (storedUser && storedUser !== "undefined") {
    try {
      setUser(JSON.parse(storedUser));
    } catch (err) {
      console.error("Invalid user in localStorage");
      localStorage.removeItem("user");
    }
  }
}, []);


  return (
    <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">

      <input
        type="text"
        placeholder="Search coins, pairs, or docs..."
        className="w-96 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
      />

      <div className="flex items-center gap-6">
<span className="text-sm text-gray-500">
  Welcome
</span>
        <span className="text-sm text-gray-600">
          USDT - USW
        </span>
        <div className="w-9 h-9 bg-blue-600 text-white rounded-full flex items-center justify-center ">
          🧑🏻
        </div>

      </div>

    </div>
  );
};

export default Navbar;
