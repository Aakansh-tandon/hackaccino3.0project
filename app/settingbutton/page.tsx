'use client';

import { useState } from 'react';

const SettingsPage = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [language, setLanguage] = useState('EN');

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'EN' ? 'हिंदी' : 'EN'));
  };

  return (
    <div className="min-h-screen px-6 py-10 bg-black text-white">
      <div className="max-w-3xl mx-auto space-y-8">
      <h1 className="text-4xl font-bold text-cyan-400 mb-8">Settings</h1>


        {/* Section Wrapper */}
        <div className="bg-gradient-to-br from-[#0d1117] to-[#0c0c0c] border border-cyan-800 p-6 rounded-2xl shadow-lg space-y-6">

          {/* Profile Info */}
          <section>
            <h2 className="text-2xl font-semibold text-cyan-300 mb-2">👤 Profile Info</h2>
            <p className="text-sm text-gray-400">Manage your profile details and preferences.</p>
          </section>

          {/* Theme Toggle */}
          <section className="flex justify-between items-center border border-cyan-700 p-4 rounded-xl bg-[#0f172a]">
            <h2 className="text-lg font-medium text-cyan-300">🌓 Theme</h2>
            <button
              onClick={toggleTheme}
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-md font-medium text-white"
            >
              {isDarkMode ? 'Light Mode' : 'Dark Mode'}
            </button>
          </section>

          {/* Change Password */}
          <section className="border border-cyan-700 p-4 rounded-xl bg-[#0f172a]">
            <h2 className="text-lg font-medium text-cyan-300 mb-1">🔒 Change Password</h2>
            <p className="text-sm text-gray-400">Update your account password securely.</p>
          </section>

          {/* Manage Account */}
          <section className="border border-cyan-700 p-4 rounded-xl bg-[#0f172a]">
            <h2 className="text-lg font-medium text-cyan-300 mb-1">⚙️ Manage Account</h2>
            <p className="text-sm text-gray-400">Update account-related settings and preferences.</p>
          </section>

          {/* Delete Account */}
          <section className="border border-red-600 p-4 rounded-xl bg-[#1a1a1a]">
            <h2 className="text-lg font-medium text-red-400 mb-1">🗑️ Delete Account</h2>
            <p className="text-sm text-gray-400">Permanently delete your account and data.</p>
            <button className="mt-3 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md">
              Delete Account
            </button>
          </section>

          {/* Language Switch */}
          <section className="flex justify-between items-center border border-cyan-700 p-4 rounded-xl bg-[#0f172a]">
            <h2 className="text-lg font-medium text-cyan-300">🌐 Language</h2>
            <button
              onClick={toggleLanguage}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-md text-white"
            >
              {language === 'EN' ? 'हिंदी' : 'EN'}
            </button>
          </section>

          {/* Logout */}
          <section className="flex justify-end">
            <button className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md font-semibold">
              🚪 Logout
            </button>
          </section>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
