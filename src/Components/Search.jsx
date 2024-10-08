import React, { useState } from "react";
import { IoMdNotificationsOutline } from "react-icons/io";
import { logout } from "../authentication/auth";
import { useNavigate } from "react-router-dom";
import { useSocket } from '../context/SocketContext';

const Search = ({ userData }) => {
  const navigate = useNavigate();
  const socket = useSocket();

  // Simulated notifications data with a 'read' property
  const [notifications, setNotifications] = useState([
    { id: 1, message: "New message from HR", read: false },
    { id: 2, message: "System maintenance scheduled", read: false },
    { id: 3, message: "New user registered", read: false },
    { id: 4, message: "Kumain ng burat", read: false }, 
    { id: 5, message: "Usman Abdal Jaleel Shisha", read: false },
    { id: 6, message: "Usman Abdal Jaleel Shisha", read: false },
    { id: 7, message: "Usman Abdal Jaleel Shisha", read: false },
    { id: 8, message: "Usman Abdal Jaleel Shisha", read: false },
    { id: 9, message: "Usman Abdal Jaleel Shisha", read: false },
    { id: 10, message: "Usman Abdal Jaleel Shisha", read: false },
    { id: 11, message: "Muhammad Sumbul", read: false },
    { id: 12, message: "Usman Abdal Jaleel Shisha", read: false },
    { id: 13, message: "Muhammad Sumbul", read: false },
    { id: 14, message: "Usman Abdal Jaleel Shisha", read: false },
    { id: 15, message: "Muhammad Sumbul", read: false },
    { id: 16, message: "Muhammad Sumbul", read: false },
    { id: 17, message: "Muhammad Sumbul", read: false },
    { id: 18, message: "Muhammad Sumbul", read: false },
  ]);

  const [showNotifications, setShowNotifications] = useState(false); // Toggle notifications
  const [hasNewNotifications, setHasNewNotifications] = useState(true); // Badge visibility control

  // Handle click on a notification to mark it as read
  const handleNotificationClick = (notificationId) => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  // Handle notification icon click
  const handleNotificationIconClick = () => {
    setShowNotifications(!showNotifications);
    setHasNewNotifications(false); // Hide the badge when notifications are viewed
  };

  // Get current date and time
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

          {/* Right-side icons and user profile */}
          <div className="flex gap-3 items-center relative">
            {/* Notification Icon with Badge */}
            <div className="relative">
              <IoMdNotificationsOutline
                className="text-3xl cursor-pointer"
                onClick={handleNotificationIconClick}
              />
              {hasNewNotifications && notifications.some((n) => !n.read) && (
                <div className="absolute top-0 right-0 bg-red-500 rounded-full w-4 h-4 text-white text-xs flex items-center justify-center">
                  {notifications.filter(n => !n.read).length}
                </div>
              )}
            </div>

            {/* Notification Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 top-12 w-72 h-[400px] overflow-x-auto bg-white shadow-md rounded-lg z-10">
                <div className="p-2 text-right">
                <h1 className="font-bold">Notifications</h1>
                </div>
                <ul className="p-4">
                  {notifications.length === 0 ? (
                    <li className="text-gray-500 text-sm p-4">No notifications</li>
                  ) : (
                    notifications.map((notification) => (
                      <li
                        key={notification.id}
                        onClick={() => handleNotificationClick(notification.id)}
                        className={`p-4 border-b border-white rounded hover:bg-white cursor-pointer text-sm ${
                          notification.read ? "bg-white" : "bg-gray-100"
                        }`}
                      >
                        {notification.message}
                      </li>
                    ))
                  )}
                </ul>
              </div>
            )}

            {/* User Profile Dropdown */}
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

      {/* Logout Modal */}
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

      {/* Profile Modal */}
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
