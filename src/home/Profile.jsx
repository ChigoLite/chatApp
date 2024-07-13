// UserProfile.js
import React, { useEffect, useState } from "react";
import { useGlobalHooks } from "../context";
import avater from "../assets/icons8-avatar-50.png";
import axios from "axios";
import Navber from "./navbar";
import { useParams } from "react-router-dom";
import Loading from "../loader/Loading";
import ProfileModal from "./profileModal";
import "./home.css";
const UserProfile = () => {
  const { profile, url } = useGlobalHooks();
  const [loading, setLoading] = useState(false);
  const [loadingImage, setLoadingImage] = useState(false);
  const [profileFetched, setProfileFetched] = useState([]);
  const [image, setImage] = useState([]);
  const [profileImage, setProfileImage] = useState([]);
  const [toggle, setToggle] = useState(false);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];

    if (file) {
      setFileToBase(file);
      setProfileImage(file);
      setToggle(true);
    }
  };

  const setFileToBase = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setImage(reader.result);
    };
  };
  const { id } = useParams();

  const uploadImage = async () => {
    setLoadingImage(true);
    try {
      const formData = new FormData();
      formData.append("image", profileImage);
      const { data } = await axios.post(`${url}/profile_pics`, formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (data.success === true) {
        setToggle(false);
        setProfileFetched((prev) => ({
          ...prev,
          profile: { ...prev.profile, image: data.upload.image },
        }));
      }
      setLoadingImage(false);
    } catch (error) {
      setLoadingImage(false);
      console.log(error);
    }
  };
  useEffect(() => {
    const User = async () => {
      setLoading(true);

      try {
        const { data } = await axios.get(`${url}/${id}/user_profile`, {
          withCredentials: true,
        });
        setProfileFetched(data);
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
      {loading ? (
        <Loading />
      ) : (
        <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden my-10">
          <div className="bg-cover bg-center h-20 p-4"></div>
          <div className="p-4">
            <div className="flex justify-center items-center -mt-16">
              <img
                src={
                  profileFetched?.profile?.image
                    ? profileFetched?.profile?.image
                    : avater
                }
                className="w-32 h-32 object-cover rounded-full border-4 border-white"
                alt="User Avatar"
              />
            </div>
            <div>
              <input
                type="file"
                id="imageUpload"
                accept=".png, .jpg, .jpeg"
                onChange={handleImageUpload}
              />
            </div>
            <div className="text-center mt-4">
              {profile?.userProfile?._id == id && (
                <label htmlFor="imageUpload" className="upload-button">
                  Choose Image
                </label>
              )}
              <h2 className="text-2xl font-semibold mt-4 text-gray-800">
                {profileFetched?.profile?.username}
              </h2>
              <p className="text-gray-600 mt-3">
                {profileFetched?.profile?.email}
              </p>
            </div>
          </div>
          <div className="p-4 border-t mt-4">
            <h3 className="text-lg font-semibold text-gray-700">Bio</h3>
            <p className="text-gray-600 text-sm mt-2">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris
              ipsum sit nibh amet egestas tellus.
            </p>
          </div>
          {toggle ? (
            <ProfileModal
              image={image}
              uploadImage={uploadImage}
              loading={loadingImage}
              toggle={toggle}
            />
          ) : null}
        </div>
      )}
    </>
  );
};

export default UserProfile;
