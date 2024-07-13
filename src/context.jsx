import React, { useState, useContext, useEffect, createContext } from "react";
import axios from "axios";
import io from "socket.io-client";
import { useNavigate } from "react-router-dom";
import "./axios";

const AppContext = createContext();

// const url = "https://chat-up-y7ix.onrender.com/api/v1";
const url = "http://localhost:2020/api/v1";

const Context = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();
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
  const [msgLoading, setMsgLoading] = useState(false);

  const [unreadCounts, setUnreadCounts] = useState({});

  // const endPoint = "https://chat-up-y7ix.onrender.com/";
  const endPoint = "http://localhost:5173/";
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
        JSON.stringify({ person: data.user, isLogin: true, token: data.token })
      );
      window.location.href = "/";

      setLoading(false);
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
        JSON.stringify({ person: data.user, isLogin: true, token: data.token })
      );
      window.location.href = "/";

      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
      setErrorPop(true);
      setErrorMessage(error.response.data.message);
      console.log(error);
    }
  };

  const logout = async () => {
    localStorage.clear();
    navigate("/login");
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
        url,
        endPoint,
        msgLoading,
        setMsgLoading,
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
