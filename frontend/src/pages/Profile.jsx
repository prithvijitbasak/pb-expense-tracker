import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "../assets/styles/Profile.css";
import ProfilePageShimmer from "../components/shimmerUIs/ProfilePageShimmer";

const Profile = () => {
  const { user, loading } = useContext(AuthContext);

  // 🌀 Show shimmer while loading user data
  if (loading) {
    return <ProfilePageShimmer />;
  }

  // ⚠️ If not loading but user data missing (e.g. not logged in)
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        No user data found. Please log in again.
      </div>
    );
  }

  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-100 flex items-center justify-center p-6">
      <div className="bg-white/90 backdrop-blur-md shadow-2xl rounded-2xl p-8 max-w-lg w-full border border-gray-200 relative overflow-hidden transition-transform duration-300 hover:scale-[1.01] hover:shadow-3xl">
        {/* Decorative Accent */}
        <div className="absolute top-0 left-0 w-full h-2 bg-[#4caf50] rounded-t-2xl"></div>

        {/* Header */}
        <div className="text-center mb-8 mt-2">
          <div className="flex items-center justify-center mb-3">
            <div className="w-20 h-20 rounded-full bg-[#4caf50]/10 flex items-center justify-center text-[#4caf50] text-3xl font-bold shadow-inner">
              {user.fullName?.charAt(0)}
            </div>
          </div>
          <h1 className="text-3xl font-semibold text-[#4caf50]">My Profile</h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage and view your personal details
          </p>
        </div>

        {/* Profile Details */}
        <div className="space-y-4">
          {[
            { label: "User ID", value: user._id },
            { label: "Full Name", value: user.fullName },
            { label: "Username", value: user.username },
            { label: "Email", value: user.email },
            { label: "Phone", value: user.phone },
          ].map((item, index) => (
            <div
              key={index}
              className="flex justify-between items-center bg-gray-50 px-4 py-3 rounded-lg hover:bg-[#4caf50]/5 transition"
            >
              <span className="font-medium text-gray-600">{item.label}:</span>
              <span className="text-gray-800 truncate max-w-[60%] text-right">
                {item.value || "—"}
              </span>
            </div>
          ))}

          <div className="flex justify-between items-center bg-gray-50 px-4 py-3 rounded-lg">
            <span className="font-medium text-gray-600">Are you an admin:</span>
            <span
              className={`font-semibold ${
                user.isAdmin ? "text-[#4caf50]" : "text-red-600"
              }`}
            >
              {user.isAdmin ? "Yes" : "No"}
            </span>
          </div>
        </div>

        {/* Edit Button */}
        <div className="text-center mt-8">
          <button className="px-6 py-2.5 bg-[#4caf50] text-white rounded-lg hover:bg-[#43a047] transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer">
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
