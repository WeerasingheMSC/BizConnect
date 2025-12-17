import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { logout, getStoredUser } from '../../services/authService';

const Dashboard = () => {
  const navigate = useNavigate();
  const user = getStoredUser();

  useEffect(() => {
    // Redirect based on user type
    if (user?.userType === 'business') {
      navigate('/business/dashboard', { replace: true });
    } else if (user?.userType === 'user') {
      navigate('/user/dashboard', { replace: true });
    }
  }, [user, navigate]);

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
          <div className="border-4 border-dashed border-gray-200 rounded-lg p-8 bg-white">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              User Dashboard
            </h2>
            <p className="text-gray-600 mb-4">
              Account Type: <span className="font-semibold text-amber-600 uppercase">{user?.userType}</span>
            </p>
            <p className="text-gray-600">
              Email: <span className="font-semibold">{user?.email}</span>
            </p>
            <div className="mt-8 p-6 bg-amber-50 rounded-lg border-l-4 border-amber-500">
              <p className="text-gray-700">
                🎉 Authentication system is working! This is a protected route that only authenticated users can access.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
