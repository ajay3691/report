import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PunchLogTable = () => {
    const [data, setData] = useState([]); // State for the data
    const [employeeList, setEmployeeList] = useState([]); // State for employee list
    const [selectedEmployeeId, setSelectedEmployeeId] = useState(''); // Selected employee
    const [filteredData, setFilteredData] = useState([]); // State for filtered data
    // const [fromDate, setFromDate] = useState('');
    // const [toDate, setToDate] = useState('');
    const [fromDate, setFromDate] = useState(new Date().toISOString().split('T')[0]);  // Default to current date
    const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0]);  // Default to current date

    const [employeeId, setEmployeeId] = useState(''); // '' means "All Employees"
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [punchType, setPunchType] = useState(''); // 'In' or 'Out'

    // Fetch data from the API
    const payload = {
        from_date: fromDate,  // Make sure this is the correct date format (YYYY-MM-DD)
        to_date: toDate       // Same for the toDate
    };

    useEffect(() => {
        const fetchFilteredData = async () => {
            setLoading(true);
            try {
                const response = await axios.post(
                    `${process.env.REACT_APP_API_URL}/dailypunch`, 
                    payload // Pass the payload as the second argument
                );
                setData(response.data); // Assuming the response contains the filtered data
                setFilteredData(response.data); // Set the filtered data
                setError(null);
            } catch (err) {
                setError('Error fetching data. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchFilteredData();
    }, [fromDate, toDate]);  // Trigger when fromDate or toDate changes


    // Fetch Employee List
    useEffect(() => {
        const fetchEmployeeList = async () => {
            try {
                const response = await axios.post(`${process.env.REACT_APP_API_URL}/employee_list/`);
                if (response.data.status === 'Success') {
                    setEmployeeList(response.data.data);
                }
            } catch (err) {
                console.error('Error fetching employee list:', err);
            }
        };
        fetchEmployeeList();
    }, []);


    // Filter data based on date range, employee ID, and punch type
    /* useEffect(() => {
        let filtered = data;
    
        // Convert fromDate and toDate to Date objects if they are not empty
        if (fromDate) {
            const fromDateObj = new Date(fromDate);
            fromDateObj.setHours(0, 0, 0, 0); // Set to start of the day (midnight)
            filtered = filtered.filter((item) => {
                const itemDate = new Date(item.logTime);
                itemDate.setHours(0, 0, 0, 0); // Normalize logTime to midnight
                return itemDate >= fromDateObj;
            });
        }
        if (toDate) {
            const toDateObj = new Date(toDate);
            toDateObj.setHours(23, 59, 59, 999); // Set to end of the day (one millisecond before midnight)
            filtered = filtered.filter((item) => {
                const itemDate = new Date(item.logTime);
                itemDate.setHours(23, 59, 59, 999); // Normalize logTime to end of day
                return itemDate <= toDateObj;
            });
        }
        if (selectedEmployeeId) {
            filtered = filtered.filter((item) => item.employeeId === selectedEmployeeId);
        }
        if (punchType) {
            filtered = filtered.filter((item) => item.logType === punchType);
        }
    
        setFilteredData(filtered);
    }, [fromDate, toDate, selectedEmployeeId, data, punchType]);
     */
    useEffect(() => {
        let filtered = data;
    
        // Convert fromDate and toDate to Date objects if they are not empty
        if (fromDate) {
            const fromDateObj = new Date(fromDate);
            fromDateObj.setHours(0, 0, 0, 0); // Set to start of the day (midnight)
            filtered = filtered.filter((item) => {
                const itemDate = new Date(item.logTime);
                itemDate.setHours(0, 0, 0, 0); // Normalize logTime to midnight
                return itemDate >= fromDateObj;
            });
        }
        if (toDate) {
            const toDateObj = new Date(toDate);
            toDateObj.setHours(23, 59, 59, 999); // Set to end of the day (one millisecond before midnight)
            filtered = filtered.filter((item) => {
                const itemDate = new Date(item.logTime);
                itemDate.setHours(23, 59, 59, 999); // Normalize logTime to end of day
                return itemDate <= toDateObj;
            });
        }
        if (selectedEmployeeId) {
            filtered = filtered.filter((item) => item.employeeId === selectedEmployeeId);
        }
        if (punchType) {
            filtered = filtered.filter((item) => item.logType === punchType);
        }
    
        // Sort filtered data by logTime, most recent first
        filtered = filtered.sort((a, b) => new Date(b.logTime) - new Date(a.logTime));
    
        setFilteredData(filtered);
    }, [fromDate, toDate, selectedEmployeeId, data, punchType]);
    
    const styles = {
        container: {
            padding: '20px',
        },
        heading: {
            textAlign: 'center',
            marginBottom: '20px',
        },
        punchType: {
            In: {
                color: 'green',
                fontWeight: 'bold',
            },
            Out: {
                color: 'red',
                fontWeight: 'bold',
            },
        },
        row: {
            display: 'flex',
            gap: '20px',
            marginBottom: '20px',
            flexWrap: 'wrap',
        },
        column: {
            flex: '1',
            minWidth: '200px',
        },
        label: {
            display: 'block',
            marginBottom: '8px',
            fontWeight: 'bold',
        },
        input: {
            width: '100%',
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            boxSizing: 'border-box',
        },
        button: {
            width: '100%',
            padding: '10px',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
        },
        buttonDisabled: {
            backgroundColor: '#6c757d',
        },
        table: {
            width: '100%',
            borderCollapse: 'collapse',
            maxHeight: '400px',
            overflowY: 'auto',
            display: 'block',
        },
        th: {
            backgroundColor: '#343a40',
            color: '#fff',
            padding: '10px',
            textAlign: 'left',
            border: '1px solid #ddd',
        },
        td: {
            padding: '10px',
            border: '1px solid #ddd',
        },
        noRecords: {
            textAlign: 'center',
            padding: '20px',
        },
        device: {
            color: 'blue',
            fontWeight: 'bold',
        },
        device1: {
            color: 'red',
            fontWeight: 'bold',
        },
        device2: {
            color: 'orange',
            fontWeight: 'bold',
        },
    };

    const groupedData = filteredData.reduce((acc, item) => {
        // Group by employeeId and date
        const date = new Date(item.logTime).toLocaleDateString();
        const key = `${item.employeeId}-${date}`;
        
        if (!acc[key]) {
            acc[key] = {
                employeeId: item.employeeId,
                employeeName: employeeList.find(emp => emp.employeeId === item.employeeId)?.employeeName || item.employeeId,
                place: item.place1,
                date: date,
                punchIn: null,
                punchOut: null,
                device: item.device
            };
        }
        
        // Store Punch IN and Punch OUT separately
        if (item.logType === 'In') {
            acc[key].punchIn = new Date(item.logTime).toLocaleTimeString();
        } else if (item.logType === 'Out') {
            acc[key].punchOut = new Date(item.logTime).toLocaleTimeString();
        }
    
        return acc;
    }, {});
    
    // Convert grouped data back into an array
    const groupedDataArray = Object.values(groupedData);
    
    
    return (
        <div style={styles.container}>
           {/*  <h2 style={styles.heading}>Punch Log Table</h2> */}

            {/* Filters */}
            <div style={styles.row}>
                <div style={styles.column}>
                    <label style={styles.label}>From Date:</label>
                    <input
                       type="date"
                       style={styles.input}
                       value={fromDate}
                       onChange={(e) => setFromDate(e.target.value)}
                   />
                </div>
                <div style={styles.column}>
                    <label style={styles.label}>To Date:</label>
                    <input
                        type="date"
                        style={styles.input}
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                    />
                </div>
                <div style={styles.column}>
                    <label style={styles.label}>Employee Name:</label>
                    <select
                        style={styles.input}
                        value={selectedEmployeeId}
                        onChange={(e) => setSelectedEmployeeId(e.target.value)}
                    >
                        <option value="">All</option>
                        {employeeList.map((emp) => (
                            <option key={emp.employeeId} value={emp.employeeId}>
                                {emp.employeeName}
                            </option>
                        ))}
                    </select>
                </div>
                <div style={styles.column}>
                    <label style={styles.label}>Punch Type:</label>
                    <select
                        style={styles.input}
                        value={punchType}
                        onChange={(e) => setPunchType(e.target.value)}
                    >
                        <option value="">All</option>
                        <option value="In">In Punches</option>
                        <option value="Out">Out Punches</option>
                    </select>
                </div>
            </div>

            {/* Table */}
        {loading ? (
            <div style={styles.noRecords}>Loading...</div>
        ) : error ? (
            <div style={styles.noRecords}>{error}</div>
        ) : (
            <div style={{ maxHeight: '600px', overflowY: 'auto' }}> {/* Wrapper div for scrollable body */}
                 <table style={styles.table}>
        <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
            <tr>
                <th style={styles.th}>Employee Name</th>
                <th style={styles.th}>Place</th>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Punch Time In</th>
                <th style={styles.th}>Punch Time Out</th>
                {/* <th style={styles.th}>Track Time</th>
                <th style={styles.th}>Punch IN</th>
                <th style={styles.th}>Punch OUT</th> */}
                <th style={styles.th}>Device</th>
            </tr>
        </thead>
        <tbody>
            {groupedDataArray.length > 0 ? (
                groupedDataArray.map((item, index) => (
                    <tr key={index}>
                        <td style={{ ...styles.td, ...styles.device }}>
                            {item.employeeName}
                        </td>
                        <td style={styles.td}>{item.place}</td>
                        <td style={{ ...styles.td, ...styles.device }}>
                            {item.date}
                        </td>
                        <td style={{ ...styles.td, ...styles.device2 }}>
                            {item.punchIn || ''}
                        </td>
                        <td style={{ ...styles.td, ...styles.device2 }}>
                            {item.punchOut || ''}
                        </td>
                        {/* <td style={{ ...styles.td, ...styles.device2 }}>
                            {item.punchOut || ''}
                        </td>
                        <td style={{ ...styles.td, ...styles.punchType['In'] }}>
                            {item.punchIn ? 'IN' : ''}
                        </td>
                        <td style={{ ...styles.td, ...styles.punchType['Out'] }}>
                            {item.punchOut ? 'OUT' : ''}
                        </td> */}
                        <td style={{ ...styles.td, ...styles.device }}>
                            {item.device}
                        </td>
                    </tr>
                ))
            ) : (
                <tr>
                    <td colSpan="8" style={styles.noRecords}>
                        No records found.
                    </td>
                </tr>
            )}
        </tbody>
    </table>
            </div>
        )}

        </div>
    );
};

export default PunchLogTable;
