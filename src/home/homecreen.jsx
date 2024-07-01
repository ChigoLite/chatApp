import React from "react";
import LoginPage from "../signup/signPage";
import { useGlobalHooks } from "../context";
import ChatScreen from "./chatScreen";
const Home = () => {
  const { loggedIn } = useGlobalHooks();
  return (
    <div className="h-screen overflow-hidden">
      {" "}
      {!loggedIn ? <LoginPage /> : <ChatScreen />}
    </div>
  );
};

export default Home;
