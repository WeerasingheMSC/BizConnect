import { FaEnvelope } from "react-icons/fa6";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
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
        <form className="space-y-10">
          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2">
              Email Address:
            </label>
            <FaEnvelope className="absolute w-6 h-6 mt-3 ml-2 text-black" />
            <input
              type="email"
              id="email"
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
            className="w-full bg-amber-500 text-white font-semibold py-3 rounded-lg shadow-lg hover:bg-amber-600 hover:shadow-xl active:scale-95 transition-all duration-200"
          >
            Send Reset Link
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
