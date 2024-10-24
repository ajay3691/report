import React, { useEffect, useState } from 'react';
import axios from 'axios';

const LeaveApplications = () => {
  // Enhanced styles for a more modern UI
  const styles = {
    container: {
      width: '90%',
      margin: '10px auto',
      padding: '20px',
      borderRadius: '12px',
      backgroundColor: '#f9f9f9',
      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
    },
    title: {
      textAlign: 'center',
      fontSize: '26px',
      fontWeight: 'bold',
      color: '#333',
      marginBottom: '50px',
    },
    filterContainer: {
      display: 'flex',
      justifyContent: 'space-evenly',
      marginBottom: '20px',
    },
    filterButton: (active) => ({
      flexGrow: 1,
      padding: '6px',
      borderRadius: '15px',
      backgroundColor: active ? '#007BFF' : '#e0e0e0',
      color: active ? '#fff' : '#000',
      cursor: 'pointer',
      transition: 'background-color 0.3s, box-shadow 0.3s',
      textAlign: 'center',
      margin: '0 5px',
      boxShadow: active ? '0 3px 6px rgba(0, 123, 255, 0.3)' : 'none',
    }),
    formContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '20px',
    },
    applicationCard: {
      backgroundColor: '#fff',
      borderRadius: '12px',
      padding: '20px',
      marginBottom: '15px',
      border: '1px solid #ddd',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    },
    applicationHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '12px',
    },
    applicationStatus: (status) => ({
      fontWeight: 'bold',
      color: status === 'Accepted' ? 'green' : status === 'Pending' ? 'orange' : 'red',
      textTransform: 'uppercase',
    }),
    leaveType: {
      fontSize: '18px',
      fontWeight: 'bold',
      color: '#333',
    },
    dateText: {
      fontSize: '16px',
      color: '#555',
    },
    leaveDetails: {
      fontSize: '15px',
      marginTop: '8px',
      color: '#666',
    },
    reason: {
      fontStyle: 'italic',
      color: '#777',
      marginTop: '8px',
    },
    loading: {
      textAlign: 'center',
      fontSize: '18px',
      fontWeight: 'bold',
      color: '#007BFF',
    },
    scrollableContent: {
      maxHeight: '400px', // Set height for scrollable area
      overflowY: 'auto',
    },
    tableHeader: {
      fontWeight: 'bold',
      borderBottom: '2px solid #ddd',
      paddingBottom: '10px',
      marginBottom: '15px',
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
  const employeeId = localStorage.getItem('employeeId') || 'A'; // Default to 'A' if not found

  useEffect(() => {
    const fetchLeaveApplications = async () => {
      setLoading(true);
      try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/getLeaveApplications`, {
          Employee_id: employeeId,
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
    setFilteredApplications(leaveApplications); // Reset filtered applications
  };

  // Function to format dates to DD-MM-YYYY
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  if (loading) {
    return <div style={styles.loading}>Loading...</div>;
  }

  return (
    <div style={{ ...styles.container, marginTop: '-10px', marginBottom: "-50px" }}>
      <h1 style={styles.title}>Leave Status</h1>

      <form onSubmit={handleDateSubmit} style={styles.formContainer}>
        <div style={{ marginBottom: '-15px', marginTop: '-50px' }}>
          <label>Start Date</label>
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>
        <div style={{ marginBottom: '-15px', marginTop: '-50px' }}>
          <label>End Date</label>
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>
      </form>

      <div style={styles.filterContainer}>
        <div style={styles.filterButton(statusFilter === 'All')} onClick={() => handleFilterChange('All')}>All</div>
        <div style={styles.filterButton(statusFilter === 'Pending')} onClick={() => handleFilterChange('Pending')}>Pending</div>
        <div style={styles.filterButton(statusFilter === 'Accepted')} onClick={() => handleFilterChange('Accepted')}>Accepted</div>
        <div style={styles.filterButton(statusFilter === 'Rejected')} onClick={() => handleFilterChange('Rejected')}>Rejected</div>
      </div>

      <div style={styles.tableHeader}>
        <span>Leave Applications</span>
      </div>

      <div style={styles.scrollableContent}>
        {filteredApplications.length > 0 ? (
          filteredApplications.map((application, index) => (
            <div key={index} style={styles.applicationCard}>
              <div style={styles.applicationHeader}>
                <span style={styles.leaveType}>{application.leaveTypes}</span>
                <span style={styles.applicationStatus(application.status)}>{application.status}</span>
              </div>
              <div style={styles.dateText}>
                From: {formatDate(application.startDate)} To: {formatDate(application.endDate)}
              </div>
              <div style={styles.leaveDetails}>Leave Time: {application.leaveTimes}</div>
              <div style={styles.leaveDetails}>Number of Days: {application.noOfDays}</div>
              <div style={styles.reason}>Reason: {application.reason}</div>
            </div>
          ))
        ) : (
          <div>No leave applications found</div>
        )}
      </div>
    </div>
  );
};

export default LeaveApplications;
