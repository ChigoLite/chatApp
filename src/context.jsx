import React, { useState, useContext, useEffect, createContext } from "react";
import axios from "axios";
const AppContext = createContext();

const url = "http://localhost:2020/api/v1";
const Context = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [errorPop, setErrorPop] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState("");
  const [searchedUser, setSearchedUser] = useState([]);
  const [skeleton, setSkeleton] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);
  const [chatUsers, setChatUsers] = useState([]);

  const handleLogin = async (email, password) => {
    setLoading(true);
    setErrorPop(false);

    try {
      const { data } = await axios.post(
        `${url}/login`,
        { email, password },
        { withCredentials: true }
      );
      localStorage.setItem(
        "user",
        JSON.stringify({ person: data.user, isLogin: true })
      );
      setLoading(false);
      window.location.href = "/chat";
    } catch (error) {
      setLoading(false);
      setErrorPop(true);
      setErrorMessage(error.response.data.message);
    }
  };

  const handleRegister = async (username, confirmPassword, email, password) => {
    setLoading(true);
    setErrorPop(false);

    try {
      const { data } = await axios.post(
        `${url}/register`,
        {
          username,
          confirmPassword,
          email,
          password,
        },
        { withCredentials: true }
      );
      localStorage.setItem(
        "user",
        JSON.stringify({ person: data.user, isLogin: true })
      );

      setLoading(false);
      window.location.href = "/chat";
    } catch (error) {
      console.log(error);
      setLoading(false);
      setErrorPop(true);
      setErrorMessage(error.response.data.message);
      console.log(error);
    }
  };

  const logout = async () => {
    try {
      const data = await axios.get(`${url}/logout`, { withCredentilas: true });
      window.location.href = "/";
      localStorage.clear();
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };
  const SearchUsers = async (input) => {
    try {
      setSkeleton(true);
      const data = await axios.get(`${url}/users?users=${input}`, {
        withCredentials: true,
      });
      if (!data) {
        return;
      }
      setSearchedUser(data?.data.users);
      setSkeleton(false);
    } catch (error) {
      setSkeleton(false);
      console.log(error);
    }
  };
  useEffect(() => {
    const isLoggedIn = () => {
      const user = JSON.parse(localStorage.getItem("user"));

      if (user) {
        const { isLogin, person } = user;
        setLoggedIn(isLogin);
        setUser(person);
      }
    };
    isLoggedIn();
  }, []);

  useEffect(() => {
    const users = async () => {
      const data = await axios.get(`${url}/chat/getchats`, {
        withCredentials: true,
      });
      if (!data) {
        return;
      }
      setChatUsers(data?.data);
    };
    // users();
  }, []);
  return (
    <AppContext.Provider
      value={{
        logout,
        SearchUsers,
        user,
        loggedIn,
        errorPop,
        handleLogin,
        handleRegister,
        errorMessage,
        loading,
        setErrorMessage,
        setLoading,
        setErrorPop,
        searchedUser,
        setSearchedUser,
        skeleton,
        selectedChat,
        setSelectedChat,
        chatUsers,
        setChatUsers,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useGlobalHooks = () => {
  return useContext(AppContext);
};
export default Context;
