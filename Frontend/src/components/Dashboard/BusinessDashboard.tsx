import { useNavigate } from 'react-router-dom';
import { logout, getStoredUser } from '../../services/authService';
import { useState, useEffect } from 'react';
import { getMyBusiness } from '../../services/businessService';
import NotificationBell from '../Notifications/NotificationBell';

const BusinessDashboard = () => {
  const navigate = useNavigate();
  const user = getStoredUser();
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const data = await getMyBusiness();
        if (data.success && data.businesses) {
          setBusinesses(data.businesses);
        }
      } catch (error) {
        console.error('Error fetching businesses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBusinesses();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <img src="/Logo.png" alt="BizConnect Logo" className="h-10 w-10 rounded-full" />
              <h1 className="ml-3 text-2xl font-bold text-gray-800">BizConnect Business</h1>
            </div>
            <div className="flex items-center space-x-4">
              <NotificationBell />
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
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Business Owner Dashboard
            </h2>
            <p className="text-gray-600 mb-2">
              Account Type: <span className="font-semibold text-amber-600 uppercase">{user?.userType}</span>
            </p>
            <p className="text-gray-600 mb-8">
              Email: <span className="font-semibold">{user?.email}</span>
            </p>

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
              </div>
            ) : businesses && businesses.length > 0 ? (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-800">
                    My Businesses ({businesses.length})
                  </h3>
                  <button
                    onClick={() => navigate('/business/profile')}
                    className="bg-amber-500 text-white px-6 py-2 rounded-lg hover:bg-amber-600 transition-all duration-200 shadow-md"
                  >
                    + Add New Business
                  </button>
                </div>

                {/* Business Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {businesses.map((business) => (
                    <div
                      key={business._id}
                      onClick={() => navigate(`/business/detail/${business._id}`)}
                      className="p-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border-l-4 border-amber-500 cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                    >
                      <div className="flex items-start space-x-4">
                        {/* Logo */}
                        {business.logo && (
                          <div className="shrink-0">
                            <img
                              src={business.logo}
                              alt={business.businessName}
                              className="w-20 h-20 rounded-lg object-cover shadow-md border-2 border-amber-300"
                            />
                          </div>
                        )}

                        {/* Business Info */}
                        <div className="flex-1">
                          <h4 className="text-xl font-bold text-gray-800 mb-2">{business.businessName}</h4>
                          <p className="text-gray-600 mb-2">
                            <span className="inline-block bg-amber-200 text-amber-800 px-3 py-1 rounded-full text-xs font-semibold">
                              {business.category}
                            </span>
                          </p>
                          <p className="text-sm text-gray-600 mb-2">{business.contactEmail}</p>
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-600">
                              <span className="font-semibold">Views:</span> {business.views || 0}
                            </p>
                            <p className="text-xs text-amber-600 font-semibold">Click to view details →</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-8 bg-amber-50 rounded-lg border-l-4 border-amber-500">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  🎉 Welcome to BizConnect!
                </h3>
                <p className="text-gray-700 mb-6">
                  You haven't created any business profiles yet. Get started by creating your first business profile to showcase your businesses and services!
                </p>
                <button
                  onClick={() => navigate('/business/profile')}
                  className="bg-amber-500 text-white px-8 py-3 rounded-lg hover:bg-amber-600 transition-all duration-200 shadow-md font-semibold"
                >
                  Create Your First Business
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default BusinessDashboard;