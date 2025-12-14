import { FaUserLarge, FaLock, FaEnvelope } from "react-icons/fa6";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { MdError } from "react-icons/md";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../../services/authService";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showError, setShowError] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    userType: "user" as "user" | "business"
  });

  const navigate = useNavigate();

  // Password strength checker
  const checkPasswordStrength = (password: string) => {
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
    return checks;
  };

  const passwordChecks = checkPasswordStrength(formData.password);

  // Auto-dismiss error after 10 seconds
  useEffect(() => {
    if (error) {
      setShowError(true);
      const timer = setTimeout(() => {
        setShowError(false);
        setTimeout(() => setError(""), 500); // Clear after fade out
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(""); // Clear error when user types
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    if (!/[A-Z]/.test(formData.password)) {
      setError("Password must contain at least one uppercase letter");
      return;
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) {
      setError("Password must contain at least one special character (!@#$%^&* etc.)");
      return;
    }

    setLoading(true);

    try {
      const response = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        userType: formData.userType
      });

      if (response.success) {
        // Redirect based on user type
        if (formData.userType === 'business') {
          navigate('/business/dashboard');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/src/assets/BackGround.png')" }}
    >
      <div className="rounded-3xl shadow-sky-400/10 shadow-2xl bg-gray-100 border-4 border-amber-500 w-full max-w-lg p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <img src="/Logo.png" alt="BizConnect Logo" className="mx-auto mb-4 w-30 h-30 rounded-full" />
          <h1 className="text-4xl font-extrabold text-gray-800 mb-2">Create Account</h1>
          <p className="text-black">Join BizConnect today</p>
        </div>

        {/* Sign Up Form */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Error Notification */}
          {error && (
            <div 
              className={`transform transition-all duration-300 ease-in-out ${
                showError ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0'
              }`}
            >
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg shadow-md animate-shake">
                <div className="flex items-start">
                  <MdError className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-red-800">Registration Failed</p>
                    <p className="text-sm text-red-700 mt-1">{error}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setShowError(false);
                      setTimeout(() => setError(""), 300);
                    }}
                    className="ml-3 text-red-400 hover:text-red-600 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* User Type Selection */}
          <div>
            <label htmlFor="userType" className="block text-sm font-medium text-gray-900 mb-2">
              I am a:
            </label>
            <select
              id="userType"
              name="userType"
              value={formData.userType}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all duration-200"
            >
              <option value="user">Regular User</option>
              <option value="business">Business Owner</option>
            </select>
          </div>

          {/* Name Input */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-900 mb-2">
              Full Name:
            </label>
            <FaUserLarge className="absolute w-6 h-6 mt-3 ml-2 text-black" />
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="w-full px-12 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all duration-200"
              required
            />
          </div>

          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2">
              Email:
            </label>
            <FaEnvelope className="absolute w-6 h-6 mt-3 ml-2 text-black" />
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full px-12 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all duration-200"
              required
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <label htmlFor="password" className="block text-sm font-medium text-gray-900 mb-2">
              Password:
            </label>
            <FaLock className="absolute w-6 h-6 mt-3 ml-2 text-black z-10" />
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              className="w-full px-12 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all duration-200"
              required
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
            
            {/* Password Strength Indicator */}
            {formData.password && (
              <div className="mt-2 space-y-1">
                <div className="flex items-center text-xs">
                  <span className={`mr-2 ${passwordChecks.length ? 'text-green-600' : 'text-gray-400'}`}>
                    {passwordChecks.length ? '✓' : '○'}
                  </span>
                  <span className={passwordChecks.length ? 'text-green-600' : 'text-gray-600'}>
                    At least 8 characters
                  </span>
                </div>
                <div className="flex items-center text-xs">
                  <span className={`mr-2 ${passwordChecks.uppercase ? 'text-green-600' : 'text-gray-400'}`}>
                    {passwordChecks.uppercase ? '✓' : '○'}
                  </span>
                  <span className={passwordChecks.uppercase ? 'text-green-600' : 'text-gray-600'}>
                    One uppercase letter
                  </span>
                </div>
                <div className="flex items-center text-xs">
                  <span className={`mr-2 ${passwordChecks.special ? 'text-green-600' : 'text-gray-400'}`}>
                    {passwordChecks.special ? '✓' : '○'}
                  </span>
                  <span className={passwordChecks.special ? 'text-green-600' : 'text-gray-600'}>
                    One special character (!@#$%^&* etc.)
                  </span>
                </div>
              </div>
            )}
          </div>

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
              placeholder="Confirm your password"
              className="w-full px-12 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all duration-200"
              required
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
          </div>

          {/* Terms & Conditions Checkbox */}
          <div className="flex items-start">
            <input
              type="checkbox"
              id="terms"
              className="w-4 h-4 mt-1 text-amber-500 border-gray-300 rounded focus:ring-amber-500"
              required
            />
            <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
              I agree to the{' '}
              <a href="#" className="text-amber-600 hover:text-amber-700 font-medium">
                Terms and Conditions
              </a>
            </label>
          </div>

          {/* Sign Up Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-500 text-white font-semibold py-3 rounded-lg shadow-lg hover:bg-amber-600 hover:shadow-xl active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        {/* Sign In Link */}
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link to="/signin" className="text-amber-600 hover:text-amber-700 font-semibold">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default SignUp
