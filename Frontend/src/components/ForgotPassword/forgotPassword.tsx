import { FaEnvelope } from "react-icons/fa6";
import { MdError, MdCheckCircle } from "react-icons/md";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "../../services/authService";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Auto-dismiss error after 10 seconds
  useEffect(() => {
    if (error) {
      setShowError(true);
      const timer = setTimeout(() => {
        setShowError(false);
        setTimeout(() => setError(""), 500);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Auto-dismiss success after 10 seconds
  useEffect(() => {
    if (success) {
      setShowSuccess(true);
      const timer = setTimeout(() => {
        setShowSuccess(false);
        setTimeout(() => setSuccess(false), 500);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!email) {
      setError("Email is required");
      return;
    }

    setLoading(true);

    try {
      const response = await forgotPassword(email);
      if (response.success) {
        setSuccess(true);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to send reset email. Please try again.");
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
          <h1 className="text-4xl font-extrabold text-gray-800 mb-2">Forgot Password?</h1>
          <p className="text-black">Enter your email to reset your password</p>
        </div>

        {/* Forgot Password Form */}
        <form className="space-y-10" onSubmit={handleSubmit}>
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
                    <p className="text-sm font-medium text-red-800">Error</p>
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

          {/* Success Notification */}
          {success && (
            <div 
              className={`transform transition-all duration-300 ease-in-out ${
                showSuccess ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0'
              }`}
            >
              <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg shadow-md">
                <div className="flex items-start">
                  <MdCheckCircle className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-green-800">Success!</p>
                    <p className="text-sm text-green-700 mt-1">
                      Password reset instructions have been sent to your email.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setShowSuccess(false);
                      setTimeout(() => setSuccess(false), 300);
                    }}
                    className="ml-3 text-green-400 hover:text-green-600 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2">
              Email Address:
            </label>
            <FaEnvelope className="absolute w-6 h-6 mt-3 ml-2 text-black" />
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="w-full px-12 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all duration-200"
              required
            />
          </div>

          {/* Information Text */}
          <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-lg">
            <p className="text-sm text-gray-700">
              We'll send you an email with instructions to reset your password.
            </p>
          </div>

          {/* Reset Password Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-500 text-white font-semibold py-3 rounded-lg shadow-lg hover:bg-amber-600 hover:shadow-xl active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        {/* Back to Sign In Links */}
        <div className="mt-6 text-center space-y-2">
          <p className="text-gray-600">
            Remember your password?{' '}
            <Link to="/signin" className="text-amber-600 hover:text-amber-700 font-semibold">
              Sign In
            </Link>
          </p>
          <p className="text-gray-600">
            Don't have an account?{' '}
            <Link to="/signup" className="text-amber-600 hover:text-amber-700 font-semibold">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
