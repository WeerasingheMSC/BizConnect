import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaBuilding, FaPhone, FaMapMarkerAlt, FaGlobe, FaPlus, FaTrash } from 'react-icons/fa';
import { createBusiness, getBusinessById, updateBusiness } from '../../services/businessService';
import type { Business, Service } from '../../services/businessService';
import { getCategories, getCountries } from '../../services/metaService';
import type { Category, Country } from '../../services/metaService';
import LogoUpload from './LogoUpload';

const BusinessProfileForm = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEdit, setIsEdit] = useState(false);

  const [formData, setFormData] = useState<Partial<Business>>({
    businessName: '',
    description: '',
    category: '',
    contactEmail: '',
    contactPhone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    },
    website: '',
    socialMedia: {
      facebook: '',
      instagram: '',
      twitter: '',
      linkedin: ''
    },
    services: []
  });

  const [newService, setNewService] = useState<Service>({
    name: '',
    description: '',
    price: ''
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);

  useEffect(() => {
    fetchMetaData();
    if (id) {
      fetchBusinessProfile();
    }
  }, [id]);

  const fetchMetaData = async () => {
    try {
      const [categoriesRes, countriesRes] = await Promise.all([
        getCategories(),
        getCountries()
      ]);
      
      if (categoriesRes.success) {
        setCategories(categoriesRes.categories);
      }
      if (countriesRes.success) {
        setCountries(countriesRes.countries);
        // Set default country to Sri Lanka
        const defaultCountry = countriesRes.countries.find((c: Country) => c.code === 'LK');
        if (defaultCountry && !formData.address?.country) {
          setSelectedCountry(defaultCountry);
          setFormData(prev => ({
            ...prev,
            address: {
              ...prev.address!,
              country: defaultCountry.name
            }
          }));
        }
      }
    } catch (err) {
      console.error('Error fetching metadata:', err);
    }
  };

  const fetchBusinessProfile = async () => {
    if (!id) return;
    
    try {
      const response = await getBusinessById(id);
      if (response.success && response.business) {
        const businessData = response.business;
        setFormData(businessData);
        setIsEdit(true);
        // Set selected country based on business data
        if (businessData.address?.country && countries.length > 0) {
          const country = countries.find(c => c.name === businessData.address?.country);
          if (country) setSelectedCountry(country);
        }
      }
    } catch (err: any) {
      console.log('Error fetching business:', err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof Business] as any),
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    if (error) setError('');
  };

  const handleAddService = () => {
    if (!newService.name.trim()) {
      setError('Service name is required');
      return;
    }

    setFormData(prev => ({
      ...prev,
      services: [...(prev.services || []), { ...newService }]
    }));

    setNewService({ name: '', description: '', price: '' });
    setError('');
  };

  const handleRemoveService = (index: number) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services?.filter((_, i) => i !== index)
    }));
  };

  const handleLogoChange = (logoUrl: string) => {
    setFormData(prev => ({
      ...prev,
      logo: logoUrl
    }));
  };

  const handleLogoRemove = () => {
    setFormData(prev => ({
      ...prev,
      logo: ''
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!formData.businessName || !formData.description || !formData.category ||
        !formData.contactEmail || !formData.contactPhone ||
        !formData.address?.street || !formData.address?.city ||
        !formData.address?.state || !formData.address?.zipCode || !formData.address?.country) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      if (isEdit && id) {
        await updateBusiness(id, formData);
        setSuccess('Business profile updated successfully!');
      } else {
        await createBusiness(formData);
        setSuccess('Business profile created successfully!');
      }

      setTimeout(() => {
        navigate('/business/dashboard');
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save business profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            {isEdit ? 'Edit Business Profile' : 'Create Business Profile'}
          </h1>
          <p className="text-gray-600 mt-2">
            {isEdit ? 'Update your business information' : 'Fill in your business details to get started'}
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg mb-6">
            <p className="text-green-800">{success}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <FaBuilding className="mr-2 text-amber-500" />
              Basic Information
            </h2>

            {/* Logo Upload */}
            <div className="mb-6">
              <LogoUpload
                currentLogo={formData.logo}
                onLogoChange={handleLogoChange}
                onLogoRemove={handleLogoRemove}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
                  placeholder="Enter business name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat._id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Website
                </label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
                  placeholder="https://www.example.com"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
                  placeholder="Describe your business..."
                  required
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <FaPhone className="mr-2 text-amber-500" />
              Contact Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
                  placeholder="business@example.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
                  placeholder="+94 77 123 4567"
                  required
                />
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <FaMapMarkerAlt className="mr-2 text-amber-500" />
              Business Address
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Street Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="address.street"
                  value={formData.address?.street}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
                  placeholder="123 Main Street"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="address.city"
                  value={formData.address?.city}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
                  placeholder="Colombo"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State/Province <span className="text-red-500">*</span>
                </label>
                <select
                  name="address.state"
                  value={formData.address?.state}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
                  required
                  disabled={!selectedCountry}
                >
                  <option value="">Select State/Province</option>
                  {selectedCountry?.states.map(state => (
                    <option key={state.code} value={state.name}>{state.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Zip Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="address.zipCode"
                  value={formData.address?.zipCode}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
                  placeholder="10100"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country <span className="text-red-500">*</span>
                </label>
                <select
                  name="address.country"
                  value={formData.address?.country}
                  onChange={(e) => {
                    handleChange(e);
                    const country = countries.find(c => c.name === e.target.value);
                    setSelectedCountry(country || null);
                    // Reset state when country changes
                    setFormData(prev => ({
                      ...prev,
                      address: {
                        ...prev.address!,
                        state: ''
                      }
                    }));
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
                  required
                >
                  <option value="">Select Country</option>
                  {countries.map(country => (
                    <option key={country._id} value={country.name}>{country.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Services */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Services Offered</h2>

            {/* Service List */}
            {formData.services && formData.services.length > 0 && (
              <div className="mb-4 space-y-2">
                {formData.services.map((service, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                    <div>
                      <p className="font-medium">{service.name}</p>
                      {service.description && <p className="text-sm text-gray-600">{service.description}</p>}
                      {service.price && <p className="text-sm text-amber-600 font-semibold">{service.price}</p>}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveService(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add Service Form */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                <input
                  type="text"
                  value={newService.name}
                  onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
                  placeholder="Service name"
                />
                <input
                  type="text"
                  value={newService.description}
                  onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
                  placeholder="Description (optional)"
                />
                <input
                  type="text"
                  value={newService.price}
                  onChange={(e) => setNewService({ ...newService, price: e.target.value })}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
                  placeholder="Price (optional)"
                />
              </div>
              <button
                type="button"
                onClick={handleAddService}
                className="w-full bg-amber-500 text-white py-2 rounded-lg hover:bg-amber-600 transition flex items-center justify-center"
              >
                <FaPlus className="mr-2" /> Add Service
              </button>
            </div>
          </div>

          {/* Social Media */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <FaGlobe className="mr-2 text-amber-500" />
              Social Media (Optional)
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Facebook</label>
                <input
                  type="url"
                  name="socialMedia.facebook"
                  value={formData.socialMedia?.facebook}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
                  placeholder="https://facebook.com/yourpage"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Instagram</label>
                <input
                  type="url"
                  name="socialMedia.instagram"
                  value={formData.socialMedia?.instagram}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
                  placeholder="https://instagram.com/yourpage"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Twitter</label>
                <input
                  type="url"
                  name="socialMedia.twitter"
                  value={formData.socialMedia?.twitter}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
                  placeholder="https://twitter.com/yourpage"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn</label>
                <input
                  type="url"
                  name="socialMedia.linkedin"
                  value={formData.socialMedia?.linkedin}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
                  placeholder="https://linkedin.com/company/yourpage"
                />
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-amber-500 text-white font-semibold py-3 rounded-lg hover:bg-amber-600 transition disabled:opacity-50"
            >
              {loading ? 'Saving...' : isEdit ? 'Update Profile' : 'Create Profile'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/business/dashboard')}
              className="px-8 bg-gray-300 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-400 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BusinessProfileForm;
