import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ApplayLeave.css"; // Import the custom CSS

const ApplyLeave = () => {
  const [formData, setFormData] = useState({
    leaveTypes: "",
    leaveTimes: "",
    startDate: "",
    endDate: "",
    reason: "",
    Employee_id: localStorage.getItem("employeeId"),
    userName: localStorage.getItem("userName"),
  });

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // Track success or error
  const [casualLeaveUsed, setCasualLeaveUsed] = useState(false); // Track if casual leave has been used
  const [saturdayOffUsed, setSaturdayOffUsed] = useState(false); // Track if Saturday Off has been used

  const leaveTypeOptions = [
    "Casual Leave",
    "Work From Home",
    "Maternity Leave",
    "Permission",
    "LossofPay Leave", // Added Loss of Pay option
  ];

  const fullDayOptions = ["Full day", "Halfday"];
  const permissionOptions = ["1 hour", "2 hours"];

  useEffect(() => {
    const employeeId = localStorage.getItem("employeeId");
    const userName = localStorage.getItem("userName");

    if (employeeId && userName) {
      setFormData((prevData) => ({
        ...prevData,
        Employee_id: employeeId,
        userName: userName,
      }));
    }
  }, []);

  const isSaturday = (date) => {
    const selectedDate = new Date(date);
    return selectedDate.getDay() === 6;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/applyLeave`,
        formData
      );
      setMessage(response.data.message);
      setMessageType("success");
    } catch (error) {
      setMessage(error.response?.data?.message || "An error occurred");
      setMessageType("error");
    }
  };

  return (
    <div className="apply-leave-container">
      <div className="apply-leave-card">
        <h2 className="apply-leave-title">Apply for Leave</h2>

        {message && (
          <div
            className={`apply-leave-alert ${
              messageType === "success"
                ? "apply-leave-alert-success"
                : "apply-leave-alert-error"
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="apply-leave-form">
          <div className="row">
            <div className="col-md-6 apply-leave-form-group">
              <label className="apply-leave-label">Start Date</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="apply-leave-input"
                required
              />
            </div>
            <div className="col-md-6 apply-leave-form-group">
              <label className="apply-leave-label">End Date</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="apply-leave-input"
                required
              />
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 apply-leave-form-group">
              <select
                name="leaveTypes"
                value={formData.leaveTypes}
                onChange={handleChange}
                className="apply-leave-select"
                required
              >
                <option value="" disabled>
                  Select Leave Type
                </option>
                {leaveTypeOptions.map(
                  (type) =>
                    (!casualLeaveUsed || type !== "Casual Leave") &&
                    (!saturdayOffUsed || type !== "Saturday Off") && (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    )
                )}
                {formData.startDate &&
                  isSaturday(formData.startDate) &&
                  !saturdayOffUsed && (
                    <option value="Saturday Off">Saturday Off</option>
                  )}
              </select>
            </div>

            <div className="col-md-6 apply-leave-form-group">
              {formData.leaveTypes === "Permission" ? (
                <select
                  name="leaveTimes"
                  value={formData.leaveTimes}
                  onChange={handleChange}
                  className="apply-leave-select"
                  required
                >
                  <option value="" disabled>
                    Select Permission Time
                  </option>
                  {permissionOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : (
                <select
                  name="leaveTimes"
                  value={formData.leaveTimes}
                  onChange={handleChange}
                  className="apply-leave-select"
                  required
                >
                  <option value="" disabled>
                    Select Leave Time
                  </option>
                  {fullDayOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          <div className="apply-leave-form-group">
            <textarea
              name="reason"
              placeholder="Reason for Leave"
              value={formData.reason}
              onChange={handleChange}
              className="apply-leave-input"
              required
            />
          </div>

          <button type="submit" className="apply-leave-btn">
            Apply Leave
          </button>
        </form>
      </div>
    </div>
  );
};

export default ApplyLeave;
