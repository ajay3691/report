import React, { useState } from 'react';
import axios from 'axios';
import './AddEmployee.css'; // Import custom CSS file

const AddEmployee = () => {
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
    profileUrl: null, // Changed from profileUrl to profileUrl
    dateOfBirth: '',
    bankName: '',
    bankBranch: '',
    accountNo: '',
    ifscNo: '',
    salary: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployeeData({ ...employeeData, [name]: value });
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

    try {
      const response = await axios.post('http://localhost:4001/addEmployee', employeeData);
      setSuccess(response.data.message);
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
        profileUrl: null, // Changed from profileUrl to profileUrl
        dateOfBirth: '',
        bankName: '',
        bankBranch: '',
        accountNo: '',
        ifscNo: '',
        salary: '',
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
      <h2 className="text-center mb-4">Add Employee</h2>
      <form onSubmit={handleSubmit} className="border p-4 rounded shadow">
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <div className="row mb-3">
          <div className="col">
            <label className="form-label">Employee ID</label>
            <input type="text" name="employeeId" className="form-control" value={employeeData.employeeId} onChange={handleChange} required />
          </div>
          <div className="col">
            <label className="form-label">Name</label>
            <input type="text" name="name" className="form-control" value={employeeData.name} onChange={handleChange} required />
          </div>
          <div className="col">
            <label className="form-label">User Name</label>
            <input type="text" name="userName" className="form-control" value={employeeData.userName} onChange={handleChange} required />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col">
            <label className="form-label">Password</label>
            <input type="password" name="password" className="form-control" value={employeeData.password} onChange={handleChange} required />
          </div>
          <div className="col">
            <label className="form-label">User Type</label>
            <input type="text" name="userType" className="form-control" value={employeeData.userType} onChange={handleChange} />
          </div>
          <div className="col">
            <label className="form-label">Designation</label>
            <input type="text" name="designation" className="form-control" value={employeeData.designation} onChange={handleChange} />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col">
            <label className="form-label">Domain</label>
            <input type="text" name="domain" className="form-control" value={employeeData.domain} onChange={handleChange} />
          </div>
          <div className="col">
            <label className="form-label">Date of Joining</label>
            <input type="date" name="dateOfJoining" className="form-control" value={employeeData.dateOfJoining} onChange={handleChange} />
          </div>
          <div className="col">
            <label className="form-label">Mobile Number</label>
            <input type="text" name="mobileNumber" className="form-control" value={employeeData.mobileNumber} onChange={handleChange} required />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col">
            <label className="form-label">Alternative Mobile Number</label>
            <input type="text" name="mobileNumber2" className="form-control" value={employeeData.mobileNumber2} onChange={handleChange} />
          </div>
          <div className="col">
            <label className="form-label">Email</label>
            <input type="email" name="email" className="form-control" value={employeeData.email} onChange={handleChange} required />
          </div>
          <div className="col">
            <label className="form-label">Alternative Email</label>
            <input type="email" name="email2" className="form-control" value={employeeData.email2} onChange={handleChange} />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col">
            <label className="form-label">Address</label>
            <textarea name="address" className="form-control" value={employeeData.address} onChange={handleChange}></textarea>
          </div>
        </div>

        <div className="row mb-3">
        <div className="col">
        <label className="form-label">Profile Image</label>
      <div className="custom-file-input">
        <input
          type="file"
          name="profileUrl"
          className="form-control file-input"
          accept="image/*"
          onChange={handleChange}
          id="customFile"
        />
        <label htmlFor="customFile" className="file-label">Choose File</label>
      </div>
   </div>

          <div className="col">
            <label className="form-label">Date of Birth</label>
            <input type="date" name="dateOfBirth" className="form-control" value={employeeData.dateOfBirth} onChange={handleChange} />
          </div>
          <div className="col">
            <label className="form-label">Bank Name</label>
            <input type="text" name="bankName" className="form-control" value={employeeData.bankName} onChange={handleChange} />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col">
            <label className="form-label">Bank Branch</label>
            <input type="text" name="bankBranch" className="form-control" value={employeeData.bankBranch} onChange={handleChange} />
          </div>
          <div className="col">
            <label className="form-label">Account No</label>
            <input type="text" name="accountNo" className="form-control" value={employeeData.accountNo} onChange={handleChange} />
          </div>
          <div className="col">
            <label className="form-label">IFSC No</label>
            <input type="text" name="ifscNo" className="form-control" value={employeeData.ifscNo} onChange={handleChange} />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col">
            <label className="form-label">Salary</label>
            <input type="text" name="salary" className="form-control" value={employeeData.salary} onChange={handleChange} />
          </div>
        </div>

        <button type="submit" className="btn">Add Employee</button>
      </form>
    </div>
  );
};

export default AddEmployee;
