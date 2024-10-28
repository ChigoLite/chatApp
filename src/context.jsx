import React, {
  useState,
  useContext,
  useEffect,
  createContext,
  useRef,
} from "react";
import axios from "axios";
import io from "socket.io-client";
import { useNavigate } from "react-router-dom";
import "./axios";
import { Peer } from "peerjs";
import { v4 as uuidv4 } from "uuid";
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
  const [peers, setPeers] = useState(null);
  const [peered, setPeered] = useState([]);
  const [peerId, setPeerId] = useState(null);
  const [activeCall, setActiveCall] = useState(false);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [remoteStream, setRemoteStream] = useState(null);
  const [localStream, setLocalStream] = useState(null);
  const [toggleSearch, setToggleSearch] = useState(false);
  const [messages, setMessages] = useState([]);

  const incomingCall = useRef(null);

  // const endPoint = "https://chat-up-y7ix.onrender.com/";
  const endPoint = "http://localhost:2020/";
  const socket = io(endPoint);

  useEffect(() => {
    const userProfile = async () => {
      const data = await axios.get(`${url}/profile`, {
        withCredentials: true,
      });
      if (!data) {
        return;
      }
      setProfile(data?.data);
      socket.emit("peers", data.data.userProfile._id);
    };
    userProfile();
  }, []);

  useEffect(() => {
    if (peerId && !peers) {
      const peerUser = new Peer(peerId);
      setPeers(peerUser);

      peerUser.on("open", (id) => {
        console.log("Peer connection opened with ID:", id);
      });

      peerUser.on("call", (call) => {
        // Get user media (camera and microphone)
        console.log("incoming call");
        incomingCall.current = call;

        // setActiveCall(true)
      });
    }

    socket.on("peer", (userId) => {
      setPeerId(userId);
    });
    return () => {
      socket.off("peer");
    };
  }, [peerId, peers]);

  // This effect will trigger after `setActiveCall(true)` causes a re-render
  const acceptCall = () => {
    setActiveCall(true);
  };

  useEffect(() => {
    if (activeCall) {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          setLocalStream(stream);

          if (incomingCall.current) {
            // Answer the call and handle the remote stream
            incomingCall.current.answer(stream);
            incomingCall.current.on("stream", (remoteV) => {
              setRemoteStream(remoteV);
              console.log("Remote stream set to remote video element.");
            });
          }
        })
        .catch((err) => {
          console.error("Failed to get local stream", err);
        });
    }
  }, [activeCall]); // This useEffect runs only when `activeCall` becomes true
  const accessChat = async (userId) => {
    setMsgLoading(true);
    try {
      const { data } = await axios.post(
        `${url}/chat`,
        { userId },
        { withCredentials: true }
      );
      if (!chatUsers.find((user) => user._id === data._id)) {
        setChatUsers([data, ...chatUsers]);
        setSelectedChat(data);
        navigate("/");
        setChatId(data._id);
        setMsgLoading(false);
      }
      setSelectedChat(data);
      setChatId(data._id);
      navigate("/");
      setMsgLoading(false);
    } catch (error) {
      setMsgLoading(false);
      console.log(error);
    }
  };
  const fetchMessage = async () => {
    if (!selectedChat) return;
    setMsgLoading(true);
    try {
      const { data } = await axios.get(`${url}/message/${chatId}`, {
        withCredentials: true,
      });
      setMessages(data.messages);

      setMsgLoading(false);
    } catch (error) {
      setMsgLoading(false);

      console.error(error);
    }
  };

  const callPeer = (id) => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        // Display the local stream (your video)
        setLocalStream(stream);
        // Initiate a call to the remote peer
        const call = peers.call(id, stream);
        // Listen for the remote stream and display it
        call.on("stream", (remoteVideo) => {
          console.log("making the stream call");
          setRemoteStream(remoteVideo);
        });
        setActiveCall(true);
      })

      .catch((err) => {
        console.error("Failed to get local stream", err);
      });
  };
  const endCall = () => {
    if (localStream && localStream.getTracks) {
      localStream.getTracks().forEach((track) => track.stop());
      setLocalStream(null);
    }

    if (remoteStream) {
      setRemoteStream(null); // Clear the remote stream
    }
    incomingCall.current = null;
    // Reset the active call state
    setActiveCall(false);
  };

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
        socket,
        localStream,
        remoteStream,
        callPeer,
        acceptCall,
        activeCall,
        incomingCall,
        setActiveCall,
        endCall,
        toggleSearch,
        setToggleSearch,
        accessChat,
        messages,
        setMessages,
        fetchMessage,
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
