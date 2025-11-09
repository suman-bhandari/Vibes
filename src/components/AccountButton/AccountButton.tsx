import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import LoginModal from './LoginModal';

const AccountButton: React.FC = () => {
  const { user, logout } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed top-4 right-4 z-50 flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        aria-label="Account"
      >
        {user ? (
          <>
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="hidden sm:block">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 block">
                {user.name}
              </span>
              <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                <span>Trust: {user.reputation.toFixed(1)} 🤝</span>
                <span>|</span>
                <span>Exp: {user.karma >= 1000 ? `${(user.karma / 1000).toFixed(1)}k` : user.karma} ♠️</span>
              </div>
            </div>
          </>
        ) : (
          <>
            <svg
              className="w-5 h-5 text-gray-700 dark:text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <span className="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-300">
              Sign In
            </span>
          </>
        )}
      </button>

      {isModalOpen && (
        <LoginModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onLogout={logout}
        />
      )}
    </>
  );
};

export default AccountButton;

