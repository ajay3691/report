import React, { useEffect, useState } from 'react';
import axios from 'axios';

const LeaveApplications = () => {
  // Basic styles
  const styles = {
    container: {
      width: '90%',
      margin: '20px auto',
      padding: '20px',
      borderRadius: '8px',
      backgroundColor: '#f4f4f4',
    },
    title: {
      textAlign: 'center',
      fontSize: '24px',
      fontWeight: 'bold',
      marginBottom: '20px',
    },
    filterContainer: {
      display: 'flex',
      justifyContent: 'space-evenly',
      marginBottom: '20px',
    },
    filterButton: (active) => ({
      flexGrow: 1,
      padding: '10px',
      borderRadius: '5px',
      backgroundColor: active ? '#007BFF' : '#e0e0e0',
      color: active ? '#fff' : '#000',
      cursor: 'pointer',
      transition: 'background-color 0.3s',
      textAlign: 'center',
      margin: '0 5px',
    }),
    formContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '20px',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      backgroundColor: '#fff',
      borderRadius: '8px',
      overflow: 'hidden',
    },
    tableHeader: {
      backgroundColor: '#007BFF',
      color: '#fff',
      textAlign: 'left',
    },
    tableCell: {
      border: '1px solid #ddd',
      padding: '12px',
      textAlign: 'left',
    },
    statusAccepted: {
      color: 'green',
    },
  };

  const [leaveApplications, setLeaveApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All'); // For status filtering
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: ''
  });

  // Get employee ID from local storage
  const employeeId = localStorage.getItem('Employee_id') || 'A'; // Default to 'A' if not found

  useEffect(() => {
    const fetchLeaveApplications = async () => {
      setLoading(true);
      try {
        const response = await axios.post('http://localhost:4001/getLeaveApplications', {
          Employee_id: localStorage.getItem("employeeId"),
          startDate: formData.startDate || new Date().toISOString().split('T')[0],
          endDate: formData.endDate || new Date().toISOString().split('T')[0],
        });

        setLeaveApplications(response.data.data);
        setFilteredApplications(response.data.data); // Initialize filtered data
      } catch (error) {
        console.error('Error fetching leave applications:', error);
      } finally {
        setLoading(false);
      }
    };

    // Fetch leave applications on component mount and when formData changes
    fetchLeaveApplications();
  }, [employeeId, formData]);

  // Handle filtering based on status
  const handleFilterChange = (status) => {
    setStatusFilter(status);
    if (status === 'All') {
      setFilteredApplications(leaveApplications);
    } else {
      setFilteredApplications(
        leaveApplications.filter(app => app.status === status)
      );
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleDateSubmit = (e) => {
    e.preventDefault();
    // Trigger the fetch again with new dates
    setFilteredApplications(leaveApplications); // Reset filtered applications
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Leave Status</h1>

      <form onSubmit={handleDateSubmit} style={styles.formContainer}>
        <div>
          <label>Start Date</label>
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>End Date</label>
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            required
          />
        </div>
      </form>

      <div style={styles.filterContainer}>
        <div style={styles.filterButton(statusFilter === 'All')} onClick={() => handleFilterChange('All')}>All</div>
        <div style={styles.filterButton(statusFilter === 'Pending')} onClick={() => handleFilterChange('Pending')}>Pending</div>
        <div style={styles.filterButton(statusFilter === 'Accepted')} onClick={() => handleFilterChange('Accepted')}>Accepted</div>
        <div style={styles.filterButton(statusFilter === 'Rejected')} onClick={() => handleFilterChange('Rejected')}>Rejected</div>
      </div>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.tableCell}>Leave Type</th>
            <th style={styles.tableCell}>Leave Time</th>
            <th style={styles.tableCell}>No. of Days</th>
            <th style={styles.tableCell}>Reason</th>
            <th style={styles.tableCell}>Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredApplications.length > 0 ? (
            filteredApplications.map((application, index) => (
              <tr key={index}>
                <td style={styles.tableCell}>{application.leaveTypes}</td>
                <td style={styles.tableCell}>{application.leaveTimes}</td>
                <td style={styles.tableCell}>{application.noOfDays}</td>
                <td style={styles.tableCell}>{application.reason}</td>
                <td style={{ ...styles.tableCell, ...styles.statusAccepted }}>{application.status}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" style={styles.tableCell}>No leave applications found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default LeaveApplications;
