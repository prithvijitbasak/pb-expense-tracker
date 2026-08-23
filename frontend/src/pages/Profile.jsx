import { useContext, useRef, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import "../assets/styles/Profile.css";
import ProfilePageShimmer from "../components/shimmerUIs/ProfilePageShimmer";
import { API } from "@/utils/auth";
import { toast } from "react-toastify";
import Loader from "@/icons/Loader";
import DeleteImageConfirmModal from "@/components/DeleteImageConfirmModal";

const Profile = () => {
  const { user, loading, setUser } = useContext(AuthContext);
  const fileInputRef = useRef(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [openDeleteConfirmBox, setOpenDeleteConfirmBox] = useState(false);

  // 1. Trigger the hidden file input
  const handleImageEditClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // 2. Handle the file selection for upload
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageUploading(true);
      console.log("Selected new image:", file);
      const formData = new FormData();
      formData.append("image", file);
      try {
        const response = await fetch(`${API}/api/users/upload-image`, {
          method: "POST",
          credentials: "include",
          body: formData,
        });

        const data = await response.json();

        if (response.ok) {
          toast.success(data.message);
          setUser((prev) => ({
            ...prev,
            image: data.image,
          }));
          setImageUploading(false);
        } else {
          console.log("Image uploading failed: ", data.message);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setImageUploading(false);
      }
    }
  };

  const handleRemoveImage = () => {
    setOpenDeleteConfirmBox(true);
  };

  const handleImageDeleteSuccess = () => {
   
    setOpenDeleteConfirmBox(false);
    
    
    setUser((prev) => ({
      ...prev,
      image: null, 
    }));
  };

  if (loading) {
    return <ProfilePageShimmer />;
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600 bg-gray-50">
        No user data found. Please log in again.
      </div>
    );
  }

  const hasImage = user.image && user.image.data;

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-100 flex items-center justify-center p-6">
        <div className="bg-white/90 backdrop-blur-md shadow-2xl rounded-2xl p-8 max-w-lg w-full border border-gray-200 relative overflow-hidden transition-transform duration-300 hover:scale-[1.01] hover:shadow-3xl">
          {/* Decorative Accent */}
          <div className="absolute top-0 left-0 w-full h-2 bg-[#4caf50] rounded-t-2xl"></div>

          {/* Header & Profile Picture Section */}
          <div className="flex flex-col items-center justify-center mb-8 mt-2 relative">
            <div className="relative group w-fit">
              {hasImage ? (
                <div className="h-50 w-50 flex items-center justify-center">
                  {imageUploading ? (
                    <Loader className="w-12 h-12" color="#3B82F6" />
                  ) : (
                    <img
                      src={`data:${user.image.contentType};base64,${user.image.data}`}
                      alt="User Profile"
                      className="block h-full w-full rounded-lg object-contain border-4 border-white shadow-lg"
                    />
                  )}
                </div>
              ) : (
                <div className="w-80 h-50 rounded-md bg-[#4caf50]/10 flex items-center justify-center text-[#4caf50] text-6xl font-bold shadow-inner border-4 border-white">
                  {user.fullName ? user.fullName.charAt(0).toUpperCase() : "U"}
                </div>
              )}

              {hasImage && (
                <button
                  onClick={handleRemoveImage}
                  className="absolute bottom-2 left-2 bg-red-500 p-2.5 rounded-full text-white shadow-md hover:bg-red-600 hover:scale-110 transition-all cursor-pointer border-2 border-white"
                  title="Remove Profile Picture"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              )}

              <button
                onClick={handleImageEditClick}
                className="absolute bottom-2 right-2 bg-[#4caf50] p-2.5 rounded-full text-white shadow-md hover:bg-[#43a047] hover:scale-110 transition-all cursor-pointer border-2 border-white"
                title={
                  hasImage ? "Change Profile Picture" : "Upload Profile Picture"
                }
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
              </button>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                className="hidden"
                accept="image/*"
              />
            </div>

            <h1 className="text-3xl font-semibold text-gray-800 mt-5">
              {user.fullName}
            </h1>
            <p className="text-gray-500 text-sm mt-1 bg-gray-100 px-3 py-1 rounded-full">
              @{user.username}
            </p>
          </div>

          {/* Profile Details List */}
          <div className="space-y-4">
            {[
              { label: "Email", value: user.email },
              { label: "Phone", value: user.phone },
              { label: "Timezone", value: user.timezone },
            ].map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center bg-gray-50 px-4 py-3 rounded-lg hover:bg-[#4caf50]/5 transition"
              >
                <span className="font-medium text-gray-600">{item.label}:</span>
                <span className="text-gray-800 truncate max-w-[60%] text-right font-medium">
                  {item.value || "—"}
                </span>
              </div>
            ))}

            {/* Admin Badge */}
            <div className="flex justify-between items-center bg-gray-50 px-4 py-3 rounded-lg hover:bg-[#4caf50]/5 transition">
              <span className="font-medium text-gray-600">Admin Status:</span>
              <span
                className={`font-bold ${user.isAdmin ? "text-[#4caf50]" : "text-gray-400"}`}
              >
                {user.isAdmin ? "Admin" : "Standard User"}
              </span>
            </div>
          </div>

          {/* Main Edit Button */}
          <div className="text-center mt-8">
            <button className="w-full py-3 bg-[#4caf50] text-white font-medium rounded-lg hover:bg-[#43a047] transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer">
              Edit Account Details
            </button>
          </div>
        </div>
      </div>

      {openDeleteConfirmBox && (
        <DeleteImageConfirmModal
          onClose={() => setOpenDeleteConfirmBox(false)}
          onDeleted={handleImageDeleteSuccess}
        />
      )}
    </>
  );
};

export default Profile;
