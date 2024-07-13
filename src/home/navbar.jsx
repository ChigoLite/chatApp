import React from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useGlobalHooks } from "../context";
import avater from "../assets/icons8-avatar-50.png";
const Navber = () => {
  const { user, logout, profile } = useGlobalHooks();
  const navigate = useNavigate();
  return (
    <>
      <div className="navbar bg-pink-400 flex justify-between top-0 left-0  fixed shadow-lg z-50">
        <div className="flex-1 md:flex">
          <Link to="/chat">
            <p className="btn btn-ghost text-xl">Chat-Up</p>
          </Link>
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
                  {profile?.userProfile?.image ? (
                    <img src={profile?.userProfile.image} />
                  ) : (
                    <img src={avater} alt="avater" />
                  )}
                </div>
              </div>
            </div>
            <ul
              tabIndex={0}
              className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
            >
              <li>
                <Link
                  to={`/profile/${profile?.userProfile?._id}`}
                  className="justify-between"
                >
                  Profile
                  <span className="badge">New</span>
                </Link>
              </li>
              <li>
                <a>Settings</a>
              </li>
              <li
                onClick={() => {
                  logout(), navigate("/login");
                }}
              >
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
