import React from "react";

const ProfileModal = ({ image, uploadImage, loading, toggle }) => {
  const upload = () => {
    uploadImage();
  };
  return (
    <div>
      {/* You can open the modal using document.getElementById('ID').showModal() method */}
      {/* <button
        className="btn"
        onClick={() => document.getElementById("my_modal_3").showModal()}
      >
        open modal
      </button> */}
      {toggle && document.getElementById("my_modal_3")?.showModal()}
      <dialog id="my_modal_3" className="modal">
        <div className="modal-box">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <div className="avatar-upload">
            <div className="avatar-preview">
              {image ? (
                <img src={image} alt="Avatar" />
              ) : (
                <div className="avatar-placeholder">
                  <span>Upload Image</span>
                </div>
              )}
            </div>
            <button
              disabled={loading}
              onClick={upload}
              className="btn bg-pink-700 text-white p-2 rounded-lg w-32"
            >
              {loading && <span className="loading loading-spinner"></span>}
              upload
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default ProfileModal;
