import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import './style.css'; // Ensure your stylesheet is imported correctly

const AddTask = () => {
  const navigate = useNavigate();

  // Retrieve the task ID and employee ID from local storage
  const taskId = localStorage.getItem('selectedReport');
  const employeeId = localStorage.getItem('employeeId');

  const [taskData, setTaskData] = useState({
    id: taskId,
    date: new Date(),
    customer: '',
    task: '',
    estimatedTime: '',
    startTime: null,
    endTime: null,
    taskStatus: '',
    reasonForIncomplete: '',
    remarks: '',
    employeeId: employeeId,
    employeeName: localStorage.getItem('employeeName')
  });

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // If taskId is not null, fetch the existing task data
    if (taskId) {
      const fetchTaskData = async () => {
        try {
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/${employeeId}/task/${taskId}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          });
          const task = response.data.data; // Adjust based on your API response structure
          setTaskData({
            ...taskData,
            id: task.id,
            date: moment(task.date).toDate(),
            customer: task.customer,
            task: task.task,
            estimatedTime: task.estimatedTime,
            startTime: task.startTime ? moment(task.startTime, 'h:mm A').toDate() : null,
            endTime: task.endTime ? moment(task.endTime, 'h:mm A').toDate() : null,
            taskStatus: task.taskStatus,
            reasonForIncomplete: task.reasonForIncomplete,
            remarks: task.remarks,
            employeeName: task.employeeName
          });
        } catch (error) {
          setErrorMessage('Error fetching task data');
        }
      };

      fetchTaskData();
    }
  }, [taskId, employeeId]); // Make sure to include employeeId in the dependency array

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
      if (taskData.id) {
        // Update existing task
        await axios.post(`${process.env.REACT_APP_API_URL}/api/createtask`, formattedTaskData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setSuccessMessage('Task updated successfully');
      } else {
        // Create new task
        await axios.post(`${process.env.REACT_APP_API_URL}/api/createtask`, formattedTaskData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setSuccessMessage('Task created successfully');
      }

      setErrorMessage('');
      // Reset taskData after submission
      setTaskData({
        id: null,
        date: new Date(),
        customer: '',
        task: '',
        estimatedTime: '',
        startTime: null,
        endTime: null,
        taskStatus: '',
        reasonForIncomplete: '',
        remarks: '',
        employeeId: employeeId,
        employeeName: localStorage.getItem('employeeName')
      });

      // Clear selected report ID from local storage after submission
      localStorage.removeItem('selectedReport');

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
              <option value="">Select Task Status</option>
              <option value="completed">Completed</option>
              <option value="incomplete">Incomplete</option>
            </select>
          </div>

          <div style={{ flex: '0 0 48%', marginBottom: '15px' }}>
            <label>Reason for Incomplete</label>
            <input
              type="text"
              name="reasonForIncomplete"
              value={taskData.reasonForIncomplete}
              onChange={handleChange}
              placeholder="Enter reason for incomplete"
              style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #ccc' }}
            />
          </div>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Remarks</label>
          <textarea
            name="remarks"
            value={taskData.remarks}
            onChange={handleChange}
            placeholder="Enter remarks"
            style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #ccc' }}
          />
        </div>

        <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '5px' }}>
          {taskData.id ? 'Update Task' : 'Create Task'}
        </button>
      </form>
    </div>
  );
};

export default AddTask;
