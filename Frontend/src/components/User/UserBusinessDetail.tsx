import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  FaMapMarkerAlt, FaPhone, FaEnvelope, FaGlobe, 
  FaFacebook, FaInstagram, FaTwitter, FaLinkedin, 
  FaEye, FaArrowLeft, FaBookmark, FaRegBookmark
} from 'react-icons/fa';
import { getBusinessById } from '../../services/businessService';
import { addBookmark, removeBookmark, checkBookmark } from '../../services/userService';
import type { Business } from '../../services/businessService';

const UserBusinessDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);
  
  const isLoggedIn = !!localStorage.getItem('token');

  useEffect(() => {
    if (id) {
      fetchBusiness();
      if (isLoggedIn) {
        checkIfBookmarked();
      }
    }
  }, [id]);

  const fetchBusiness = async () => {
    if (!id) return;
    
    try {
      const response = await getBusinessById(id);
      if (response.success && response.business) {
        setBusiness(response.business);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch business');
    } finally {
      setLoading(false);
    }
  };

  const checkIfBookmarked = async () => {
    if (!id) return;
    
    try {
      const response = await checkBookmark(id);
      setIsBookmarked(response.isBookmarked);
    } catch (err) {
      console.error('Error checking bookmark:', err);
    }
  };

  const handleBookmarkToggle = async () => {
    if (!isLoggedIn) {
      navigate('/signin');
      return;
    }

    if (!id) return;
    
    setBookmarkLoading(true);
    try {
      if (isBookmarked) {
        await removeBookmark(id);
        setIsBookmarked(false);
      } else {
        await addBookmark(id);
        setIsBookmarked(true);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update bookmark');
    } finally {
      setBookmarkLoading(false);
    }
  };

  if (loading || error || !business) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <p className="text-red-600 mb-4">{error || 'Business not found'}</p>
          <button
            onClick={() => navigate('/user/search')}
            className="bg-amber-500 text-white px-6 py-2 rounded-lg hover:bg-amber-600"
          >
            Back to Search
          </button>
        </div>
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
              <button
                onClick={() => navigate('/user/search')}
                className="flex items-center text-gray-700 hover:text-amber-600 transition-colors"
              >
                <FaArrowLeft className="mr-2" />
                <span className="font-semibold">Back to Search</span>
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBookmarkToggle}
                disabled={bookmarkLoading}
                className={`flex items-center px-4 py-2 rounded-lg transition-all duration-200 ${
                  isBookmarked
                    ? 'bg-amber-500 text-white hover:bg-amber-600'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {isBookmarked ? <FaBookmark className="mr-2" /> : <FaRegBookmark className="mr-2" />}
                {isBookmarked ? 'Bookmarked' : 'Bookmark'}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="md:flex">
            {/* Logo Section */}
            <div className="md:w-1/3 bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center p-8">
              {business.logo ? (
                <img
                  src={business.logo}
                  alt={business.businessName}
                  className="max-w-full h-64 object-contain rounded-lg"
                />
              ) : (
                <div className="text-amber-600 text-8xl font-bold">
                  {business.businessName.charAt(0)}
                </div>
              )}
            </div>

            {/* Business Info */}
            <div className="md:w-2/3 p-8">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-4xl font-bold text-gray-800 mb-2">{business.businessName}</h1>
                  <span className="inline-block bg-amber-100 text-amber-800 px-4 py-2 rounded-full font-semibold">
                    {business.category}
                  </span>
                </div>
                <div className="flex items-center text-gray-600">
                  <FaEye className="mr-2" />
                  <span className="font-semibold">{business.views || 0} views</span>
                </div>
              </div>

              <p className="text-gray-600 text-lg mb-6">{business.description}</p>

              {/* Contact Information */}
              <div className="space-y-3">
                <div className="flex items-center text-gray-700">
                  <FaMapMarkerAlt className="text-amber-500 mr-3" />
                  <span>
                    {business.address.street}, {business.address.city}, {business.address.state} {business.address.zipCode}
                  </span>
                </div>

                <div className="flex items-center text-gray-700">
                  <FaPhone className="text-amber-500 mr-3" />
                  <a href={`tel:${business.contactPhone}`} className="hover:text-amber-600">
                    {business.contactPhone}
                  </a>
                </div>

                <div className="flex items-center text-gray-700">
                  <FaEnvelope className="text-amber-500 mr-3" />
                  <a href={`mailto:${business.contactEmail}`} className="hover:text-amber-600">
                    {business.contactEmail}
                  </a>
                </div>

                {business.website && (
                  <div className="flex items-center text-gray-700">
                    <FaGlobe className="text-amber-500 mr-3" />
                    <a
                      href={business.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-amber-600"
                    >
                      {business.website}
                    </a>
                  </div>
                )}
              </div>

              {/* Social Media */}
              {business.socialMedia && (
                <div className="mt-6">
                  <h3 className="font-semibold text-gray-800 mb-3">Follow Us</h3>
                  <div className="flex space-x-4">
                    {business.socialMedia.facebook && (
                      <a
                        href={business.socialMedia.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 text-2xl"
                      >
                        <FaFacebook />
                      </a>
                    )}
                    {business.socialMedia.instagram && (
                      <a
                        href={business.socialMedia.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-pink-600 hover:text-pink-700 text-2xl"
                      >
                        <FaInstagram />
                      </a>
                    )}
                    {business.socialMedia.twitter && (
                      <a
                        href={business.socialMedia.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-500 text-2xl"
                      >
                        <FaTwitter />
                      </a>
                    )}
                    {business.socialMedia.linkedin && (
                      <a
                        href={business.socialMedia.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-700 hover:text-blue-800 text-2xl"
                      >
                        <FaLinkedin />
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Services Section */}
        {business.services && business.services.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Services Offered</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {business.services.map((service, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-amber-500 transition-colors">
                  <h3 className="font-semibold text-lg text-gray-800 mb-2">{service.name}</h3>
                  {service.description && (
                    <p className="text-gray-600 text-sm mb-2">{service.description}</p>
                  )}
                  {service.price && (
                    <p className="text-amber-600 font-semibold">{service.price}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Operating Hours */}
        {business.operatingHours && (
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Operating Hours</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(business.operatingHours).map(([day, hours]) => (
                <div key={day} className="flex justify-between items-center border-b border-gray-200 pb-2">
                  <span className="font-semibold text-gray-700 capitalize">{day}</span>
                  <span className="text-gray-600">
                    {hours.open} - {hours.close}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default UserBusinessDetail;
