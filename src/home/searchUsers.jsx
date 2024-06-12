import React, { useEffect, useRef, useState, useMemo } from "react";
import { useGlobalHooks } from "../context";
import Chat from "../chats/ChatPage";
import axios from "axios";
const url = "http://localhost:2020/api/v1/chat";

const SearchUsers = () => {
  const {
    SearchUsers,
    searchedUser,
    skeleton,
    selectedChat,
    setSelectedChat,
    setChatUsers,
    chatUsers,
  } = useGlobalHooks();
  const [input, setInput] = useState("");
  const [toggleSearch, setToggleSearch] = useState(false);
  const accessChat = async (userId) => {
    try {
      const { data } = await axios.post(
        `${url}`,
        { userId },
        { withCredentials: true }
      );
      if (!chatUsers.find((user) => user._id === data._id)) {
        setChatUsers([data, ...chatUsers]);
        setToggleSearch(false);
        setSelectedChat(data);
        setInput("");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleSearch = () => {
    let timeoutId;
    return (e) => {
      setToggleSearch(true);
      const query = e.target.value;
      if (query === " " || null) {
        return;
      }
      setInput(query);
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        SearchUsers(query);
      }, 1000);
    };
  };
  useEffect(() => {
    if (input == "") {
      setToggleSearch(false);
    }
  }, [input]);
  const debounce = useMemo(() => handleSearch(), []);
  return (
    <div>
      <div>
        <input
          onChange={debounce}
          value={input}
          type="text"
          placeholder="search user"
          className="input input-bordered w-60 mt-0.5 max-w-xs"
        />
      </div>
      {toggleSearch && (
        <div className="card w-96 bg-base-100 shadow-xl m-8 h-96 overflow-scroll">
          {searchedUser?.map((users) => {
            return (
              <div className="card-body " key={users._id}>
                <div className="card-actions">
                  {skeleton ? (
                    <div className="skeleton h-12 w-full"></div>
                  ) : (
                    <div
                      className="btn  rounded w-full bg-pink-50 h-8"
                      onClick={() => accessChat(users._id)}
                    >
                      <h3 className=" mx-4 capitalize">{users.username}</h3>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
      <Chat />
    </div>
  );
};

export default SearchUsers;
