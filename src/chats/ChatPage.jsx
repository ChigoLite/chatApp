import React, { useState, useEffect } from "react";
import axios from "axios";
import { useGlobalHooks } from "../context";
const url = "http://localhost:2020/api/v1/chat";
const Chats = ({ value }) => {
  const { selectedChat, setSelectedChat, chatUsers, setChatUsers } =
    useGlobalHooks();
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await axios.get(`${url}/getchats`, {
          withCredentials: true,
        });
        setChatUsers(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUsers();
  }, []);
  if (chatUsers.length === 0) {
    return (
      <div className="mt-6 card w-full bg-base-100 shadow-xl">
        <div className="card-body">
          <h3 className="m-auto text-center text-xl">
            Search for a user to startup a conversation..
          </h3>
        </div>
      </div>
    );
  }
  return (
    <div className="mt-6 card w-full bg-base-100 shadow-xl">
      <div className="card-body">
        {chatUsers.map((user, index) => {
          return (
            <div className="card-actions" key={user._id}>
              <button
                className={
                  selectedChat == user
                    ? `btn no-animation bg-pink-300 w-96 flex justify-center hover:bg-pink-200 `
                    : "btn no-animation bg-pink-50 w-96 flex justify-center"
                }
                onClick={() => setSelectedChat(user)}
              >
                {user.users[1].username}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Chats;
