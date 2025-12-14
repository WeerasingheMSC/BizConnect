import { FaUserLarge, FaLock, FaEnvelope } from "react-icons/fa6";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { useState } from "react";
import { Link } from "react-router-dom";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
        <form className="space-y-6">
          {/* Name Input */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-900 mb-2">
              Full Name:
            </label>
            <FaUserLarge className="absolute w-6 h-6 mt-3 ml-2 text-black" />
            <input
              type="text"
              id="name"
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
            className="w-full bg-amber-500 text-white font-semibold py-3 rounded-lg shadow-lg hover:bg-amber-600 hover:shadow-xl active:scale-95 transition-all duration-200"
          >
            Sign Up
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
