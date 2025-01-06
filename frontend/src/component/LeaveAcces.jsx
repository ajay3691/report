import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";

const LeaveApplications = () => {
  const [leaveApplications, setLeaveApplications] = useState([]);
  const [fromDate, setFromDate] = useState(new Date().toISOString().split('T')[0]);  // Default to current date
  const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0]);  // Default to current date
  const [remarks, setRemarks] = useState({});

  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [employees, setEmployees] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState(""); // Track selected status for filtering
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Update window width when the window is resized
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const leaveListStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    marginTop: windowWidth < 600 ? "200px" : "100px", // Adjust margin-top based on screen size
    overflowY: "auto", // Enables scrolling if the list gets too long
    maxHeight: "70vh", // Limit the height to 70% of the viewport
    padding: "0 16px", // Add some horizontal padding for better spacing on all screens
    boxSizing: "border-box", // Ensures padding doesn't affect overall width
  };
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
      .put(`${process.env.REACT_APP_API_URL}/updateLeaveStatus`, {
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
  const handleRemarksChange = (lid, event) => {
    setRemarks((prevRemarks) => ({
      ...prevRemarks,
      [lid]: event.target.value,
    }));
  };
  
  return (
    <div style={containerStyle}>
      <div>
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
        <label htmlFor="employee" style={{ marginRight: "0px" }}> All :</label>
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
        <div style={filterItemStyle}>
  <label htmlFor="status" style={{ marginRight: "0px" }}>Status:</label>
  <select
    id="status"
    value={selectedStatus}
    onChange={(e) => setSelectedStatus(e.target.value)}
    style={dropdownStyle1}  // You can reuse your existing dropdownStyle here
  >
    <option value="Pending">Pending</option>
    <option value="Accepted">Accepted</option>
    <option value="Rejected">Rejected</option>
  </select>
</div>

      </div>

      {/* Status Filter Buttons */}
     

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
      value={remarks[leave.lid] || leave.rejectReason || ""}
      onChange={(e) => handleRemarksChange(leave.lid, e)}
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


const filterContainerStyle = {
  position: "fixed",
  top: "10px",    // Added top spacing for the filter container
  left: "55%",    // Center the container horizontally
  transform: "translateX(-50%)",
  width: "90%",   // Take up most of the screen width
  backgroundColor: "#fff",  // White background for clarity
  borderRadius: "10px", // Rounded corners
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // Subtle shadow for depth
  padding: "20px",  // Add padding inside the container
  zIndex: 10,     // Ensure it's on top of other elements
  display: "flex", 
  flexWrap: "wrap", // Wrap items on smaller screens
  justifyContent: "center", // Center the items inside the container
};

const filterItemStyle = {
  margin: "3px",  // Space between filter items
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start", // Align items to the left
  width: "auto",  // Flexible width for responsiveness
};
const filterItemStyle1 = {
  margin: "5px",  // Space between filter items
  display: "flex",
  flexDirection: "row",
  alignItems: "flex-start", // Align items to the left
  width: "auto",  // Flexible width for responsiveness
};
const dropdownStyle1 = {
  width: "200px", // Adjust the width as needed
  padding: "8px",
  marginTop: "5px",
  borderRadius: "5px",
  border: "1px solid #ccc",
  fontSize: "14px",
};



const inputStyle = {
  width: "200px",
  padding: "8px",
  marginTop: "5px",
  borderRadius: "5px",
  border: "1px solid #ccc",
  fontSize: "14px",
};

const dropdownStyle = {
  width: "200px",
  padding: "8px",
  marginTop: "5px",
  borderRadius: "5px",
  border: "1px solid #ccc",
  fontSize: "14px",
};

const statusButtonStyle = {
  padding: "10px 20px",
  margin: "5px",
  fontSize: "14px",
  cursor: "pointer",
  borderRadius: "5px",
  border: "none",
  transition: "background-color 0.3s ease, color 0.3s ease", // Smooth transition for hover effect
};

const selectedButtonStyle = {
  backgroundColor: "#007bff",  // Blue color for selected state
  color: "#fff",  // White text
};

const defaultButtonStyle = {
  backgroundColor: "#f8f9fa",  // Light grey for unselected state
  color: "#333",  // Dark text color
};

// Media query for responsiveness
const mobileStyles = {
  "@media (max-width: 768px)": {
    filterContainerStyle: {
      width: "100%", // Full width on mobile
      left: "0",  // Align to the left side on mobile
      transform: "none",  // Remove the translate effect
      top: "10px", // Keep some spacing from the top
    },
    inputStyle: {
      width: "100%",  // Full width for inputs on mobile
    },
    dropdownStyle: {
      width: "100%",  // Full width for select on mobile
    },
    statusButtonStyle: {
      width: "100%",  // Full width for buttons on mobile
      marginBottom: "10px",  // Add margin between buttons
    },
  },
};

const containerStyle = {
  padding: "16px",
  maxWidth: "900px",
  margin: "0 auto",
  paddingTop: "40px",
};

/* const leaveListStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "16px",
  marginTop: windowWidth < 600 ? "200px" : "100px", // Adjust margin-top based on screen size
  overflowY: "auto", // Enables scrolling if the list gets too long
  maxHeight: "70vh", // Limit the height to 70% of the viewport
  padding: "0 16px", // Add some horizontal padding for better spacing on all screens
  boxSizing: "border-box", // Ensures padding doesn't affect overall width
}; */


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



export default LeaveApplications;
