import React from "react";
import { RiMenuFold2Fill } from "react-icons/ri";
import { MdOutlineDarkMode } from "react-icons/md";
import { IoMdNotificationsOutline } from "react-icons/io";
import { logout } from "../authentication/auth";
import { useNavigate } from "react-router-dom";

const Search = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <>
      <div className="w-full p-5 bg-white text-black/70 h-[85px] rounded-l-sm">
        <div className="flex justify-between max-md:flex max-md:justify-end">
          <div className="flex gap-5 items-center w-[600px] max-md:hidden">
            {/* Sidebar toggle button */}
            <h1 className="text-2xl font-bold">FINANCIAL MANAGEMENT</h1>
          </div>

          {/* Right-side icons and user profile */}
          <div className="flex gap-3 items-center">
            <MdOutlineDarkMode className="size-6 cursor-pointer" />
            <IoMdNotificationsOutline className="size-6 cursor-pointer" />
            <div className="dropdown dropdown-end">
              <img
                src="https://i.pinimg.com/736x/ea/21/05/ea21052f12b135e2f343b0c5ca8aeabc.jpg"
                tabIndex={0}
                role="button"
                alt="/"
                className="size-10 rounded-full"
              />
              <ul
                tabIndex={0}
                className="dropdown-content menu bg-white rounded-box z-[1] w-52 p-2 mt-2 shadow"
              >
                <li>
                  <a>Profile</a>
                </li>
                <li onClick={() => document.getElementById("logout_modal").showModal()}>
                  <a>Log out</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
    <dialog id="logout_modal" className="modal">
      <div className="modal-box">
         <h3 className="font-bold text-lg">Are you sure you want to logout?</h3>
            <div className="py-4">
                <p>Click "Yes" to logout or "No" to stay on the page.</p>
            </div>
              <div className="flex justify-end gap-4">
                  <button className="btn btn-outline" onClick={handleLogout}>
                      Yes
                  </button>
                  <button className="btn btn-error" onClick={() => document.getElementById("logout_modal").close()}>
                      No
                  </button>
              </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
      
    </>
  );
};

export default Search;
