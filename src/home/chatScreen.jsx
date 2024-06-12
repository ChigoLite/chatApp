import React, { useEffect } from "react";
import Navber from "./navbar";
import { useGlobalHooks } from "../context";
import { useNavigate } from "react-router-dom";
import SearchUsers from "./searchUsers";

const ChatScreen = () => {
  const { loggedIn } = useGlobalHooks();
  const navigate = useNavigate();
  useEffect(() => {
    if (!loggedIn) {
      navigate("/");
    }
  }, []);
  return (
    <div>
      <Navber />
      <div className="h-full">
        <div className="flex mt-6 ">
          <div className="bg-pink-200 flex-initial w-full h-screen sm:w-1/3 overflow-scroll">
            <SearchUsers />
          </div>
          <div className="bg-pink-50 flex-initial hidden h-screen  sm:w-2/3 sm:block">
            hey
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatScreen;
