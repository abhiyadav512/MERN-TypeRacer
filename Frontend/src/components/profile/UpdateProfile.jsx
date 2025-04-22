import React, { useEffect, useState } from "react";

const UpdateProfileForm = ({ profile, handleUpdate, handleClose }) => {
    const [formData, setFormData] = useState({
        username: profile.username || "",
        profilePicture: profile.profilePicture || "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg",
    });
    const [imagePreview, setImagePreview] = useState(profile.profilePicture || "");
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };


    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImagePreview(URL.createObjectURL(file));
            setFormData((prev) => ({ ...prev, profilePicture: file }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleUpdate(formData); // Pass form data back to parent for API handling
    };

    return (
        <div className="bg-lightBackground dark:bg-darkBackground text-lightText dark:text-darkText p-6 rounded-lg  w-full max-w-sm">
            <h2 className="text-xl font-semibold mb-4">Update Profile</h2>

            <form onSubmit={handleSubmit}>
                {/* Username */}
                <div className="mb-4">
                    <label htmlFor="username" className="block text-sm font-medium mb-2">
                        Username
                    </label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        className="w-full p-3 border rounded-lg bg-lightBackground dark:bg-darkBackground text-darkBackground dark:text-lightBackground"
                        required
                    />
                </div>


                {/* Profile Picture */}
                <div className="mb-4">
                    <label htmlFor="profilePicture" className="block text-sm font-medium mb-2">
                        Profile Picture
                    </label>
                    <input
                        type="file"
                        id="profilePicture"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="block w-full text-sm"
                    />
                    {imagePreview && (
                        <div className="mt-4 text-center">
                            <img
                                src={imagePreview}
                                alt="Preview"
                                className="w-24 h-24 rounded-full object-cover shadow-md"
                            />
                        </div>
                    )}
                </div>

                {/* Submit Button */}
                <div className="flex justify-center gap-4 pt-2">
                    <button
                        type="submit"
                        className="px-6 py-2 bg-darkBackground dark:bg-lightBackground hover:bg-lightBackground dark:hover:bg-darkBackground text-lightBackground dark:text-darkBackground hover:text-darkBackground dark:hover:text-lightBackground border-2 border-darkBackground dark:border-lightBackground font-semibold rounded-lg transition-colors duration-300"
                    >
                        Save Changes
                    </button>
                    <button
                        type="button"
                        onClick={handleClose}
                        className="px-6 py-2 bg-darkBackground dark:bg-lightBackground hover:bg-lightBackground dark:hover:bg-darkBackground text-lightBackground dark:text-darkBackground hover:text-darkBackground dark:hover:text-lightBackground border-2 border-darkBackground dark:border-lightBackground font-semibold rounded-lg transition-colors duration-300"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UpdateProfileForm;
