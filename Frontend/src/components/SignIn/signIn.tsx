import { FaUserLarge,FaLock } from "react-icons/fa6";
import { IoMdEye,IoMdEyeOff } from "react-icons/io";
import { useState } from "react";
import { Link } from "react-router-dom";

const signIn = () => {
    const [showPassword, setShowPassword] = useState(false);

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/src/assets/BackGround.png')" }}
    >
      <div className=" rounded-3xl shadow-2xl bg-gray-100 border-4 shadow-sky-400/10 border-amber-500 w-full max-w-lg p-8">
        {/* Header */}
        <div className="text-center mb-8">
         <img src="/Logo.png" alt="BizConnect Logo" className="mx-auto mb-4 w-30 h-30 rounded-full" />
          <h1 className="text-4xl font-extrabold text-gray-800 mb-2">Welcome Back</h1>
          <p className="text-black">Sign in to continue to BizConnect</p>
        </div>

        {/* Sign In Form */}
        <form className=" space-y-10">
          {/* Email/Username Input */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-900 mb-2">
              Username or Email:
            </label>
            <FaUserLarge className="absolute w-6 h-6 mt-3 ml-2 text-black" />
            <input
              type="text"
              id="username"
              placeholder="Enter your username"
              className="w-full px-12 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all duration-200"
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
              placeholder="Enter your password"
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

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="w-4 h-4 text-amber-500 border-gray-300 rounded focus:ring-amber-500"
              />
              <span className="ml-2 text-sm text-gray-600">Remember me</span>
            </label>
            <Link to="/forgot-password" className="text-sm text-amber-600 hover:text-amber-700 font-medium">
              Forgot Password?
            </Link>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            className="w-full bg-amber-500 text-white font-semibold py-3 rounded-lg shadow-lg hover:bg-amber-600 hover:shadow-xl active:scale-95 transition-all duration-200"
          >
            Sign In
          </button>
        </form>

        {/* Sign Up Link */}
        <div className="mt-6 text-center">
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

export default signIn
