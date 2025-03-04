import React, { useEffect, useState } from "react";
import { IoMdNotificationsOutline } from "react-icons/io";
import { logout } from "../authentication/auth";
import { useNavigate } from "react-router-dom";
import { useSocket } from '../context/SocketContext';

const Search = ({ userData }) => {
  const navigate = useNavigate();
  const socket = useSocket();

  const [notifications, setNotifications] = useState([
    { id: 1, message: "New message from HR", read: false },
    { id: 2, message: "System maintenance scheduled", read: false },
    { id: 3, message: "New user registered", read: false },
  ]);


  const [showNotifications, setShowNotifications] = useState(false);
  const [hasNewNotifications, setHasNewNotifications] = useState(true); 

  
  const handleNotificationClick = (notificationId) => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
  };
  const handleNotificationIconClick = () => {
    setShowNotifications(!showNotifications);
    setHasNewNotifications(false); 
  };

  function getCurrentDateTime() {
    const now = new Date();
    const date = now.toLocaleDateString();
    const time = now.toLocaleTimeString();
    return `${date} ${time}`;
  }

  const handleLogout = () => {
    const logoutTrails = {
      dateTime: getCurrentDateTime(),
      userId: userData._id,
      userName: userData.userName,
      role: userData.role,
      action: "LOGOUT",
      description: "Logged out to the system."
    };
    logout(logoutTrails, socket);
    navigate("/");
  };

  return (
    <>
      <div className="w-full p-5 bg-white text-black/70 h-[85px] rounded-l-sm">
        <div className="flex justify-between max-md:flex max-md:justify-end">
          <div className="flex gap-5 items-center w-[600px] max-md:hidden">
            <h1 className="text-2xl font-bold">FINANCIAL MANAGEMENT</h1>
          </div>

          <div className="flex gap-3 items-center relative">

            {/* USER DROPDOWN */}
            <div className="dropdown dropdown-end">
              <img
                src={userData.image.secure_url}
                tabIndex={0}
                role="button"
                alt="/"
                className="size-10 rounded-full"
              />
              <ul
                tabIndex={0}
                className="dropdown-content menu bg-white rounded-box z-[1] w-52 p-2 mt-2 shadow"
              >
                <li onClick={() => document.getElementById('profile_modal').showModal()}>
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

      {/* LOGOUT MODAL */}
      <dialog id="logout_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Are you sure you want to logout?</h3>
          <div className="flex justify-end gap-4">
            <button className="btn btn-outline btn-success" onClick={handleLogout}>
              Yes
            </button>
            <button
              className="btn btn-outline btn-error"
              onClick={() => document.getElementById("logout_modal").close()}
            >
              No
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>

      {/* PROFILE MODAL */}
      <dialog id="profile_modal" className="modal">
        <div className="modal-box">
          <div className="py-4">
            <img
              src={userData.image.secure_url}
              alt="Sample Profile"
              className="rounded-full w-24 h-24 mx-auto mb-4"
            />
            <p>
              <strong>Full Name:</strong> {userData.fullName}
            </p>
            <p>
              <strong>Email:</strong> {userData.email}
            </p>
            <p>
              <strong>Username:</strong> {userData.userName}
            </p>
            <p>
              <strong>Role:</strong> {userData.role || "N/A"}
            </p>
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
