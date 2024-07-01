// UserProfile.js
import React, { useEffect, useState } from "react";
import { useGlobalHooks } from "../context";
import avater from "../assets/icons8-avatar-50.png";
const url = "http://localhost:2020/api/v1";
import axios from "axios";
import Navber from "./navbar";
import { useParams } from "react-router-dom";
const UserProfile = () => {
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState([]);
  const { id } = useParams();
  useEffect(() => {
    const User = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`${url}/${id}/user_profile`, {
          withCredentials: true,
        });
        setProfile(data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.log("====================================");
        console.log(error);
        console.log("====================================");
      }
    };
    User();
  }, [id]);
  return (
    <>
      <Navber />

      <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden my-10">
        <div className="bg-cover bg-center h-20 p-4"></div>
        <div className="p-4">
          <div className="flex justify-center items-center -mt-16">
            <img
              className="w-32 h-32 object-cover rounded-full border-4 border-white"
              src={profile?.profile?.image ? profile?.profile?.image : avater}
              alt="User Avatar"
            />
          </div>
          <div className="text-center mt-2">
            <h2 className="text-2xl font-semibold text-gray-800">
              {profile?.profile?.username}
            </h2>
            <p className="text-gray-600">{profile?.profile?.email}</p>
          </div>
        </div>
        <div className="p-4 border-t mt-4">
          <h3 className="text-lg font-semibold text-gray-700">Bio</h3>
          <p className="text-gray-600 text-sm mt-2">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris
            ipsum sit nibh amet egestas tellus.
          </p>
        </div>
      </div>
    </>
  );
};

export default UserProfile;
