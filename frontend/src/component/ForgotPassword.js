import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const RequestReset = () => {
  const [email, setEmail] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [loading, setLoading] = useState(false); // Loading state
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if both fields are filled
    if (!employeeId || !email) {
      alert("Please enter both your Employee ID and email.");
      return;
    }

    setLoading(true); // Start loading spinner

    // Send OTP request to the server
    axios
      .post(`${process.env.REACT_APP_API_URL}/forgotPassword`, {
        employeeId,
        email,
      })
      .then((response) => {
        const { status } = response.data; // Get the status from the response
        navigate("/resetPassword"); // Navigate immediately after alert
        localStorage.setItem("employeeId", employeeId);
        if (status === "Success") {

          // Show alert and navigate immediately after the alert is closed
          alert("OTP sent successfully. Proceeding to reset password...");
        } else {
          // Display the error message if the status is not "Success"
          alert(response.data.message || "Failed to send OTP. Please try again.");
        }
      })
      .catch((error) => {
        // Display error from the server if available
        if (error.response && error.response.data && error.response.data.message) {
          alert(error.response.data.message);
        } else {
          alert("An unexpected error occurred. Please try again.");
        }
      })
      .finally(() => {
        setLoading(false); // Stop loading spinner
      });
  };

  return (
    <section className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-center mb-6">Request Password Reset</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="employeeId" className="block text-sm font-medium text-gray-900">
              Employee ID
            </label>
            <input
              onChange={(e) => setEmployeeId(e.target.value)}
              value={employeeId}
              type="text"
              name="employeeId"
              id="employeeId"
              className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your Employee ID"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-900">
              Email Address
            </label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
              name="email"
              id="email"
              className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your email address"
              required
            />
          </div>

          {/* Spinner */}
          {loading && (
            <div className="flex justify-center mt-4">
              <div className="animate-spin h-5 w-5 border-4 border-blue-600 border-t-transparent rounded-full"></div>
            </div>
          )}

          <button
            type="submit"
            className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 transition duration-300"
          >
            Proceed to Reset Password
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

export default RequestReset;
