import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AddEmployee.css'; // Import custom CSS file
import { useLocation } from 'react-router-dom';

const AddEmployee = () => {
  const location = useLocation();
  const [employee, setEmployee] = useState(null);

  const [employeeData, setEmployeeData] = useState({
    employeeId: '',
    name: '',
    userName: '',
    password: '',
    userType: '',
    designation: '',
    domain: '',
    dateOfJoining: '',
    mobileNumber: '',
    mobileNumber2: '',
    email: '',
    email2: '',
    address: '',
    profileUrl: null, // Handle file as a URL (image)
    dateOfBirth: '',
    bankName: '',
    bankBranch: '',
    accountNo: '',
    ifscNo: '',
    salary: '',
    isActive:'1',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  useEffect(() => {
    if (location.state && location.state.employee) {
      setEmployee(location.state.employee);
      setEmployeeData({
        ...location.state.employee, // Pre-fill form with employee data
        profileUrl: null, // Handle file separately if necessary
      });
    }
  }, [location]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === 'file') {
      // Handle file input (profileUrl)
      setEmployeeData({ ...employeeData, profileUrl: files[0] });
    } else {
      setEmployeeData({ ...employeeData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate required fields
    const requiredFields = ['employeeId', 'name', 'userName', 'password', 'email', 'mobileNumber'];
    for (let field of requiredFields) {
      if (!employeeData[field]) {
        setError(`Missing required field: ${field}`);
        return;
      }
    }

    // Create form data
    const formData = new FormData();
    Object.keys(employeeData).forEach((key) => {
      if (employeeData[key]) {
        formData.append(key, employeeData[key]);
      }
    });

   /*  const response = await axios.post(`${process.env.REACT_APP_API_URL}/getEmployeeById/${employeeId}`);
    if (response.data.status === 'Success') {
    }
 */
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/addEmployee`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setSuccess(response.data.message);
      // Display an alert based on the success message
      if (response.data.message === "Employee added successfully") {
        alert('Employee added successfully!');
      } else if (response.data.message === "Employee updated successfully") {
        alert('Employee updated successfully!');
      }
      // Optionally reset form
      setEmployeeData({
        employeeId: '',
        name: '',
        userName: '',
        password: '',
        userType: '',
        designation: '',
        domain: '',
        dateOfJoining: '',
        mobileNumber: '',
        mobileNumber2: '',
        email: '',
        email2: '',
        address: '',
        profileUrl: null, // Reset file input
        dateOfBirth: '',
        bankName: '',
        bankBranch: '',
        accountNo: '',
        ifscNo: '',
        salary: '',
        isActive:'1',
      });
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message);
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    }
  };

  return (
    <div className="container mt-5">

    
{employee && <p>{employee.name}</p>}
<h2 className="text-xl font-semibold">Employee List</h2>
<form onSubmit={handleSubmit} className="border p-4 rounded shadow">
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        {/* Employee ID, Name, and User Name */}
        <div className="row mb-3">
          <div className="col">
            <label className="form-label">Employee ID</label>
            <input
              type="text"
              name="employeeId"
              className="form-control"
              value={employeeData.employeeId}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col">
            <label className="form-label">Name</label>
            <input
              type="text"
              name="name"
              className="form-control"
              value={employeeData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col">
            <label className="form-label">User Name</label>
            <input
              type="text"
              name="userName"
              className="form-control"
              value={employeeData.userName}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Password, User Type, and Designation */}
        <div className="row mb-3">
          <div className="col">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              className="form-control"
              value={employeeData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col">
            <label className="form-label">User Type</label>
            <select
              type="text"
              name="userType"
              className="form-control"
              value={employeeData.userType}
              onChange={handleChange}
              >
              <option value="">Select userType</option>
              <option value="Admin">Admin</option>
              <option value="Employee">Employee</option>
            </select>
          </div>
          <div className="col">
            <label className="form-label">Designation</label>
            <select
              type="text"
              name="designation"
              className="form-control"
              value={employeeData.designation}
              onChange={handleChange}
              >
              <option value="">Select Designation</option>
              <option value="Sr Technical Lead">Sr Technical Lead</option>
              <option value="Software Engineer">Software Engineer</option>
            </select>
          </div>
        </div>

        {/* Domain, Date of Joining, and Mobile Number */}
        <div className="row mb-3">
          <div className="col">
            <label className="form-label">Domain</label>
            <select
              type="text"
              name="domain"
              className="form-control"
              value={employeeData.domain}
              onChange={handleChange}
              >
              <option value="">Select Domain</option>
              <option value="Sr Technical Lead">Development</option>
              <option value="Software Engineer">IdCard</option>
            </select>
          </div>
          <div className="col">
            <label className="form-label">Date of Joining</label>
            <input
              type="date"
              name="dateOfJoining"
              className="form-control"
              value={employeeData.dateOfJoining}
              onChange={handleChange}
            />
          </div>
          <div className="col">
            <label className="form-label">Mobile Number</label>
            <input
              type="text"
              name="mobileNumber"
              className="form-control"
              value={employeeData.mobileNumber}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Mobile Number 2, Email, and Email 2 */}
        <div className="row mb-3">
          <div className="col">
            <label className="form-label">Parrent Mobile No</label>
            <input
              type="text"
              name="mobileNumber2"
              className="form-control"
              value={employeeData.mobileNumber2}
              onChange={handleChange}
            />
          </div>
          <div className="col">
            <label className="form-label">Email</label>
            <input
              type="text"
              name="email"
              className="form-control"
              value={employeeData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col">
            <label className="form-label">Parrent Email </label>
            <input
              type="text"
              name="email2"
              className="form-control"
              value={employeeData.email2}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Address, Profile Image, and Date of Birth */}
        <div className="row mb-3">
          <div className="col">
            <label className="form-label">Address</label>
            <input
              type="text"
              name="address"
              className="form-control"
              value={employeeData.address}
              onChange={handleChange}
            />
          </div>
          <div className="col">
            <label className="form-label">Profile Image</label>
            <input
              type="file"
              name="profileUrl"
              className="form-control"
              accept="image/*"
              onChange={handleChange}
            />
          </div>
          <div className="col">
            <label className="form-label">Date of Birth</label>
            <input
              type="date"
              name="dateOfBirth"
              className="form-control"
              value={employeeData.dateOfBirth}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Bank Information, Account No, and Salary */}
        <div className="row mb-3">
          <div className="col">
            <label className="form-label">Bank Name</label>
            <input
              type="text"
              name="bankName"
              className="form-control"
              value={employeeData.bankName}
              onChange={handleChange}
            />
          </div>
          <div className="col">
            <label className="form-label">Bank Branch</label>
            <input
              type="text"
              name="bankBranch"
              className="form-control"
              value={employeeData.bankBranch}
              onChange={handleChange}
            />
          </div>
          <div className="col">
            <label className="form-label">Account No</label>
            <input
              type="text"
              name="accountNo"
              className="form-control"
              value={employeeData.accountNo}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col">
            <label className="form-label">IFSC No</label>
            <input
              type="text"
              name="ifscNo"
              className="form-control"
              value={employeeData.ifscNo}
              onChange={handleChange}
            />
          </div>
          <div className="col">
            <label className="form-label">Salary</label>
            <input
              type="number"
              name="salary"
              className="form-control"
              value={employeeData.salary}
              onChange={handleChange}
            />
          </div>
        </div>

        <button type="submit" className="btn btn-primary">
          Add Employee
        </button>
      </form>
    </div>
  );
};

export default AddEmployee;
