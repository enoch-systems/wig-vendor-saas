import React, { useState } from 'react';
import { Edit, Save, MapPin } from 'lucide-react';
import adminIcon from '../../assets/admin.png';

const Settings = () => {
  const [formData, setFormData] = useState({
    firstName: 'Enoch',
    lastName: 'Chukwudi',
    email: 'zinnyhairs@gmail.com',
    phone: '+09 363 398 46',
    bio: 'Owner',
    country: 'Nigeria',
    city: 'Owerri, Imo State, Nigeria.',
    postalCode: '460021',
    businessName: '',
    category: 'Laundry',
    companyId: '#PR-125665-A7',
    image: adminIcon
  });

  const [editingSection, setEditingSection] = useState(null);
  const [tempData, setTempData] = useState(null);

  // Always call hooks, even if component might not render
  const handleInputChange = (field, value) => {
    setTempData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const startEditing = (section) => {
    setTempData(formData);
    setEditingSection(section);
  };

  const saveChanges = () => {
    if (tempData) {
      setFormData(tempData);
      setEditingSection(null);
      setTempData(null);
    }
  };

  const cancelEditing = () => {
    setEditingSection(null);
    setTempData(null);
  };

  const data = editingSection ? tempData : formData;

  // Early return if data is not available
  if (!data) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Profile Header */}
      <div className="text-sm font-medium text-gray-700 mb-4">Profile</div>

      {/* Profile Card */}
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <div className="flex flex-col items-center text-center">
          <img 
            src={data.image} 
            alt="Profile" 
            className="w-24 h-24 rounded-full object-cover mb-4"
          />
          <h2 className="text-xl font-semibold mb-2">{data.firstName} {data.lastName}</h2>
          <p className="text-sm text-gray-600 mb-2">(Business Owner)</p>
          <p className="text-sm text-gray-600 mb-2">Industry: Beauty & Personal Care</p>
          <p className="text-sm text-gray-600 mb-2">Business name: Zinny Hairs</p>
          <p className="text-sm text-gray-600 mb-2">User ID: 675-31</p>
          <p className="text-sm text-gray-600 mb-2"><MapPin size={16} className="inline mr-1" />{data.businessName}{data.city}</p>
          
        </div>
      </div>

      {/* Personal Information Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <h3 className="text-lg font-semibold mb-6">Personal Information</h3>

        {editingSection === 'personal' ? (
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-gray-500 mb-2">First Name</label>
              <input
                type="text"
                value={data.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-2">Last Name</label>
              <input
                type="text"
                value={data.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-2">Email address</label>
              <input
                type="email"
                value={data.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-2">Phone</label>
              <input
                type="tel"
                value={data.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-2">Bio</label>
              <input
                type="text"
                value={data.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex gap-3 justify-end pt-4">
              <button
                onClick={cancelEditing}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={saveChanges}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Save size={18} />
                Save Changes
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <p className="text-xs text-gray-500 mb-1">First Name</p>
              <p className="text-sm font-medium">{data.firstName}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Last Name</p>
              <p className="text-sm font-medium">{data.lastName}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Email address</p>
              <p className="text-sm font-medium">{data.email}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Phone</p>
              <p className="text-sm font-medium">{data.phone}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Bio</p>
              <p className="text-sm font-medium">{data.bio}</p>
            </div>

          </div>
        )}
      </div>

      {/* Address Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <h3 className="text-lg font-semibold mb-6">Address</h3>

        {editingSection === 'address' ? (
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-gray-500 mb-2">Country</label>
              <input
                type="text"
                value={data.country}
                onChange={(e) => handleInputChange('country', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-2">City/State</label>
              <input
                type="text"
                value={data.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-2">Postal Code</label>
              <input
                type="text"
                value={data.postalCode}
                onChange={(e) => handleInputChange('postalCode', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex gap-3 justify-end pt-4">
              <button
                onClick={cancelEditing}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={saveChanges}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Save size={18} />
                Save Changes
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <p className="text-xs text-gray-500 mb-1">Country</p>
              <p className="text-sm font-medium">{data.country}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">City/State</p>
              <p className="text-sm font-medium">{data.city}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Postal Code</p>
              <p className="text-sm font-medium">{data.postalCode}</p>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
