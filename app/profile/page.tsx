"use client";
import React, { useEffect, useState } from "react";

const ProfilePage = () => {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <div className="min-h-screen bg-black text-white px-6 py-10">
      <h1 className="text-4xl font-bold text-cyan-400 mb-8">Your Profile</h1>

      <div className="bg-gradient-to-br from-[#0a0f1c] to-[#121a2c] border border-cyan-400 rounded-2xl shadow-xl p-8 max-w-3xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
          <img
            src="https://i.redd.it/5560va6tsg191.jpg"
            alt="Profile"
            className="w-28 h-28 rounded-full border-4 border-cyan-400 shadow-md"
          />
          <div className="text-center sm:text-left">
            <h2 className="text-2xl font-semibold text-cyan-300">{user?.name || "Guest User"}</h2>
            <p className="text-gray-400">Email: {user?.email || "Not Logged In"}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-[#0f172a] p-4 rounded-xl border border-cyan-800">
            <h3 className="text-lg font-medium text-cyan-300 mb-2">Preferences</h3>
            <ul className="space-y-1 text-sm text-gray-300">
              <li>🔔 Notifications: Enabled</li>
              <li>🌐 Language: English</li>
              <li>🎯 Expiry Alerts: 7 days before</li>
            </ul>
          </div>

          <div className="bg-[#0f172a] p-4 rounded-xl border border-cyan-800">
            <h3 className="text-lg font-medium text-cyan-300 mb-2">Account Stats</h3>
            <ul className="space-y-1 text-sm text-gray-300">
              <li>🍎 Items Tracked: 58</li>
              <li>📦 Items Expired: 3</li>
              <li>🥗 Recipes Suggested: 14</li>
            </ul>
          </div>
        </div>

        <div className="flex justify-between mt-6">
          <button className="bg-cyan-500 hover:bg-cyan-600 text-black font-bold py-2 px-4 rounded-xl transition">
            ✏️ Edit Profile
          </button>
          <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-xl transition">
            🚪 Log Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
