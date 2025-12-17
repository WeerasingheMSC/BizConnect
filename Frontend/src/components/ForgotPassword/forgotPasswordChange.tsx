import { FaLock } from "react-icons/fa6";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { MdCheckCircle } from "react-icons/md";
import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import axios from "../../utils/axios";

const ForgotPasswordChange = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const resetToken = searchParams.get('token');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: ""
  });

  const [passwordChecks, setPasswordChecks] = useState({
    length: false,
    uppercase: false,
    special: false
  });

  useEffect(() => {
    if (!resetToken) {
      setError("Invalid reset link");
    }
  }, [resetToken]);

  useEffect(() => {
    setPasswordChecks({
      length: formData.newPassword.length >= 8,
      uppercase: /[A-Z]/.test(formData.newPassword),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(formData.newPassword)
    });
  }, [formData.newPassword]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!formData.newPassword || !formData.confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!passwordChecks.length || !passwordChecks.uppercase || !passwordChecks.special) {
      setError("Password does not meet requirements");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('/auth/reset-password', {
        resetToken,
        newPassword: formData.newPassword
      });

      if (response.data.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/signin');
        }, 3000);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to reset password. Link may be expired.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/src/assets/BackGround.png')" }}
    >
      <div className="rounded-3xl shadow-2xl bg-gray-100 border-4 shadow-sky-400/10 border-amber-500 w-full max-w-lg p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <img src="/Logo.png" alt="BizConnect Logo" className="mx-auto mb-4 w-30 h-30 rounded-full" />
          <h1 className="text-4xl font-extrabold text-gray-800 mb-2">Reset Password</h1>
          <p className="text-black">Enter your new password</p>
        </div>

        {/* Success Message */}
        {success ? (
          <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-lg shadow-md text-center">
            <MdCheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <p className="text-lg font-medium text-green-800 mb-2">Password Reset Successful!</p>
            <p className="text-sm text-green-700">
              Redirecting to sign in page...
            </p>
          </div>
        ) : (
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* New Password Input */}
            <div className="relative">
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-900 mb-2">
                New Password:
              </label>
              <FaLock className="absolute w-6 h-6 mt-3 ml-2 text-black z-10" />
              <input
                type={showPassword ? "text" : "password"}
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="Enter new password"
                className="w-full px-12 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all duration-200"
              />
              {showPassword ? (
                <IoMdEyeOff
                  className="absolute w-7 h-7 top-10 right-3 text-black cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                />
              ) : (
                <IoMdEye
                  className="absolute w-7 h-7 top-10 right-3 text-black cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                />
              )}
            </div>

            {/* Password Strength Indicator */}
            {formData.newPassword && (
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-sm font-medium text-gray-700 mb-2">Password Requirements:</p>
                <div className="space-y-1">
                  <div className="flex items-center text-sm">
                    <span className={`mr-2 ${passwordChecks.length ? 'text-green-600' : 'text-gray-400'}`}>
                      {passwordChecks.length ? '✓' : '○'}
                    </span>
                    <span className={passwordChecks.length ? 'text-green-600' : 'text-gray-600'}>
                      At least 8 characters
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    <span className={`mr-2 ${passwordChecks.uppercase ? 'text-green-600' : 'text-gray-400'}`}>
                      {passwordChecks.uppercase ? '✓' : '○'}
                    </span>
                    <span className={passwordChecks.uppercase ? 'text-green-600' : 'text-gray-600'}>
                      One uppercase letter
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    <span className={`mr-2 ${passwordChecks.special ? 'text-green-600' : 'text-gray-400'}`}>
                      {passwordChecks.special ? '✓' : '○'}
                    </span>
                    <span className={passwordChecks.special ? 'text-green-600' : 'text-gray-600'}>
                      One special character
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Confirm Password Input */}
            <div className="relative">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-900 mb-2">
                Confirm Password:
              </label>
              <FaLock className="absolute w-6 h-6 mt-3 ml-2 text-black z-10" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm new password"
                className="w-full px-12 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all duration-200"
              />
              {showConfirmPassword ? (
                <IoMdEyeOff
                  className="absolute w-7 h-7 top-10 right-3 text-black cursor-pointer"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                />
              ) : (
                <IoMdEye
                  className="absolute w-7 h-7 top-10 right-3 text-black cursor-pointer"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                />
              )}
              {/* Inline Error Message */}
              {error && (
                <p className="text-red-600 text-sm mt-1">{error}</p>
              )}
            </div>

            {/* Reset Password Button */}
            <button
              type="submit"
              disabled={loading || !resetToken}
              className="w-full bg-amber-500 text-white font-semibold py-3 rounded-lg shadow-lg hover:bg-amber-600 hover:shadow-xl active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Resetting Password..." : "Reset Password"}
            </button>
          </form>
        )}

        {/* Back to Sign In Link */}
        <div className="mt-6 text-center">
          <Link to="/signin" className="text-amber-600 hover:text-amber-700 font-semibold">
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordChange;
