import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment"; // Import moment.js for date formatting

const LeaveApplications = () => {
  const [leaveApplications, setLeaveApplications] = useState([]);
  const [employees, setEmployees] = useState([]); // State for storing employee names
  const [fromDate, setFromDate] = useState("2024-10-01"); // Default start date
  const [toDate, setToDate] = useState("2024-10-31"); // Default end date
  const [selectedEmployee, setSelectedEmployee] = useState(""); // State for selected employee

  // Function to fetch leave applications based on the date range and employee name
  const fetchLeaveApplications = (from, to, employeeName = "") => {
    axios
      .post("http://localhost:4001/getLeaveRequestsAll", { fromDate: from, toDate: to })
      .then((response) => {
        // Filter by employee if a name is selected
        const filteredData = employeeName
          ? response.data.data.filter(leave => leave.employeeName === employeeName)
          : response.data.data;
        setLeaveApplications(filteredData || []);
      })
      .catch((error) => {
        console.error("Error fetching leave applications:", error);
      });
  };

  

  // Fetch leave applications whenever the fromDate, toDate, or selectedEmployee changes
  useEffect(() => {
    fetchLeaveApplications(fromDate, toDate, selectedEmployee);
  }, [fromDate, toDate, selectedEmployee]);

  // Handle the accept and reject actions
  const handleAccept = (id, reason, remarks) => {
    axios
      .put("http://localhost:4001/updateLeaveStatus", { leaveId: id, remarks, status: "Accept" })
      .then((response) => {
        console.log("Leave accepted:", response.data);
        fetchLeaveApplications(fromDate, toDate, selectedEmployee); // Refresh the data
      })
      .catch((error) => {
        console.error("Error accepting leave:", error);
      });
  };

  const handleReject = (id, reason, remarks) => {
    axios
      .put("http://localhost:4001/updateLeaveStatus", { leaveId: id, remarks, status: "Reject" })
      .then((response) => {
        console.log("Leave rejected:", response.data);
        fetchLeaveApplications(fromDate, toDate, selectedEmployee); // Refresh the data
      })
      .catch((error) => {
        console.error("Error rejecting leave:", error);
      });
  };

  // Fetch employees when the component is mounted
  useEffect(() => {
    fetchLeaveApplications();
  }, []);

  return (
    <div style={{ padding: "16px", maxWidth: "800px", margin: "0 auto", paddingTop: "60px" }}>
      {/* Fixed Date Picker Section */}
      <div
        style={{
          position: "fixed",
          top: "0",
          left: "0",
          width: "100%",
          backgroundColor: "#fff",
          padding: "12px",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          zIndex: "10",
          textAlign: "center",
          marginBottom: "16px", // Adds some space below the fixed date picker
        }}
      >
        <label htmlFor="fromDate" style={{ marginRight: "8px" }}>From Date:</label>
        <input
          type="date"
          id="fromDate"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          style={{
            padding: "6px",
            marginRight: "12px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        />
        <label htmlFor="toDate" style={{ marginRight: "8px" }}>To Date:</label>
        <input
          type="date"
          id="toDate"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          style={{
            padding: "6px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        />

        {/* Employee Dropdown */}
        <label htmlFor="employee" style={{ marginLeft: "12px", marginRight: "8px" }}>
</label>
<select
  id="employee"
  value={selectedEmployee}
  style={{
    padding: "6px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    marginLeft: "8px",
  }}
>
  <option value="">All EMP</option>
  {leaveApplications.length > 0 ? (
    // Use a Map or Set to filter out duplicate employee names
    [...new Map(leaveApplications.map((leave) => [leave.employeeName, leave])).values()].map((employee) => (
      <option key={employee.lid} value={employee.lid}>
        {employee.employeeName}
      </option>
    ))
  ) : (
    <option disabled>No employees found</option>
  )}
</select>



      </div>

      {/* Leave Applications Display */}
      <div style={{ marginTop: "80px" }}>
        {leaveApplications.length === 0 ? (
          <p>No leave applications available for the selected date range and employee.</p>
        ) : (
          leaveApplications.map((leave) => (
            <div
              key={leave.lid}
              style={{
                backgroundColor: "#fff",
                borderRadius: "8px",
                boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
                padding: "14px",
                marginBottom: "16px",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
              }}
            >
              {/* Card Header: Employee Name and Status */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ flex: 1, textAlign: "left", fontSize: "16px", color: "#007BFF" }}>
                  {leave.employeeName}
                </div>
                <span
                  style={{
                    fontSize: "14px",
                    color:
                      leave.status === "Pending"
                        ? "orange"
                        : leave.status === "Accept"
                        ? "green"
                        : "red",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {leave.status === "Pending"
                    ? "🕐 Pending"
                    : leave.status === "Accept"
                    ? "✔️ Accepted"
                    : "❌ Rejected"}
                </span>
              </div>

              {/* Leave Dates */}
              <div style={{ display: "flex", marginTop: "6px", color: "#555" }}>
                <div style={{ flex: 1 }}>
                  <strong>From:</strong> {moment(leave.startDate).format("MMMM D, YYYY")}
                </div>
                <div style={{ flex: 1 }}>
                  <strong>To:</strong> {moment(leave.endDate).format("MMMM D, YYYY")}
                </div>
              </div>

              {/* Leave Type, Time, and Days */}
              <div style={{ marginTop: "8px", display: "flex", flexWrap: "wrap" }}>
                <div style={{ flex: 1, marginRight: "16px" }}>
                  <strong>Leave Type:</strong> {leave.leaveTypes}
                </div>
                <div style={{ flex: 1, marginRight: "16px" }}>
                  <strong>Leave Time:</strong> {leave.leaveTimes}
                </div>
                <div style={{ flex: 1 }}>
                  <strong>No. of Days:</strong> {leave.noOfDays}
                </div>
              </div>

              {/* Reason for Leave */}
              <div style={{ marginTop: "8px" }}>
                <strong>Reason:</strong> {leave.reason}
              </div>

              {/* Remarks Section */}
              <div style={{ marginTop: "12px" }}>
                <textarea
                  placeholder="Add Remarks"
                  style={{
                    width: "100%",
                    padding: "6px",
                    marginBottom: "6px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                    resize: "vertical",
                  }}
                  id={`remarks-${leave.lid}`}
                />
              </div>

              {/* Action Buttons */}
              {leave.status === "Pending" && (
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "12px" }}>
                  <button
                    onClick={() =>
                      handleAccept(leave.lid, leave.reason, document.getElementById(`remarks-${leave.lid}`).value)
                    }
                    style={{
                      backgroundColor: "#4CAF50", // Green for accept
                      color: "white",
                      padding: "6px 12px",
                      borderRadius: "6px",
                      border: "none",
                      cursor: "pointer",
                      transition: "background-color 0.3s ease",
                      marginRight: "8px",
                      fontSize: "14px",
                    }}
                  >
                    Accept
                  </button>

                  <button
                    onClick={() =>
                      handleReject(leave.lid, leave.reason, document.getElementById(`remarks-${leave.lid}`).value)
                    }
                    style={{
                      backgroundColor: "#FF5733", // Red for reject
                      color: "white",
                      padding: "6px 12px",
                      borderRadius: "6px",
                      border: "none",
                      cursor: "pointer",
                      transition: "background-color 0.3s ease",
                      fontSize: "14px",
                    }}
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LeaveApplications;
