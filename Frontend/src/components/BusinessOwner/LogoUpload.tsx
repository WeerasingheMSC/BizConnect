import { useState, useRef } from 'react';
import { FaUpload, FaTrash, FaImage } from 'react-icons/fa';
import { uploadToCloudinary } from '../../utils/cloudinary';

interface LogoUploadProps {
  currentLogo?: string;
  onLogoChange: (logoUrl: string) => void;
  onLogoRemove: () => void;
}

const LogoUpload = ({ currentLogo, onLogoChange, onLogoRemove }: LogoUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState<string>(currentLogo || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');
    setUploading(true);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    try {
      const response = await uploadToCloudinary(file);
      onLogoChange(response.secure_url);
    } catch (err: any) {
      setError(err.message || 'Failed to upload logo');
      setPreview(currentLogo || '');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveLogo = () => {
    setPreview('');
    onLogoRemove();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-semibold text-gray-700">Business Logo</label>
      
      <div className="flex items-start space-x-4">
        {/* Logo Preview */}
        <div className="flex-shrink-0">
          {preview ? (
            <div className="relative group">
              <img
                src={preview}
                alt="Logo preview"
                className="w-32 h-32 object-cover rounded-lg border-2 border-gray-300 shadow-sm"
              />
              {!uploading && (
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 rounded-lg transition-all duration-200 flex items-center justify-center">
                  <button
                    type="button"
                    onClick={handleRemoveLogo}
                    className="opacity-0 group-hover:opacity-100 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-all duration-200"
                  >
                    <FaTrash />
                  </button>
                </div>
              )}
              {uploading && (
                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                </div>
              )}
            </div>
          ) : (
            <div className="w-32 h-32 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
              <FaImage className="text-gray-400 text-3xl" />
            </div>
          )}
        </div>

        {/* Upload Controls */}
        <div className="flex-1">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
            className="hidden"
          />
          
          <button
            type="button"
            onClick={handleClick}
            disabled={uploading}
            className="flex items-center bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaUpload className="mr-2" />
            {uploading ? 'Uploading...' : preview ? 'Change Logo' : 'Upload Logo'}
          </button>

          <div className="mt-2 text-sm text-gray-600">
            <p>Recommended: Square image (400x400px or larger)</p>
            <p>Max file size: 5MB</p>
            <p>Formats: JPEG, PNG, GIF, WebP</p>
          </div>

          {error && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LogoUpload;
