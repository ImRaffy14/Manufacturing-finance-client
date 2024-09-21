import React from "react";
import { RiMenuFold2Fill } from "react-icons/ri";
import { MdOutlineDarkMode } from "react-icons/md";
import { IoMdNotificationsOutline } from "react-icons/io";
import { logout } from "../authentication/auth";
import { useNavigate } from "react-router-dom";
import { useSocket } from '../context/SocketContext'

const Search = ({ userData }) => {
  const navigate = useNavigate();

  const socket = useSocket()

  //GET TIME
  function getCurrentDateTime() {
    const now = new Date();
    const date = now.toLocaleDateString();
    const time = now.toLocaleTimeString();
    return `${date} ${time}`;
  }

  const handleLogout = () => {
    const logoutTrails = {dateTime: getCurrentDateTime(), userId: userData._id, userName: userData.userName,  role: userData.role, action: "LOGOUT", description: "Logged out to the system."}
    logout(logoutTrails, socket);
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
                src={userData.image}
                tabIndex={0}
                role="button"
                alt="/"
                className="size-10 rounded-full"
              />
              <ul
                tabIndex={0}
                className="dropdown-content menu bg-white rounded-box z-[1] w-52 p-2 mt-2 shadow"
              >
                <li onClick={()=>document.getElementById('profile_modal').showModal()}>
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
          <div className="flex justify-end gap-4">
            <button className="btn  btn-outline btn-success" onClick={handleLogout}>
              Yes
            </button>
            <button className="btn btn-outline btn-error" onClick={() => document.getElementById("logout_modal").close()}>
              No
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>

{/* Open the modal using document.getElementById('ID').showModal() method */}
<dialog id="profile_modal" className="modal">
  <div className="modal-box">
    <div className="py-4">
      <img src={userData.image} alt="Sample Profile" className="rounded-full w-24 h-24 mx-auto mb-4" />
            <p><strong>Full Name:</strong> {userData.fullName}</p>
            <p><strong>Email:</strong> {userData.email}</p>
            <p><strong>Username:</strong> {userData.userName}</p>
            <p><strong>Role:</strong> {userData.role || 'N/A'}</p>
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
