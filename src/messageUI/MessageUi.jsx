import React, { useRef, useEffect } from "react";
import { useGlobalHooks } from "../context";
const MessageUi = ({ messages, index }) => {
  const { profile } = useGlobalHooks();
  const { _id, content, chat, sender, createdAt, updateAt } = messages;
  const messageScroll = useRef(null);
  const messageScrollWidth = useRef(null);

  useEffect(() => {
    if (messageScrollWidth.current) {
      messageScrollWidth.current.scrollIntoView({ behavior: "auto" });
    }
    if (messageScroll.current) {
      messageScroll.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  return (
    <div className=" flex flex-col p-4 space-y-2 overflow-auto mt-12">
      <div
        className={`p-2   max-w-sm ${
          sender?._id === `${profile?.userProfile._id}`
            ? "bg-blue-700 text-white  self-end rounded-l-lg rounded-br-lg overflow-hidden"
            : "bg-gray-200 text-black self-start rounded-r-lg rounded-bl-lg"
        }`}
        ref={index === messages.length - 1 ? messageScroll : null}
      >
        {content}
      </div>
      <div ref={messageScrollWidth}></div>
    </div>
  );
};

export default MessageUi;
