import React, { useEffect, useRef, useState, useMemo } from "react";
import { useGlobalHooks } from "../context";
import Chat from "../chats/ChatPage";
import axios from "axios";
import avater from "../assets/icons8-avatar-50.png";

const SearchUsers = () => {
  const {
    SearchUsers,
    searchedUser,
    skeleton,
    selectedChat,
    setSelectedChat,
    setChatUsers,
    chatUsers,
    url,
    msgLoading,
    setMsgLoading,
  } = useGlobalHooks();
  const [input, setInput] = useState("");
  const [toggleSearch, setToggleSearch] = useState(false);
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
        setToggleSearch(false);
        setSelectedChat(data);
        setMsgLoading(false);
        setInput("");
      }
    } catch (error) {
      setMsgLoading(false);
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
    <div className=" mt-16 h-full">
      <div>
        <label className="input input-bordered flex items-center gap-2">
          <input
            onChange={debounce}
            value={input}
            type="text"
            placeholder="Search user"
            className="grow"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="w-6 h-5 opacity-70"
          >
            <path
              fillRule="evenodd"
              d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
              clipRule="evenodd"
            />
          </svg>
        </label>
      </div>
      {toggleSearch && (
        <div className=" w-96 bg-base-100 shadow-xl mt-9 h-screen overflow-scroll">
          {searchedUser?.map((users) => {
            return (
              <div className=" mt-5" key={users._id}>
                <div className="">
                  {skeleton ? (
                    <div className="skeleton h-12 w-full"></div>
                  ) : (
                    <div
                      className="btn flex justify-between w-full bg-pink-50 h-8"
                      onClick={() => accessChat(users._id)}
                    >
                      <div className="">
                        <h3 className="  capitalize">{users.username}</h3>
                        <span className=" text-sm text-gray-950">
                          {users.email}
                        </span>
                      </div>
                      <div className="">
                        {users.image ? (
                          <img
                            className="w-8 h-8 object-contain"
                            src={users.image}
                            alt={users.name}
                          />
                        ) : (
                          <img
                            className="w-8 h-8 object-contain"
                            src={avater}
                            alt={users.profile}
                          />
                        )}
                      </div>
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
