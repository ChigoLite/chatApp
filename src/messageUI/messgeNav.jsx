import React from "react";
import { useGlobalHooks } from "../context";
import avater from "../assets/icons8-avatar-50.png";
import { useEffect, useState } from "react";
import axios from "axios";
import { sender, SenderFullDetails, senderId } from "../utils/config";
import MessageUi from "./MessageUi";
import io from "socket.io-client";
import Loading from "../loader/Loading";
import { Link } from "react-router-dom";
const url = "http://localhost:2020/api/v1";
const endPoint = "http://localhost:2020/";
const socket = io(endPoint);
let copyOfSelectedChat;

const MessgeScreen = () => {
  const {
    selectedChat,
    setSelectedChat,
    chatId,
    profile,
    setOnlineUser,
    unreadCounts,
    setUnreadCounts,
    setChatUsers,
    chatUsers,
  } = useGlobalHooks();
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");

  const userId = profile?.userProfile?._id;
  const fetchMessage = async () => {
    if (!selectedChat) return;
    setLoading(true);
    try {
      const { data } = await axios.get(`${url}/message/${chatId}`, {
        withCredentials: true,
      });
      setMessages(data.messages);

      setLoading(false);
    } catch (error) {
      setLoading(false);

      console.error(error);
    }
  };
  const sendMessage = async () => {
    if (!messageInput || messageInput.trim() === "") {
      return;
    }
    try {
      const { data } = await axios.post(
        `${url}/message/send_message`,
        { content: messageInput, chatId: selectedChat._id },
        { withCredentials: true }
      );
      socket.emit("newMessage", data, selectedChat._id);
      setMessages((prevmessages) => [...prevmessages, data.message]);
      setChatUsers((prevChats) => {
        const updatedChats = prevChats.map((chat) => {
          if (chat._id === data.message.chat._id) {
            return {
              ...chat,
              ltMessage: data.message,
            };
          }
          return chat;
        });
        const chatsWithLatestMessages = updatedChats.map((chat) => ({
          ...chat,
          ltMessage: chat.ltMessage || { createdAt: "1970-01-01T00:00:00Z" }, // Fallback to a very old date
        }));

        // Sort chats by latest message timestamp

        chatsWithLatestMessages.sort(
          (a, b) =>
            new Date(b.ltMessage.createdAt) - new Date(a.ltMessage.createdAt)
        );

        return chatsWithLatestMessages;
      });
      setMessageInput("");
    } catch (error) {
      console.log(error);
    }
  };

  const handlePress = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  useEffect(() => {
    // Function to handle socket setup

    const setupSocket = () => {
      socket.emit("onlineUsers", userId);

      // Listener for received messages
      socket.on("recievedMessage", (message, chat_id) => {
        copyOfSelectedChat = selectedChat;

        if (
          copyOfSelectedChat?._id !== chat_id ||
          copyOfSelectedChat === null
        ) {
          setUnreadCounts((prevCounts) => {
            const newCounts = { ...prevCounts };
            newCounts[chat_id] = (newCounts[chat_id] || 0) + 1;
            return newCounts;
          });
        }
        setMessages((prevmessages) => [...prevmessages, message.message]);

        setChatUsers((prevChats) => {
          const updatedChats = prevChats.map((chat) => {
            if (chat._id === message.message.chat._id) {
              return {
                ...chat,
                ltMessage: message.message,
              };
            }
            return chat;
          });
          const chatsWithLatestMessages = updatedChats.map((chat) => ({
            ...chat,
            ltMessage: chat.ltMessage || { createdAt: "1970-01-01T00:00:00Z" },
          }));

          // Sort chats by latest message timestamp

          chatsWithLatestMessages.sort(
            (a, b) =>
              new Date(b.ltMessage.createdAt) - new Date(a.ltMessage.createdAt)
          );

          return chatsWithLatestMessages;
        });
      });
      socket.on("connected", (users) => {
        setOnlineUser(users);
      });

      socket.on("unreadMessagesCount", (unreadMessages) => {
        const counts = {};
        unreadMessages.forEach((chatId) => {
          counts[chatId] = (counts[chatId] || 0) + 1;
        });
        setUnreadCounts(counts);
      });

      // Cleanup listeners on component unmount
      return () => {
        socket.off("recievedMessage");
        socket.off("connected");
        socket.off("unreadMessagesCount");
      };
    };
    setupSocket();

    // Re-join room on reconnect
    socket.on("reconnect", () => {
      console.log("Reconnected, joining room again for userId:", userId);
      socket.emit("join_chat", userId);
      socket.emit("user", profile?.userProfile);
    });

    // Cleanup function
    return () => {
      socket.off("recievedMessage");
      socket.off("reconnect");
      socket.off("connected");
      socket.off("unreadMessagesCount");
    };
  }, [userId]); // Dependency array ensures this runs only once for the given userId

  const markAsRead = (chatId, userId) => {
    socket.emit("markAsRead", chatId, userId);
    setUnreadCounts((prevCounts) => {
      const newCounts = { ...prevCounts };
      delete newCounts[chatId];
      return newCounts;
    });
  };
  useEffect(() => {
    copyOfSelectedChat = selectedChat;

    if (selectedChat) {
      fetchMessage();
      markAsRead(selectedChat._id, userId);
    }
  }, [selectedChat]);

  if (loading) {
    return (
      <div className="">
        <Loading />
      </div>
    );
  }

  if (!selectedChat) {
    return (
      <div className="container ">
        <div className="flex justify-center my-40 align-middle">
          <h5 className="font-semibold text-center text-xl capitalize text-pink-700">
            click on user to start a conversation.
          </h5>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="navbar bg-base-100 mt-16">
        <div className="flex-1 ">
          <div className="avatar">
            <Link
              to={`/profile/${
                SenderFullDetails(profile?.userProfile, selectedChat?.users)
                  ?._id
              }`}
            >
              <div className="w-10 rounded-full  ring-offset-base-100 ring-offset-2">
                {SenderFullDetails(profile?.userProfile, selectedChat?.users)
                  ?.image ? (
                  <img
                    className="w-8 h-8 object-contain"
                    src={
                      SenderFullDetails(
                        profile?.userProfile,
                        selectedChat?.users
                      ).image
                    }
                    alt="sender"
                  />
                ) : (
                  <img
                    className="object-cover w-2 h-2"
                    src={avater}
                    alt={
                      SenderFullDetails(
                        profile?.userProfile,
                        selectedChat?.users
                      ).username
                    }
                  />
                )}
              </div>
            </Link>
          </div>
          <p className="text-sm ">
            {sender(profile.userProfile, selectedChat?.users)}
          </p>
        </div>
        <div className="flex-none">
          <button className="btn btn-square btn-ghost">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="inline-block w-5 h-5 stroke-current"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
              ></path>
            </svg>
          </button>
        </div>
        <button
          onClick={() => setSelectedChat(null)}
          className="btn btn-square md:hidden"
        >
          back
        </button>
      </div>
      <div className="flex align-middle justify-center w-24  absolute left-2/4 top-20 bg-white">
        <p className="align-middle text-center text-lg text-pink-400 ">
          Messages
        </p>
      </div>
      <div>
        {messages.map((message, index) => {
          return (
            <MessageUi index={index} messages={message} key={message._id} />
          );
        })}
      </div>
      <div className=" my-10">
        <div className="flex w-full max-w-3xl  space-x-1 fixed bottom-2 right-2">
          <input
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyPress={handlePress}
            type="text"
            placeholder="Type a message..."
            className="flex-grow p-2 border border-gray-300 rounded-lg focus:outline-none"
          />
          <button
            onClick={sendMessage}
            className="px-4 py-2 text-white bg-pink-400 rounded-lg hover:bg-pink-600"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessgeScreen;
