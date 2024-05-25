import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useGlobalHooks } from "../context";

const Room = () => {
  const { socketIO, me } = useGlobalHooks();
  const { id } = useParams();

  useEffect(() => {
    if (me) {
      socketIO.emit("join-room", { roomId: id, peerId: me._id });
    }
  }, [id, me, socketIO]);

  return <div>room id {id}</div>;
};

export default Room;
