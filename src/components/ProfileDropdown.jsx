import React, { useState, useRef, useEffect } from 'react';
import { Store, Settings, HelpCircle, LogOut, ArrowLeft, Bell } from 'lucide-react';

const ProfileDropdown = ({ 
  userName = "Enoch Chukwudi", 
  userEmail = "zinnyhairs@gmail.com",
  userImage,
  notificationCount = 3,
  onMyStoreClick,
  onSettingsClick,
  onSupportClick,
  onSignOutClick,
  showNotifications = true,
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const handleMyStore = () => {
    setIsOpen(false);
    if (onMyStoreClick) onMyStoreClick();
  };

  const handleSettings = () => {
    setIsOpen(false);
    if (onSettingsClick) onSettingsClick();
  };

  const handleSupport = () => {
    setIsOpen(false);
    if (onSupportClick) onSupportClick();
  };

  const handleSignOut = () => {
    setIsOpen(false);
    if (onSignOutClick) onSignOutClick();
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Profile Button with Notification */}
      <div className="flex items-center gap-2">
        {/* Notification Icon */}
        {showNotifications && notificationCount > 0 && (
          <button className="relative flex items-center justify-center h-10 w-10 rounded-full hover:bg-gray-100 mr-3">
            <Bell size={18} className="text-gray-600" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
              {notificationCount}
            </span>
          </button>
        )}
        
        {/* Profile Image Button */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="hover:opacity-80 transition-opacity focus:outline-none"
        >
          <img 
            src={userImage || '/src/assets/admin.png'} 
            alt="Profile" 
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
          />
        </button>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          {/* User Info Section */}
          <div className="p-4 border-b border-gray-200">
            <div>
              <p className="font-semibold text-gray-900">{userName}</p>
              <p className="text-sm text-gray-500">{userEmail}</p>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            <button 
              onClick={handleMyStore}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Store size={16} className="text-gray-500" />
              <span>Manage Store</span>
            </button>

            <button 
              onClick={handleSettings}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Settings size={16} className="text-gray-500" />
              <span>Account settings</span>
            </button>

            <button 
              onClick={handleSupport}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <HelpCircle size={16} className="text-gray-500" />
              <span>Support</span>
            </button>

            <div className="border-t border-gray-200 my-2"></div>

            <button 
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <ArrowLeft size={16} />
              <span>Sign out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
