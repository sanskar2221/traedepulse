import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const Register = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting }
  } = useForm();

  const password = watch("password");

const navigate = useNavigate();

const onSubmit = async (data) => {
  try {
    const res = await api.post("/auth/register", {
      name: data.name,
      email: data.email,
      password: data.password,
    });

    // OPTION A: If backend returns token
    if (res.data.token) {
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } else {
      // OPTION B: If backend only creates user
      navigate("/login");
    }

  } catch (error) {
    console.error(error.response?.data);
    alert(
      error.response?.data?.message || "Registration failed"
    );
  }
};
  return (
    <div className="min-h-screen flex">

      {/* LEFT SIDE */}
      <div className="hidden lg:flex w-1/2 bg-[#e8f1fb] justify-center items-center flex-col ">
        
        {/* Logo */}
        <div className="flex items-center justify-center gap-4 mb-10"> 
          <div className="bg-blue-600 p-3 rounded-xl shadow-sm">
            <svg width="50" height="50" fill="white" viewBox="0 0 24 24">
              <path d="M4 18V6h2v10h12v2H4zm4-4V8h2v6H8zm4 0V4h2v10h-2zm4 0v-3h2v3h-2z"/>
            </svg>
          </div>
          <span className="text-5xl font-semibold text-gray-900">
            Trade<span className="text-blue-600">Pulse</span>
          </span>
        </div>

        <div className="max-w-lg justify-center">

          <h1 className="text-4xl font-semibold text-gray-900 leading-tight mb-6">
            Track your crypto performance with precision.
          </h1>

          <p className="text-lg text-gray-600 mb-6 leading-relaxed">
            The all-in-one crypto trade tracker for monitoring performance,
            analyzing trends, and managing your portfolio securely.
          </p>

          {/* Features */}
          <div className="space-y-10">

              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  📈 Real-Time Performance
                </h3>
                <p className="text-gray-600">
                  Track total P&amp;L, win rate, and activations in one clean dashboard.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  📊 Advanced Trade Analytics
                </h3>
                <p className="text-gray-600">
                  Visualize trading history, profit trends, and risk exposure instantly.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                 🔒 Secure Portfolio Management
                </h3>
                <p className="text-gray-600">
                  Encrypted authentication and protected trade logging for peace of mind.
                </p>
              </div>


          </div>
        </div>

      </div>

      {/* RIGHT SIDE */}
      <div className="flex w-full lg:w-1/2 bg-gray-50 items-center justify-center px-8">
        <div className="w-full max-w-md bg-white p-10 rounded-2xl shadow-sm border border-gray-200">

          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Create Account
          </h2>

          <p className="text-gray-500 mb-6">
            Join TradePulse and start tracking your trades.
          </p>

          {/* Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
            <Link
              to="/login"
              className="flex-1 py-2 text-center text-sm text-gray-600"
            >
              Sign In
            </Link>
            <button className="flex-1 py-2 bg-white rounded-md text-sm font-medium shadow-sm">
              Create Account
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

          {/* Full Name */}
          <div>
            <input
              type="text"
              placeholder="Full Name"
              {...register("name", {
                required: "Full name is required",
                minLength: {
                  value: 3,
                  message: "Minimum 3 characters required"
                }
              })}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            {errors.name && (
              <p className="text-sm text-red-500 mt-1">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <input
              type="email"
              placeholder="Email address"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Invalid email format"
                }
              })}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <input
              type="password"
              placeholder="Password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Minimum 6 characters required"
                }
              })}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            {errors.password && (
              <p className="text-sm text-red-500 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <input
              type="password"
              placeholder="Confirm Password"
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) =>
                  value === password || "Passwords do not match"
              })}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            {errors.confirmPassword && (
              <p className="text-sm text-red-500 mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium hover:opacity-90 transition disabled:opacity-50"
          >
            {isSubmitting ? "Creating Account..." : "Create Account →"}
          </button>

        </form>

          <p className="text-sm text-gray-600 text-center mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 font-medium hover:underline">
              Sign In
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
};

export default Register;
