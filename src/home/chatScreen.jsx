import React, { useEffect } from "react";
import Navber from "./navbar";
import { useGlobalHooks } from "../context";
import { useNavigate } from "react-router-dom";
import SearchUsers from "./searchUsers";
import MessgeScreen from "../messageUI/messgeNav";
import "./home.css";
const ChatScreen = () => {
  const { loggedIn, selectedChat } = useGlobalHooks();
  const navigate = useNavigate();
  useEffect(() => {
    if (!loggedIn) {
      navigate("/");
    }
  }, []);
  return (
    <>
      <Navber />
      <div className="max-h-screen  overflow-hidden">
        <div className="flex mt-6 ">
          <div
            id="no-scrollbar"
            className={`bg-pink-200 flex-initial w-full h-screen md:w-1/3 overflow-scroll ${
              selectedChat ? "hidden md:block" : ""
            }`}
          >
            <SearchUsers />
          </div>
          <div
            className={`bg-pink-50 flex-initial h-screen overflow-scroll w-full sm:w-2/3 sm:block ${
              !selectedChat ? "hidden md:block" : ""
            }`}
          >
            <MessgeScreen />
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatScreen;
