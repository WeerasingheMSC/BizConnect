import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBookmark, FaMapMarkerAlt, FaEye, FaTrash, FaArrowLeft, FaSearch } from 'react-icons/fa';
import { getBookmarks, removeBookmark } from '../../services/userService';
import type { Bookmark } from '../../services/userService';

const UserBookmarks = () => {
  const navigate = useNavigate();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const fetchBookmarks = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await getBookmarks();
      if (response.success) {
        setBookmarks(response.bookmarks || []);
      }
    } catch (err: any) {
      if (err.response?.status === 401) {
        navigate('/signin');
      } else {
        setError(err.response?.data?.message || 'Failed to fetch bookmarks');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveBookmark = async (businessId: string) => {
    try {
      await removeBookmark(businessId);
      setBookmarks(bookmarks.filter(b => b._id !== businessId));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to remove bookmark');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/user/dashboard')}
                className="flex items-center text-gray-700 hover:text-amber-600 transition-colors"
              >
                <FaArrowLeft className="mr-2" />
                <span className="font-semibold">Back to Dashboard</span>
              </button>
            </div>
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-800 flex items-center">
                <FaBookmark className="mr-2" />
                My Bookmarks
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/user/search')}
                className="flex items-center bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition-all duration-200"
              >
                <FaSearch className="mr-2" />
                Search Businesses
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
            <p className="mt-4 text-gray-600">Loading bookmarks...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && bookmarks.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <FaBookmark className="mx-auto text-6xl text-gray-300 mb-4" />
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">No bookmarks yet</h3>
            <p className="text-gray-500 mb-4">Start exploring and bookmark your favorite businesses</p>
            <button
              onClick={() => navigate('/user/search')}
              className="bg-amber-500 text-white px-6 py-3 rounded-lg hover:bg-amber-600 transition-all duration-200 font-semibold"
            >
              Discover Businesses
            </button>
          </div>
        )}

        {/* Bookmarks Grid */}
        {!loading && bookmarks.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookmarks.map((business) => (
              <div
                key={business._id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-200"
              >
                {/* Business Logo */}
                <div
                  className="h-48 bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center cursor-pointer"
                  onClick={() => navigate(`/user/business/${business._id}`)}
                >
                  {business.logo ? (
                    <img
                      src={business.logo}
                      alt={business.businessName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-amber-600 text-6xl font-bold">
                      {business.businessName.charAt(0)}
                    </div>
                  )}
                </div>

                {/* Business Info */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-bold text-gray-800 flex-1">
                      {business.businessName}
                    </h3>
                    <button
                      onClick={() => handleRemoveBookmark(business._id)}
                      className="text-red-500 hover:text-red-700 ml-2"
                      title="Remove bookmark"
                    >
                      <FaTrash />
                    </button>
                  </div>

                  <span className="inline-block bg-amber-100 text-amber-800 text-xs px-3 py-1 rounded-full font-semibold mb-3">
                    {business.category}
                  </span>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {business.description}
                  </p>

                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <FaMapMarkerAlt className="mr-2" />
                    {business.address.city}, {business.address.state}
                  </div>

                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <FaEye className="mr-2" />
                    {business.views || 0} views
                  </div>

                  <button
                    onClick={() => navigate(`/user/business/${business._id}`)}
                    className="w-full bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition-all duration-200 font-semibold"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserBookmarks;
