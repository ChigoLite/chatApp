import React, { useEffect } from "react";
import Navber from "./navbar";
import { useGlobalHooks } from "../context";
import { useNavigate } from "react-router-dom";
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
    </div>
  );
};

export default ChatScreen;
