import { useNavigate } from 'react-router-dom';
import { logout, getStoredUser } from '../../services/authService';
import { useState, useEffect } from 'react';
import { getMyBusiness } from '../../services/businessService';

const BusinessDashboard = () => {
  const navigate = useNavigate();
  const user = getStoredUser();
  const [business, setBusiness] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        const data = await getMyBusiness();
        setBusiness(data);
      } catch (error) {
        console.error('Error fetching business:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBusiness();
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
            ) : business ? (
              <div>
                {/* Business Profile Summary */}
                <div className="mb-8 p-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border-l-4 border-amber-500">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800 mb-2">{business.businessName}</h3>
                      <p className="text-gray-600 mb-2">{business.category}</p>
                      <p className="text-gray-600 mb-2">{business.contactEmail} | {business.contactPhone}</p>
                      <p className="text-gray-600">
                        <span className="font-semibold">Views:</span> {business.views || 0}
                      </p>
                    </div>
                    <button
                      onClick={() => navigate('/business/profile')}
                      className="bg-amber-500 text-white px-6 py-2 rounded-lg hover:bg-amber-600 transition-all duration-200 shadow-md"
                    >
                      Edit Profile
                    </button>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="p-6 bg-white rounded-lg shadow border-l-4 border-blue-500">
                    <h4 className="text-sm font-semibold text-gray-600 mb-2">TOTAL VIEWS</h4>
                    <p className="text-3xl font-bold text-gray-800">{business.views || 0}</p>
                  </div>
                  <div className="p-6 bg-white rounded-lg shadow border-l-4 border-green-500">
                    <h4 className="text-sm font-semibold text-gray-600 mb-2">SERVICES OFFERED</h4>
                    <p className="text-3xl font-bold text-gray-800">{business.services?.length || 0}</p>
                  </div>
                  <div className="p-6 bg-white rounded-lg shadow border-l-4 border-purple-500">
                    <h4 className="text-sm font-semibold text-gray-600 mb-2">STATUS</h4>
                    <p className="text-xl font-bold text-gray-800">
                      {business.isActive ? (
                        <span className="text-green-600">Active</span>
                      ) : (
                        <span className="text-red-600">Inactive</span>
                      )}
                    </p>
                  </div>
                </div>

                {/* Services List */}
                {business.services && business.services.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Your Services</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {business.services.map((service: any, index: number) => (
                        <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                          <h4 className="font-semibold text-gray-800 mb-1">{service.name}</h4>
                          <p className="text-sm text-gray-600 mb-2">{service.description}</p>
                          <p className="text-lg font-bold text-amber-600">${service.price}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-8 bg-amber-50 rounded-lg border-l-4 border-amber-500">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  🎉 Welcome to BizConnect!
                </h3>
                <p className="text-gray-700 mb-6">
                  You haven't created your business profile yet. Get started by creating your profile to showcase your business and services!
                </p>
                <button
                  onClick={() => navigate('/business/profile')}
                  className="bg-amber-500 text-white px-8 py-3 rounded-lg hover:bg-amber-600 transition-all duration-200 shadow-md font-semibold"
                >
                  Create Business Profile
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
