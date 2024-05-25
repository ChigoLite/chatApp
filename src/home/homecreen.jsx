import React from "react";
import LoginPage from "../signup/signPage";
import { useGlobalHooks } from "../context";
const Home = () => {
  const { loggedIn } = useGlobalHooks();
  return <div>{!loggedIn && <LoginPage />}</div>;
};

export default Home;
