import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const navigate = useNavigate();
  
  // Fetch employeeId directly from local storage
  const [employeeId, setEmployeeId] = useState(() => {
    return localStorage.getItem("employeeId") || ""; // Get employeeId from local storage
  });
  
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const response = await // Example of sending JSON data with axios
      axios.post(`${process.env.REACT_APP_API_URL}/resetPassword`, {
        otp: otp,
        employeeId: localStorage.getItem("employeeId"),
        newPassword: newPassword, // or whatever other parameters your API needs
      })
      

      const { status, message } = response.data;

      if (status === "Success") {
        setSuccessMessage(message);
        setTimeout(() => {
          navigate("/"); // Navigate to login after successful password reset
        }, 2000);
      } else {
        setErrorMessage(message);
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <section className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-center mb-6">Reset Password</h2>
        <form className="space-y-4" onSubmit={handleReset}>
          <div>
            <label htmlFor="otp" className="block text-sm font-medium text-gray-900">
              OTP
            </label>
            <input
              onChange={(e) => setOtp(e.target.value)}
              value={otp}
              type="text"
              name="otp"
              id="otp"
              className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter the OTP sent to your email"
              required
            />
          </div>
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-900">
              New Password
            </label>
            <input
              onChange={(e) => setNewPassword(e.target.value)}
              value={newPassword}
              type="password"
              name="newPassword"
              id="newPassword"
              className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your new password"
              required
            />
          </div>

          {successMessage && (
            <p className="text-green-500 text-sm text-center">{successMessage}</p>
          )}
          {errorMessage && (
            <p className="text-red-500 text-sm text-center">{errorMessage}</p>
          )}

          <button
            type="submit"
            className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 transition duration-300"
          >
            Reset Password
          </button>
        </form>

        <div className="mt-4 flex justify-center">
          <button
            onClick={() => navigate("/")}
            className="text-blue-600 hover:underline"
          >
            Back to Login
          </button>
        </div>
      </div>
    </section>
  );
};

export default ResetPassword;
