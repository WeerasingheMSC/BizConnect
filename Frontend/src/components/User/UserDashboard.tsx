import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaBookmark, FaUser, FaMapMarkerAlt } from 'react-icons/fa';
import { getUserProfile } from '../../services/userService';
import type { UserProfile } from '../../services/userService';

const UserDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await getUserProfile();
      if (response.success) {
        setUser(response.user);
      }
    } catch (err: any) {
      if (err.response?.status === 401) {
        navigate('/signin');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/signin');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <img src="/Logo.png" alt="BizConnect Logo" className="h-10 w-10 rounded-full" />
              <h1 className="ml-3 text-2xl font-bold text-gray-800">BizConnect</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user?.name}!</span>
              <button
                onClick={handleLogout}
                className="bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition-all duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Dashboard Header */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              User Dashboard
            </h2>
            <p className="text-gray-600 mb-2">
              Account Type: <span className="font-semibold text-amber-600 uppercase">{user?.userType}</span>
            </p>
            <p className="text-gray-600">
              Email: <span className="font-semibold">{user?.email}</span>
            </p>
          </div>
        {/* User Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Bookmarked Businesses</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{user?.bookmarks?.length || 0}</p>
              </div>
              <div className="bg-amber-100 p-4 rounded-full">
                <FaBookmark className="text-amber-600 text-2xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Account Type</p>
                <p className="text-3xl font-bold text-gray-800 mt-2 capitalize">{user?.userType}</p>
              </div>
              <div className="bg-blue-100 p-4 rounded-full">
                <FaUser className="text-blue-600 text-2xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Member Since</p>
                <p className="text-lg font-bold text-gray-800 mt-2">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                </p>
              </div>
              <div className="bg-green-100 p-4 rounded-full">
                <FaUser className="text-green-600 text-2xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button
              onClick={() => navigate('/user/search')}
              className="bg-white rounded-lg shadow-md p-8 hover:shadow-xl transition-all duration-200 text-left group"
            >
              <div className="flex items-center">
                <div className="bg-amber-100 p-4 rounded-full group-hover:bg-amber-200 transition-colors">
                  <FaSearch className="text-amber-600 text-3xl" />
                </div>
                <div className="ml-6">
                  <h3 className="text-xl font-bold text-gray-800 group-hover:text-amber-600 transition-colors">
                    Search Businesses
                  </h3>
                  <p className="text-gray-600 mt-1">Discover local services and businesses</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => navigate('/user/bookmarks')}
              className="bg-white rounded-lg shadow-md p-8 hover:shadow-xl transition-all duration-200 text-left group"
            >
              <div className="flex items-center">
                <div className="bg-blue-100 p-4 rounded-full group-hover:bg-blue-200 transition-colors">
                  <FaBookmark className="text-blue-600 text-3xl" />
                </div>
                <div className="ml-6">
                  <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                    My Bookmarks
                  </h3>
                  <p className="text-gray-600 mt-1">View your saved businesses</p>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* User Profile Card */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Profile Information</h2>
          <div className="space-y-4">
            <div className="flex items-center pb-4 border-b border-gray-200">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {user?.name.charAt(0).toUpperCase()}
              </div>
              <div className="ml-6">
                <h3 className="text-xl font-bold text-gray-800">{user?.name}</h3>
                <p className="text-gray-600">{user?.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Account Type</label>
                <p className="text-lg font-semibold text-gray-800 capitalize">{user?.userType}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Member Since</label>
                <p className="text-lg font-semibold text-gray-800">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tips Section */}
        <div className="mt-8 bg-gradient-to-r from-amber-50 to-amber-100 rounded-lg p-8 border border-amber-200">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <FaMapMarkerAlt className="mr-3 text-amber-600" />
            Getting Started
          </h3>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start">
              <span className="text-amber-600 font-bold mr-3">1.</span>
              <span>Use the <strong>Search</strong> feature to discover businesses by category, location, or services</span>
            </li>
            <li className="flex items-start">
              <span className="text-amber-600 font-bold mr-3">2.</span>
              <span>Click on any business to view detailed information including services, hours, and contact details</span>
            </li>
            <li className="flex items-start">
              <span className="text-amber-600 font-bold mr-3">3.</span>
              <span><strong>Bookmark</strong> your favorite businesses for quick access later</span>
            </li>
            <li className="flex items-start">
              <span className="text-amber-600 font-bold mr-3">4.</span>
              <span>Contact businesses directly via phone, email, or visit their website</span>
            </li>
          </ul>
        </div>
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;
