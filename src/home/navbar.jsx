import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useGlobalHooks } from "../context";
const Navber = () => {
  const { user, logout } = useGlobalHooks();

  return (
    <>
      <div className="navbar bg-base-400 flex justify-between">
        <div className="flex-1 md:flex">
          <a className="btn btn-ghost text-xl">Chat-Up</a>
        </div>
        <div className="flex-none gap-2">
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="avatar online">
                <div className="w-10 rounded-full">
                  <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
                </div>
              </div>
            </div>
            <ul
              tabIndex={0}
              className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
            >
              <li>
                <a className="justify-between">
                  Profile
                  <span className="badge">New</span>
                </a>
              </li>
              <li>
                <a>Settings</a>
              </li>
              <li onClick={logout}>
                <a>Logout</a>
              </li>
            </ul>
          </div>
        </div>
        <hr />
      </div>
    </>
  );
};

export default Navber;
