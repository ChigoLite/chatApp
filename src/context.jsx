import React, { useState, useContext, useEffect, createContext } from "react";
import axios from "axios";
import io from "socket.io-client";

const AppContext = createContext();

const url = "http://localhost:2020/api/v1";
const Context = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [errorPop, setErrorPop] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchedUser, setSearchedUser] = useState([]);
  const [skeleton, setSkeleton] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);
  const [chatUsers, setChatUsers] = useState([]);
  const [profile, setProfile] = useState([]);
  const [chatId, setChatId] = useState("");
  const [onlineUser, setOnlineUser] = useState([]);
  const [online, setOnline] = useState(false);
  const OnlineId = profile?.userProfile?._id;
  const [unreadCounts, setUnreadCounts] = useState({});

  const endPoint = "http://localhost:2020/";
  const socket = io(endPoint);

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
      const data = await axios.get(`${url}/logout`, { withCredentials: true });
      window.location.href = "/";
      localStorage.clear();
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
      console.log(data);
      if (!data) {
        return;
      }
      setSearchedUser(data?.data.user);
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
      }
    };
    isLoggedIn();
  }, []);

  useEffect(() => {
    const userProfile = async () => {
      const data = await axios.get(`${url}/profile`, {
        withCredentials: true,
      });
      if (!data) {
        return;
      }
      setProfile(data?.data);
    };
    userProfile();
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
  // useEffect(() => {
  //   const isOnline = onlineUser.find((id) => id == OnlineId);
  //   if (isOnline) {
  //     setOnline(isOnline);
  //   }
  // }, [onlineUser]);
  return (
    <AppContext.Provider
      value={{
        logout,
        SearchUsers,
        profile,
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
        chatId,
        setChatId,
        onlineUser,
        setOnlineUser,
        unreadCounts,
        setUnreadCounts,
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
