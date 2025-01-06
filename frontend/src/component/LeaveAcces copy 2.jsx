import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";

const LeaveApplications = () => {
  const [leaveApplications, setLeaveApplications] = useState([]);
  const [fromDate, setFromDate] = useState(new Date().toISOString().split('T')[0]);  // Default to current date
  const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0]);  // Default to current date

  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [employees, setEmployees] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState(""); // Track selected status for filtering

  const fetchLeaveApplications = (startDate, endDate, employeeName = "") => {
    axios
      .post(`${process.env.REACT_APP_API_URL}/getLeaveRequestsAll`, {
        startDate: startDate,
        endDate: endDate,
      })
      .then((response) => {
        let filteredData = response.data.data || [];
  
        const employeeNames = [...new Set(filteredData.map((leave) => leave.employeeName))];
        setEmployees(employeeNames);
  
        if (employeeName) {
          filteredData = filteredData.filter(
            (leave) => leave.employeeName === employeeName
          );
        }
  
        // Filter by startDate and endDate range
        filteredData = filteredData.filter((leave) => {
          const leaveStartDate = moment(leave.startDate);
          const leaveEndDate = moment(leave.endDate);
  
          // Check if the leave's start date is on or after the selected start date
          // and if the leave's end date is on or before the selected end date
          return (
            leaveStartDate.isSameOrAfter(startDate) &&
            leaveEndDate.isSameOrBefore(endDate)
          );
        });
  
        // Filter by status if selected
        if (selectedStatus) {
          filteredData = filteredData.filter(
            (leave) => leave.status === selectedStatus
          );
        }
  
        setLeaveApplications(filteredData);
      })
      .catch((error) => {
        console.error("Error fetching leave applications:", error);
      });
  };
  

  useEffect(() => {
    fetchLeaveApplications(fromDate, toDate, selectedEmployee);
  }, [fromDate, toDate, selectedEmployee, selectedStatus]);

  const handleAccept = (id, reason, remarks) => {
    axios
      .put(`${process.env.REACT_APP_API_URL}1/updateLeaveStatus`, {
        leaveId: id,
        remarks,
        status: "Accepted",
      })
      .then((response) => {
        console.log("Leave accepted:", response.data);
        fetchLeaveApplications(fromDate, toDate, selectedEmployee);
      })
      .catch((error) => {
        console.error("Error accepting leave:", error);
      });
  };

  const handleReject = (id, reason, remarks) => {
    axios
      .put(`${process.env.REACT_APP_API_URL}/updateLeaveStatus`, {
        leaveId: id,
        remarks ,
        status: "Rejected",
      })
      .then((response) => {
        console.log("Leave rejected:", response.data);
        fetchLeaveApplications(fromDate, toDate, selectedEmployee);
      })
      .catch((error) => {
        console.error("Error rejecting leave:", error);
      });
  };

  return (
    <div style={containerStyle}>
      {/* Fixed Date Picker Section */}
      <div style={filterContainerStyle}>
        <div style={filterItemStyle}>
          <label htmlFor="fromDate">From Date:</label>
          <input
            type="date"
            id="fromDate"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            style={inputStyle}
          />
        </div>

        <div style={filterItemStyle}>
          <label htmlFor="toDate">To Date:</label>
          <input
            type="date"
            id="toDate"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            style={inputStyle}
          />
        </div>

        <div style={filterItemStyle}>
        <label htmlFor="employee" style={{ marginRight: "10px" }}> All :</label>
        <select
            id="employee"
            value={selectedEmployee}
            onChange={(e) => setSelectedEmployee(e.target.value)}
            style={dropdownStyle}
          >
            <option value="">All Employees</option>
            {employees.map((employee, index) => (
              <option key={index} value={employee}>
                {employee}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Status Filter Buttons */}
      <div style={statusFilterContainerStyle}>
        {["Pending", "Accepted", "Rejected"].map((status) => (
          <button
            key={status}
            onClick={() => setSelectedStatus(status)}
            style={{
              ...statusButtonStyle,
              ...(selectedStatus === status ? selectedButtonStyle : defaultButtonStyle),
            }}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Leave Applications Display */}
      <div style={leaveListStyle}>
        {leaveApplications.length === 0 ? (
          <p>No leave applications available for the selected filters.</p>
        ) : (
          leaveApplications.map((leave) => (
            <div key={leave.lid} style={cardStyle}>
              <div style={cardHeaderStyle}>
                <div>{leave.employeeName}</div>
                <span style={getStatusStyle(leave.status)}>{leave.status}</span>
              </div>
              <div style={dateStyle}>
                <div><strong>From:</strong> {moment(leave.startDate).format("MMMM D, YYYY")}</div> 
                <div><strong>To:</strong> {moment(leave.endDate).format("MMMM D, YYYY")}</div>
              </div>
              <div style={leaveDetailsStyle}>
                <div><strong>Leave Type:</strong> {leave.leaveTypes}</div>
                <div><strong>Leave Time:</strong> {leave.leaveTimes}</div>
                <div><strong>No. of Days:</strong> {leave.noOfDays}</div>
              </div>
              <div><strong>Reason:</strong> {leave.reason}</div>
              <textarea
                style={textareaStyle}
                placeholder="Add Remarks"
                id={`remarks-${leave.lid}`}
                value={leave.remarks }
              />
              {/*  <textarea
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
                /> */}
              {leave.status === "Pending" && (
                <div style={actionButtonContainerStyle}>
                  <button
                    onClick={() =>
                      handleAccept(
                        leave.lid,
                        leave.reason,
                        document.getElementById(`remarks-${leave.lid}`).value
                      )
                    }
                    style={acceptButtonStyle}
                  >
                    Accept
                  </button>
                  <button
                    onClick={() =>
                      handleReject(
                        leave.lid,
                        leave.reason,
                        document.getElementById(`remarks-${leave.lid}`).value
                      )
                    }
                    style={rejectButtonStyle}
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

const containerStyle = {
  padding: "16px",
  maxWidth: "900px",
  margin: "0 auto",
  paddingTop: "40px",
};

const leaveListStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "16px",
  marginTop: "70px",
  overflowY: "auto", // Enables scrolling if the list gets too long
  maxHeight: "70vh", // Limit the height to 60% of the viewport
};

const filterContainerStyle = {
  position: "fixed",
  top: "20px",
  left: "60%",
  transform: "translateX(-50%)",
  padding: "8px",
  backgroundColor: "#fff",
  borderRadius: "8px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  zIndex: 10,
  display: "flex",
  justifyContent: "space-between",
  gap: "8px",
  width: "60%",
  flexWrap: "wrap",
  boxSizing: "border-box", // Ensures padding and border are included in width
};

const filterItemStyle = {
  flex: "1",
  minWidth: "200px",
  gap: "16px",      
};

const inputStyle = {
  padding: "8px",
  borderRadius: "6px",
  border: "1px solid #ccc",
  width: "150px",
};

const dropdownStyle = {
  padding: "8px",
  borderRadius: "6px",
  border: "1px solid #ccc",
  fontSize: "14px",
  minWidth: "180px",
};

const cardStyle = {
  backgroundColor: "#fff",
  borderRadius: "8px",
  boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
  padding: "14px",
  marginBottom: "16px",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
};

const cardHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  fontSize: "16px",
  color: "#007BFF",
};

const dateStyle = {
  display: "flex",
  marginTop: "6px",
  color: "#555",
  gap: "16px",      
};

const leaveDetailsStyle = {
  marginTop: "8px",
  display: "flex",
  gap: "16px",
};

const getStatusStyle = (status) => {
  switch (status) {
    case "Pending":
      return { fontSize: "14px", color: "orange" };
    case "Accepted":
      return { fontSize: "14px", color: "green" };
    case "Rejected":
      return { fontSize: "14px", color: "red" };
    default:
      return {};
  }
};

const textareaStyle = {
  width: "100%",
  padding: "2px",
  fontSize: "14px",
  borderRadius: "6px",
  border: "1px solid #ccc",
  marginTop: "12px",
};

const actionButtonContainerStyle = {
  display: "flex",
  justifyContent: "space-between",
  marginTop: "8px",
};

const acceptButtonStyle = {
  backgroundColor: "green",
  padding: "8px 16px",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};

const rejectButtonStyle = {
  backgroundColor: "red",
  padding: "8px 16px",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};

const statusFilterContainerStyle = {
  display: "flex",
  justifyContent: "space-between",
  marginTop: "20px",
  padding: "10px",
  position: "fixed",
  top: "60px", // Adjust top to make space for filters
  left: "60%",
  transform: "translateX(-50%)",
  width: "50%",
  zIndex: 5,
};

const statusButtonStyle = {
  flex: 1, // Make buttons take equal width
  padding: "8px",
  borderRadius: "8px",
  cursor: "pointer",
  fontSize: "14px",
};

const selectedButtonStyle = {
  backgroundColor: "#0400ff",
  color: "white",
};

const defaultButtonStyle = {
  backgroundColor: '#e0e0e0',
};

export default LeaveApplications;
