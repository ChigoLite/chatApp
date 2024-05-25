import React, { useState, useContext, useEffect, createContext } from "react";

const AppContext = createContext();

const Context = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);

  const isLoggedIn = () => {
    const user = localStorage.getItem("user");
    if (user) {
      setLoggedIn(true);
    }
  };
  useEffect(() => {
    isLoggedIn();
  }, []);
  return (
    <AppContext.Provider value={{ loggedIn }}>{children}</AppContext.Provider>
  );
};

export const useGlobalHooks = () => {
  return useContext(AppContext);
};
export default Context;
