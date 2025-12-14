import { FaUserLarge, FaLock } from "react-icons/fa6";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { MdError } from "react-icons/md";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../services/authService";

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false
  });

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value
    });
    // Clear error when user starts typing
    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    console.log("Form submitted with data:", { email: formData.email, password: "***" });

    // Validation
    if (!formData.email || !formData.password) {
      setError("Email and password are required");
      return;
    }

    // Clear previous errors and start loading
    setError("");
    setLoading(true);

    try {
      console.log("Calling login API...");
      const response = await login({
        email: formData.email,
        password: formData.password
      });

      console.log("Login response:", response);

      // Defensive check - ensure we have valid user data
      if (!response.user) {
        throw new Error("Invalid credentials");
      }

      console.log("Login successful, clearing form...");
      
      // Only clear form on successful login
      setFormData({
        email: "",
        password: "",
        rememberMe: false
      });
      
      // Redirect based on user type
      if (response.user.userType === 'business') {
        navigate('/business/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      console.log("Login error caught:", err);
      console.log("Error response:", err.response?.data);
      console.log("Form data before error:", formData);
      
      // Don't clear form on error - keep user's input
      setError(err.response?.data?.message || err.message || "Invalid credentials");
      
      console.log("Form data after error:", formData);
    } finally {
      setLoading(false);
    }
  };

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
        <form className=" space-y-10" onSubmit={handleSubmit}>
          {/* Email/Username Input */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2">
              Email:
            </label>
            <FaUserLarge className="absolute w-6 h-6 mt-3 ml-2 text-black" />
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
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
              name="password"
              value={formData.password}
              onChange={handleChange}
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
            {/* Inline Error Message */}
            {error && (
              <p className="text-red-600 text-sm mt-1">{error}</p>
            )}
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
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
            disabled={loading}
            className="w-full bg-amber-500 text-white font-semibold py-3 rounded-lg shadow-lg hover:bg-amber-600 hover:shadow-xl active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Signing In..." : "Sign In"}
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

export default SignIn
