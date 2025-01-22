import { CgGames } from "react-icons/cg";
import { CiLogout, CiMoneyCheck1 } from "react-icons/ci";
import { FaRegUser } from "react-icons/fa";
import { IoHomeOutline } from "react-icons/io5";
import { MdPeopleOutline } from "react-icons/md";
import { TbBrandCashapp } from "react-icons/tb";
import { TfiCup } from "react-icons/tfi";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="h-screen w-16 bg-gray-900 text-white">
    <div>

  
      {/* Logo Section */}
      <div className="flex items-center justify-center h-16">
        <span>C</span>
      </div>

      {/* Navigation Items */}
      <nav className="mt-4">
        <NavLink
          to="/dashboard"
          className="flex items-center px-4 py-2 hover:bg-gray-700"
        >
          <span className="text-xl"><IoHomeOutline />
          </span>
        </NavLink>
        <NavLink
          to="/admin/add-games"
          className="flex items-center px-4 py-2 hover:bg-gray-700"
        >
          <span className="text-xl"><CgGames />
          </span>
        </NavLink>
        <NavLink
          to="/admin/tournament"
          className="flex items-center px-4 py-2 hover:bg-gray-700"
        >
          <span className="text-xl"><TfiCup />
          </span>
        </NavLink>
        <NavLink
          to="/logout"
          className="flex items-center px-4 py-2 hover:bg-gray-700"
        >
          <span className="text-xl"><TbBrandCashapp />
          </span>
        </NavLink>
        <NavLink
          to="/Transaction"
          className="flex items-center px-4 py-2 hover:bg-gray-700"
        >
          <span className="text-xl"> <CiMoneyCheck1 />

          </span>
        </NavLink>
        <NavLink
          to="/Teams"
          className="flex items-center px-4 py-2 hover:bg-gray-700"
        >
          <span className="text-xl"> <MdPeopleOutline />



          </span>
        </NavLink>
        <NavLink
          to="/users"
          className="flex items-center px-4 py-2 hover:bg-gray-700"
        >
          <span className="text-xl"><FaRegUser />




          </span>
        </NavLink>
        <NavLink
          to="/Transaction"
          className="flex items-center px-4 py-2 hover:bg-gray-700"
        >
          <span className="text-xl"> <CiLogout />


          </span>
        </NavLink>
       

      </nav>
      </div>
    </div>
  );
};

export default Sidebar;
