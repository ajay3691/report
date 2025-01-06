import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

const EmployeeReportList = () => {
  const { userType } = useSelector((state) => state.login.userData);
  const [reportData, setReportData] = useState([]);
  const [fromDate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
  const [toDate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const [totalRecords, setTotalRecords] = useState(0);
  const [page, setPage] = useState(1);
  const [maxDisplayCount, setMaxDisplayCount] = useState(10);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");  // Track selected employee
  const navigate = useNavigate();
  const employeeId = localStorage.getItem("employeeId");

  useEffect(() => {
    // Fetching employee data if user is Admin
    if (userType === "Admin") {
      const fetchEmployeeData = async () => {
        try {
          const response = await axios.get(
            `${process.env.REACT_APP_API_URL}/api/employees`
          );
          if (response.data.status === "Success") {
            setEmployees(response.data.data);  // Set employee list
          } else {
            setEmployees([]);
          }
        } catch (error) {
          console.error("Error fetching employees:", error);
        }
      };
      fetchEmployeeData();
    }

    const fetchReportData = async () => {
      try {
        const payload = {
          page: page.toString(),
          limit: maxDisplayCount,
          fromDate,
          toDate,
          employeeId: selectedEmployee || employeeId, // Filter by selected employee
        };

        const apiEndpoint =
          userType === "Admin" ||
          userType === "developerAdmin" ||
          userType === "idcardAdmin"
            ? `${process.env.REACT_APP_API_URL}/api/reportHistory_admin`
            : `${process.env.REACT_APP_API_URL}/api/reportHistory/${employeeId}`;

        const response = await axios.post(apiEndpoint, payload);
        const { status, data, totalRecords } = response.data;

        if (status === "Success") {
          setTotalRecords(totalRecords);
          setReportData(data || []);
        } else {
          setReportData([]);
        }
      } catch (error) {
        console.error("Error occurred:", error);
        setReportData([]);
      }
    };

    if (fromDate && toDate && employeeId) {
      fetchReportData();
    }
  }, [fromDate, toDate, page, maxDisplayCount, employeeId, userType, selectedEmployee]);

  const handleDateChange = (e) => {
    if (e.target.name === "fromDate") {
      setFromDate(e.target.value);
    } else {
      setToDate(e.target.value);
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleMaxDisplayCountChange = (e) => {
    setMaxDisplayCount(e.target.value);
    setPage(1);
  };

  const handleEditClick = (report) => {
    localStorage.setItem("selectedReport", JSON.stringify(report.id));
    navigate("/dashboard/employeeTaskEdit");
  };
  const handleDelete = async (id) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/deleteTask/${id}`
      );
      if (response.data.status === "Success") {
        alert("Record deleted successfully");
        // Optionally, you could update the state or refresh the table
      } else {
        alert("Failed to delete record");
      }
    } catch (error) {
      console.error("Error deleting record:", error);
      alert("An error occurred while deleting the record");
    }
  };
  const totalPages = Math.ceil(totalRecords / maxDisplayCount);
  const today = new Date().toISOString().split("T")[0];

  const handleEmployeeChange = (e) => {
    setSelectedEmployee(e.target.value); // Update selected employee
    setPage(1); // Reset to page 1 when employee is selected
  };

  // Filter the report data by selected employee
  const filteredData = selectedEmployee
    ? reportData.filter(item => item.employeeName === selectedEmployee)
    : reportData;

  return (
    <div className="container mx-auto">
      <div date-rangepicker className="my-4 flex items-center">
        <div className="flex">
          <input
            type="date"
            name="fromDate"
            value={fromDate}
            onChange={handleDateChange}
            max={today}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 mr-2"
          />
          <input
            type="date"
            name="toDate"
            value={toDate}
            onChange={handleDateChange}
            max={today}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 mr-2"
          />
          {userType === "Admin" && (
  <div className="flex items-center">
    <label htmlFor="employee" className="mr-2 text-sm text-gray-700">
      Select Employee:
    </label>
    <select
      id="employee"
      value={selectedEmployee}
      onChange={handleEmployeeChange}
      className="w-64 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5"
    >
      <option value="">All Employees</option>
      {Array.from(new Set(reportData.map((employee) => employee.employeeName))).map((employeeName, index) => (
        <option key={index} value={employeeName}>
          {employeeName}
        </option>
      ))}
    </select>
  </div>
)}
        </div>
      </div>

      {filteredData.length > 0 ? (
        <div className="overflow-x-auto border border-gray-300">
          <div className="overflow-y-auto" style={{ maxHeight: "440px" }}>
          <table className="w-full text-sm text-left rtl:text-right text-gray-500" style={{ minWidth: "2000px" }}>
              <thead className="bg-slate-200 sticky top-0 z-10">
                <tr>
                  <th className="border px-4 py-2">S/No</th>
                  <th className="border px-4 py-2" style={{ width: "350px" }}>
                    Date
                  </th>
                  {(userType === "Admin" ||
                    userType === "developerAdmin" ||
                    userType === "idcardAdmin") && (
                    <th className="border px-4 py-2" style={{ width: "150px" }}>
                      Employee Name
                    </th>
                  )}
                  <th className="border px-4 py-2" style={{ width: "150px" }}>
                    Customer
                  </th>
                  <th className="border px-4 py-2" style={{ width: "1050px" }}>
                    Task
                  </th>
                  <th className="border px-4 py-2" style={{ width: "120px" }}>
                    Estimated Time
                  </th>
                  <th className="border px-4 py-2" style={{ width: "200px" }}>
                    Start Time
                  </th>
                  <th className="border px-4 py-2" style={{ width: "200px" }}>
                    End Time
                  </th>
                  <th className="border px-4 py-2" style={{ width: "100px" }}>
                    Status
                  </th>
                  <th className="border px-4 py-2" style={{ width: "750px" }}>
                    Reason for Incomplete
                  </th>
                  <th className="border px-4 py-2" style={{ width: "750px" }}>
                    Remarks
                  </th>
                  {userType === "employee" && (
                    <th className="border px-4 py-2">Edit</th>
                  )}
                  {userType === "employee" && (
                    <th className="border px-4 py-2">Delete</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item, index) => {
                  const reportDate = moment(item.date).format("DD-MM-YYYY");
                  const employeeName = item.employeeName || "N/A";
                  const isEditable = moment(item.date).isSameOrBefore(moment(), "day");


                  return (
                    <tr key={item.id} className="bg-white border-b hover:bg-gray-50">
                      <td className="border px-4 py-4">
                        {index + 1 + (page - 1) * maxDisplayCount}
                      </td>
                      <td className="border px-4 py-4">{reportDate}</td>
                      {(userType === "Admin" ||
                        userType === "developerAdmin" ||
                        userType === "idcardAdmin") && (
                        <td className="border px-4 py-4">{employeeName}</td>
                      )}
                      <td className="border px-4 py-4">{item.customer}</td>
                      <td className="border px-4 py-4">{item.task}</td>
                      <td className="border px-4 py-4">{item.estimatedTime}</td>
                      <td className="border px-4 py-4">{item.startTime}</td>
                      <td className="border px-4 py-4">{item.endTime}</td>
                      <td className="border px-4 py-4">{item.taskStatus}</td>
                      <td className="border px-4 py-4">{item.reasonForIncomplete}</td>
                      <td className="border px-4 py-4">{item.remarks}</td>
                      {userType === "employee" &&
                      moment(reportDate, "DD-MM-YYYY").isSame(
                        moment(),
                        "day"
                      ) && (
                        <td className="px-4 py-3">
                          <button
                            onClick={() => handleEditClick(item)}
                            className="text-blue-600 hover:underline"
                          >
                            <FontAwesomeIcon icon={faEdit} />
                          </button>
                        </td>
                      )}
                      {userType === "employee" && moment(reportDate, "DD-MM-YYYY").isSame(
                        moment(),
                        "day"
                      ) && (
                    <td className="px-4 py-3">
                    <button onClick={() => handleDelete(item.id)}>
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </td>
                    )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-4">No reports available.</div>
      )}

      {/* Pagination controls */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => handlePageChange(page > 1 ? page - 1 : 1)}
          disabled={page === 1}
          className="bg-blue-500 text-white px-4 py-2 rounded-md disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() =>
            handlePageChange(page < totalPages ? page + 1 : totalPages)
          }
          disabled={page === totalPages}
          className="bg-blue-500 text-white px-4 py-2 rounded-md disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default EmployeeReportList;
