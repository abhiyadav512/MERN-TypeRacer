import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
// import Modal from "../components/profile/Modal";
import UpdateProfileForm from "../components/profile/UpdateProfile";
import { fetchGameHistory, fetchProfile, getProfile, updateProfile,  } from "../store/Slice/profileSlice";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../components/Spinner";

const Profile = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(""); // "followers" or "following" or "update"
  const dispatch = useDispatch();
  const { profile, status,gameHistory ,error } = useSelector(getProfile);


  const handleOpenModal = (type) => {
    setModalType(type);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalType("");
  };

  const handleUpdate = (updatedData) => {
    // Update user data logic here
    // console.log("Updated Data:", updatedData);
    dispatch(updateProfile(updatedData)); // Dispatch async thunk to update profile
    handleCloseModal(); // Close the modal after updating
  };


  useEffect(() => {
    dispatch(fetchProfile())
    dispatch(fetchGameHistory(profile.username)); // Fetch user's game history based on username
  }, [dispatch,profile.username])

  return (
    <div className="my-16  text-lightText dark:text-darkText p-6 md:p-10 lg:p-16 rounded-lg  max-w-md mx-auto transition-colors duration-300">
      {/* Profile Picture */}
      <div className="flex justify-center mb-6">
        {status === "loading" ? (<Spinner/>) : (
          <img
            src={profile.profilePicture}
            alt="Profile"
            className="w-40 h-40 rounded-full shadow-md object-cover obj border-4 border-lightBackground dark:border-darkBackground"
          />
        )}
      </div>

      {/* Username */}
      <div className="text-center mb-2">
        <h2 className="text-xl font-semibold">{profile.username}</h2>
      </div>
      <div className="text-center mb-6">
      </div>

      

      {/* Buttons */}
      <div className="flex justify-center gap-4 pt-2">
        <button
          onClick={() => handleOpenModal("update")}
          className="px-6 py-2 bg-darkBackground dark:bg-lightBackground hover:bg-lightBackground dark:hover:bg-darkBackground text-lightBackground dark:text-darkBackground hover:text-darkBackground dark:hover:text-lightBackground border-2 border-darkBackground dark:border-lightBackground font-semibold rounded-lg transition-colors duration-300"
        >
          Edit Profile
        </button>
      </div>

     

      {/* Modal for Update Profile Form */}
      {showModal && modalType === "update" && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-lightBackground dark:bg-darkBackground text-lightText dark:text-darkText p-6 rounded-lg  max-w-sm w-full">
            <UpdateProfileForm
              profile={profile}
              handleUpdate={handleUpdate}
              handleClose={handleCloseModal}
            />
          </div>
        </div>
      )}

      <div className="mt-8">
        <h3 className="text-lg font-bold text-lightText dark:text-darkText">Game History</h3>
        {status === "loading" ? (
          <Spinner />
        ) : (
          <div className="mt-4">
            {gameHistory.length > 0 ? (
              <ul className="space-y-4">
                
                {gameHistory.map((game, index) => (
                  <div
                    key={index}
                    className="flex flex-col md:flex-row justify-between bg-lightBackground dark:bg-darkBackground p-4 rounded-lg shadow-md"
                  >
                    {/* Game Info */}
                    <div className="flex-1">
                      <p className="text-lightText dark:text-darkText">
                        <strong>Date:</strong> {new Date(game.date).toLocaleString()}
                      </p>
                      <p className="text-lightText dark:text-darkText">
                        <strong>Room:</strong> {game.roomId}
                      </p>
                      <p className="text-lightText dark:text-darkText">
                        <strong>Winner:</strong> {game.winner.username}
                      </p>
                      <p className="text-lightText dark:text-darkText">
                        <strong>Your WPM:</strong>{" "}
                        {game.players.find((p) => p.username === profile.username)?.wpm}
                      </p>
                      <p className="text-lightText dark:text-darkText">
                        <strong>Your Accuracy:</strong>{" "}
                        {game.players.find((p) => p.username === profile.username)?.accuracy}%
                      </p>
                    </div>

                    {/* Player Info */}
                    <div className="flex-1 mt-4 md:mt-0 md:ml-8">
                      <h4 className="font-bold text-lightText dark:text-darkText">Players:</h4>
                      <ul className="mt-2 space-y-2">
                        {game.players.map((player, playerIndex) => (
                          <li
                            key={playerIndex}
                            className="p-2 border rounded-lg dark:border-gray-700 border-gray-300"
                          >
                            <p className="text-lightText dark:text-darkText">
                              <strong>Username:</strong> {player.username}
                            </p>
                            <p className="text-lightText dark:text-darkText">
                              <strong>WPM:</strong> {player.wpm}
                            </p>
                            <p className="text-lightText dark:text-darkText">
                              <strong>Accuracy:</strong> {player.accuracy}%
                            </p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </ul>
            ) : (
              <p className="text-lightText dark:text-darkText">No game history found.</p>
            )}
          </div>
        )}
      </div>



    </div>
  );
};

export default Profile;
