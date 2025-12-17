import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaEdit, FaTrash, FaMapMarkerAlt, FaPhone, FaEnvelope, FaGlobe, FaFacebook, FaInstagram, FaTwitter, FaLinkedin, FaEye, FaArrowLeft } from 'react-icons/fa';
import { getBusinessById, deleteBusiness } from '../../services/businessService';
import type { Business } from '../../services/businessService';

const BusinessDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [deleteStep, setDeleteStep] = useState(1);

  useEffect(() => {
    if (id) {
      fetchBusiness();
    }
  }, [id]);

  const fetchBusiness = async () => {
    if (!id) return;
    
    try {
      const response = await getBusinessById(id);
      if (response.success && response.business) {
        console.log('Fetched business data:', response.business);
        console.log('Services:', response.business.services);
        setBusiness(response.business);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch business');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!business?._id) return;
    
    setDeleting(true);
    try {
      await deleteBusiness(business._id);
      navigate('/business/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete business');
      setDeleting(false);
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
    setDeleteStep(1);
    setDeleteConfirmation('');
  };

  const handleNextStep = () => {
    setDeleteStep(2);
  };

  const handleConfirmDelete = () => {
    if (deleteConfirmation === business?.businessName) {
      handleDelete();
    }
  };

  const handleCloseModal = () => {
    setShowDeleteModal(false);
    setDeleteStep(1);
    setDeleteConfirmation('');
  };

  if (loading || error || !business) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <p className="text-red-600 mb-4">{error || 'Business not found'}</p>
          <button
            onClick={() => navigate('/business/dashboard')}
            className="bg-amber-500 text-white px-6 py-2 rounded-lg hover:bg-amber-600"
          >
            Back to Dashboard
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
                onClick={() => navigate('/business/dashboard')}
                className="flex items-center text-gray-700 hover:text-amber-600 transition-colors"
              >
                <FaArrowLeft className="mr-2" />
                <span className="font-semibold">Back to Dashboard</span>
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(`/business/profile/${business._id}`)}
                className="flex items-center bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition-all duration-200"
              >
                <FaEdit className="mr-2" />
                Edit Profile
              </button>
              <button
                onClick={handleDeleteClick}
                className="flex items-center bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all duration-200"
              >
                <FaTrash className="mr-2" />
                Delete
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Header Section */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-6">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                {business.logo && (
                  <div className="mb-4">
                    <img src={business.logo} alt={business.businessName} className="w-24 h-24 rounded-lg object-cover shadow-md border-2 border-amber-200" />
                  </div>
                )}
                <h1 className="text-4xl font-bold text-gray-800 mb-2">{business.businessName}</h1>
                <div className="flex items-center space-x-4 mb-4">
                  <span className="inline-block bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-semibold">
                    {business.category}
                  </span>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                    business.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {business.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <p className="text-gray-600 text-lg leading-relaxed">{business.description}</p>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center text-gray-600">
                <FaEye className="mr-2" />
                <span className="font-semibold">{business.views || 0}</span>
                <span className="ml-1">profile views</span>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start">
                <FaEnvelope className="text-amber-600 mt-1 mr-3" />
                <div>
                  <p className="text-sm text-gray-600 font-semibold">Email</p>
                  <a href={`mailto:${business.contactEmail}`} className="text-gray-800 hover:text-amber-600">
                    {business.contactEmail}
                  </a>
                </div>
              </div>
              <div className="flex items-start">
                <FaPhone className="text-amber-600 mt-1 mr-3" />
                <div>
                  <p className="text-sm text-gray-600 font-semibold">Phone</p>
                  <a href={`tel:${business.contactPhone}`} className="text-gray-800 hover:text-amber-600">
                    {business.contactPhone}
                  </a>
                </div>
              </div>
              {business.website && (
                <div className="flex items-start">
                  <FaGlobe className="text-amber-600 mt-1 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600 font-semibold">Website</p>
                    <a href={business.website} target="_blank" rel="noopener noreferrer" className="text-gray-800 hover:text-amber-600">
                      {business.website}
                    </a>
                  </div>
                </div>
              )}
              <div className="flex items-start">
                <FaMapMarkerAlt className="text-amber-600 mt-1 mr-3" />
                <div>
                  <p className="text-sm text-gray-600 font-semibold">Address</p>
                  <p className="text-gray-800">
                    {business.address.street}<br />
                    {business.address.city}, {business.address.state} {business.address.zipCode}<br />
                    {business.address.country}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Services */}
          {business.services && business.services.length > 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Services Offered</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {business.services.map((service, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{service.name}</h3>
                    {service.description && (
                      <p className="text-gray-600 mb-3">{service.description}</p>
                    )}
                    {service.price && (
                      <p className="text-2xl font-bold text-amber-600">{service.price}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-8 mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Services Offered</h2>
              <p className="text-gray-600">No services added yet. Edit your business profile to add services.</p>
            </div>
          )}

          {/* Social Media */}
          {(business.socialMedia?.facebook || business.socialMedia?.instagram || business.socialMedia?.twitter || business.socialMedia?.linkedin) && (
            <div className="bg-white rounded-lg shadow-md p-8 mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Connect With Us</h2>
              <div className="flex space-x-4">
                {business.socialMedia.facebook && (
                  <a
                    href={business.socialMedia.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-12 h-12 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                  >
                    <FaFacebook size={24} />
                  </a>
                )}
                {business.socialMedia.instagram && (
                  <a
                    href={business.socialMedia.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-12 h-12 bg-pink-600 text-white rounded-full hover:bg-pink-700 transition-colors"
                  >
                    <FaInstagram size={24} />
                  </a>
                )}
                {business.socialMedia.twitter && (
                  <a
                    href={business.socialMedia.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-12 h-12 bg-blue-400 text-white rounded-full hover:bg-blue-500 transition-colors"
                  >
                    <FaTwitter size={24} />
                  </a>
                )}
                {business.socialMedia.linkedin && (
                  <a
                    href={business.socialMedia.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-12 h-12 bg-blue-700 text-white rounded-full hover:bg-blue-800 transition-colors"
                  >
                    <FaLinkedin size={24} />
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Operating Hours */}
          {business.operatingHours && (
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Operating Hours</h2>
              <div className="space-y-3">
                {Object.entries(business.operatingHours).map(([day, hours]) => (
                  hours && (hours.open || hours.close) && (
                    <div key={day} className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="font-semibold text-gray-700 capitalize">{day}</span>
                      <span className="text-gray-600">
                        {hours.open && hours.close ? `${hours.open} - ${hours.close}` : 'Closed'}
                      </span>
                    </div>
                  )
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 backdrop-blur-md bg-white/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full mx-4 border border-gray-200">
            {deleteStep === 1 ? (
              <>
                <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mx-auto mb-4">
                  <FaTrash className="text-red-600 text-2xl" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">Delete Business Profile?</h3>
                <p className="text-gray-600 mb-6 text-center">
                  This action cannot be undone. All your business information, including your logo, services, and profile details will be permanently removed.
                </p>
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                  <div className="flex">
                    <div className="shrink-0">
                      <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-yellow-700 font-semibold">
                        Warning: This is a permanent action
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-4">
                  <button
                    onClick={handleCloseModal}
                    disabled={deleting}
                    className="flex-1 bg-gray-300 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-400 transition-all duration-200 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleNextStep}
                    disabled={deleting}
                    className="flex-1 bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-all duration-200 font-semibold"
                  >
                    Continue
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mx-auto mb-4">
                  <FaTrash className="text-red-600 text-2xl" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">Confirm Deletion</h3>
                <p className="text-gray-600 mb-4 text-center">
                  To confirm deletion, please type your business name exactly:
                </p>
                <p className="text-lg font-semibold text-gray-900 mb-4 text-center bg-gray-100 py-2 px-4 rounded">
                  {business?.businessName}
                </p>
                <input
                  type="text"
                  value={deleteConfirmation}
                  onChange={(e) => setDeleteConfirmation(e.target.value)}
                  placeholder="Type business name here"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 mb-6"
                  disabled={deleting}
                />
                <div className="flex space-x-4">
                  <button
                    onClick={handleCloseModal}
                    disabled={deleting}
                    className="flex-1 bg-gray-300 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-400 transition-all duration-200 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmDelete}
                    disabled={deleting || deleteConfirmation !== business?.businessName}
                    className="flex-1 bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {deleting ? 'Deleting...' : 'Delete Permanently'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessDetail;
