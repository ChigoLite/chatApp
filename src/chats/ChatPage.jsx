import React, { useState, useEffect } from "react";
import axios from "axios";
import { useGlobalHooks } from "../context";
const url = "http://localhost:2020/api/v1/chat";
import { sender, SenderFullDetails, senderId } from "../utils/config";
import Loading from "../loader/Loading";
import avater from "../assets/icons8-avatar-50.png";
const Chats = ({ value }) => {
  const [loading, setLoading] = useState(false);
  const {
    selectedChat,
    setSelectedChat,
    chatUsers,
    setChatUsers,
    setChatId,
    profile,
    connection,
    onlineUser,
    unreadCounts,
  } = useGlobalHooks();

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`${url}/getchats`, {
          withCredentials: true,
        });

        setChatUsers(data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    };
    fetchUsers();
  }, []);
  if (loading) {
    return (
      <>
        <Loading />
      </>
    );
  }
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
    <div className="mt-6  w-full bg-base-100 shadow-xl">
      <div className="">
        {chatUsers?.map((user, index) => {
          let fullUserDetails = SenderFullDetails(
            profile.userProfile,
            user.users
          );
          return (
            <div className="" key={user._id}>
              <div
                className={
                  selectedChat == user
                    ? `  bg-pink-300 w-full  h-16 hover:bg-pink-200 relative `
                    : " bg-pink-50  w-full h-16 relative "
                }
                onClick={() => {
                  setSelectedChat(user), setChatId(user._id);
                }}
              >
                <div className="flex  justify-between align-middle my-4 ">
                  <div className="ml-2 ">
                    <p className="text-2xl ">
                      {sender(profile.userProfile, user.users)}
                    </p>
                  </div>
                  <div
                    className={`avatar  mr-5 my-4 ${
                      onlineUser.includes(
                        senderId(profile.userProfile, user.users)
                      )
                        ? "online"
                        : "offline"
                    }`}
                  >
                    <div className="  rounded-full w-9">
                      {fullUserDetails?.image ? (
                        <img
                          className="w-8 h-8 object-contain"
                          src={fullUserDetails.image}
                          alt="sender"
                        />
                      ) : (
                        <img
                          className="object-cover w-9 h-2"
                          src={avater}
                          alt={fullUserDetails.username}
                        />
                      )}
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-2 left-4">
                  <span className="text-gray-800 font-extralight ">
                    {user?.ltMessage?.sender
                      ? user?.ltMessage.sender._id === profile?.userProfile?._id
                        ? `you:  ${user?.ltMessage.content.substring(0, 15)}`
                        : user.ltMessage.content.substring(0, 15)
                      : user?.latestMessage?.sender ===
                        profile?.userProfile?._id
                      ? `you:  ${user?.latestMessage?.content.substring(0, 15)}`
                      : user.latestMessage?.content.substring(0, 15)}
                  </span>
                  {unreadCounts[user._id] > 0 && (
                    <span className="unread-count">
                      {unreadCounts[user._id]}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Chats;
