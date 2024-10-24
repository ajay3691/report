import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import './style.css'; // Ensure your stylesheet is imported correctly

const AddTask = () => {
  const navigate = useNavigate();

  const [taskData, setTaskData] = useState({
    date: new Date(),
    customer: '',
    task: '',
    estimatedTime: '',
    startTime: null,
    endTime: null,
    taskStatus: '',
    reasonForIncomplete: '',
    remarks: '',
    employeeId: localStorage.getItem('employeeId'),
    employeeName: localStorage.getItem('employeeName')
  });

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const today = moment().startOf('day').toDate();
  const minDate = moment(today).subtract(1, 'day').toDate();
  const maxDate = moment(today).add(1, 'day').toDate();

  const handleChange = (e) => {
    setTaskData({
      ...taskData,
      [e.target.name]: e.target.value
    });
  };

  const handleDateChange = (date) => {
    setTaskData({ ...taskData, date });
  };

  const handleStartTimeChange = (time) => {
    setTaskData({ ...taskData, startTime: time });
  };

  const handleEndTimeChange = (time) => {
    setTaskData({ ...taskData, endTime: time });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formattedTaskData = {
      ...taskData,
      date: moment(taskData.date).format('YYYY-MM-DD'),
      startTime: taskData.startTime ? moment(taskData.startTime).format('h:mm A') : null,
      endTime: taskData.endTime ? moment(taskData.endTime).format('h:mm A') : null
    };

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/createtask`, formattedTaskData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setSuccessMessage('Task created successfully');
      /* navigate('/employeeDashboard'); */
      setErrorMessage('');
      setTaskData({
        date: new Date(),
        customer: '',
        task: '',
        estimatedTime: '',
        startTime: null,
        endTime: null,
        taskStatus: '',
        reasonForIncomplete: '',
        remarks: '',
        employeeId: localStorage.getItem('employeeId'),
        employeeName: localStorage.getItem('employeeName')
      });
    } catch (error) {
      setSuccessMessage('');
      setErrorMessage(error.response?.data?.message || 'Server error');
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
      {successMessage && <div style={{ color: 'green', marginBottom: '10px' }}>{successMessage}</div>}
      {errorMessage && <div style={{ color: 'red', marginBottom: '10px' }}>{errorMessage}</div>}
      <form onSubmit={handleSubmit}>
        <div className='flex'>
          <div style={{ marginBottom: '15px' }}>
            <label>Date</label>
            <div style={{ position: 'relative' }}>
              <DatePicker
                selected={taskData.date}
                onChange={handleDateChange}
                dateFormat="yyyy-MM-dd"
                className="custom-datepicker" // Use custom class here
                placeholderText="Select Date"
                minDate={minDate}
                maxDate={maxDate}
              />
            </div>
          </div>
          <div style={{ marginBottom: '15px', marginLeft: "290px" }}>
            <label>Customer</label>
            <input
              type="text"
              name="customer"
              value={taskData.customer}
              onChange={handleChange}
              placeholder="Enter customer name"
              style={{ width: '450px', padding: '8px', borderRadius: '8px', border: '1px solid #ccc' }}
            />
          </div>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Task</label>
          <textarea
            name="task"
            value={taskData.task}
            onChange={handleChange}
            placeholder="Enter task description"
            style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #ccc' }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <div style={{ flex: '0 0 32%', marginRight: '10px', marginBottom: '15px' }}>
            <label>Estimated Time</label>
            <input
              type="text"
              name="estimatedTime"
              value={taskData.estimatedTime}
              onChange={handleChange}
              placeholder="Enter estimated time"
              style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #ccc' }}
            />
          </div>
          
          <div style={{ flex: '0 0 32%', marginRight: '10px', marginBottom: '15px' }}>
            <label>Start Time</label><br />
            <div style={{ position: 'relative' }}>
              <DatePicker
                selected={taskData.startTime}
                onChange={handleStartTimeChange}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={15}
                timeCaption="Time"
                dateFormat="h:mm aa"
                className="custom-datepicker"
                placeholderText="Select Start Time"
              />
            </div>
          </div>
          
          <div style={{ flex: '0 0 32%', marginBottom: '15px' }}>
            <label>End Time</label><br />
            <div style={{ position: 'relative' }}>
              <DatePicker
                selected={taskData.endTime}
                onChange={handleEndTimeChange}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={15}
                timeCaption="Time"
                dateFormat="h:mm aa"
                className="custom-datepicker"
                placeholderText="Select End Time"
              />
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <div style={{ flex: '0 0 48%', marginBottom: '15px' }}>
            <label>Task Status</label>
            <select
              name="taskStatus"
              value={taskData.taskStatus}
              onChange={handleChange}
              style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #ccc' }}
            >
              <option value="">Select Status</option>
              <option value="In Progress">In Progress</option>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          {(taskData.taskStatus === 'Pending' || taskData.taskStatus === 'In Progress') && (
            <div style={{ flex: '0 0 48%', marginBottom: '15px' }}>
              <label>Reason for Incomplete</label>
              <input
  type="text"
  name="reasonForIncomplete" // corrected name attribute
  value={taskData.reasonForIncomplete}
  onChange={handleChange}
  placeholder="Reason for incomplete task"
  style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #ccc' }}
/>

            </div>
          )}
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Remarks</label>
          <textarea
            name="remarks"
            value={taskData.remarks}
            onChange={handleChange}
            placeholder="Additional remarks"
            rows={3}
            style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #ccc' }}
          />
        </div>
        
        <button type="submit" style={{ display: 'block', margin: '0 auto', padding: '10px 20px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '8px' }}>
          Add Task
        </button>
      </form>
      
    </div>
  );
};

export default AddTask;
