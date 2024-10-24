import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const EmployeeReportList = () => {
  const { userType } = useSelector((state) => state.login.userData);
  const [reportData, setReportData] = useState([]);
  const [fromDate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
  const [toDate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const [totalRecords, setTotalRecords] = useState(0);
  const [page, setPage] = useState(1);
  const [maxDisplayCount, setMaxDisplayCount] = useState(25);
  const navigate = useNavigate(); // Initialize useNavigate

  const employeeId = localStorage.getItem("employeeId");

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        const payload = {
          page: page.toString(),
          limit: maxDisplayCount,
          fromDate,
          toDate,
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
  }, [fromDate, toDate, page, maxDisplayCount, employeeId, userType]);

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
    // Save the report data to local storage
    localStorage.setItem("selectedReport", JSON.stringify(report.id));

    // Navigate to the edit page with the report details
    navigate("/dashboard/employeeTaskEdit");
  };

  const totalPages = Math.ceil(totalRecords / maxDisplayCount);

  return (
    <div className="container mx-auto">
      <h2 className="text-2xl font-bold mb-4">Report List</h2>
      {/* <pre>{JSON.stringify(reportData, null, 2)}</pre> */}
      <div className="flex mb-4">
        <input
          type="date"
          name="fromDate"
          value={fromDate}
          onChange={handleDateChange}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 mr-2"
        />
        <input
          type="date"
          name="toDate"
          value={toDate}
          onChange={handleDateChange}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 mr-2"
        />
        <select
          value={maxDisplayCount}
          onChange={handleMaxDisplayCountChange}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5"
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
        </select>
      </div>

      {/* Table Wrapper for Scrollbars */}
      <div className="overflow-x-auto max-h-99 border border-gray-300">
        <div className="overflow-y-auto max-h-99">
          {" "}
          {/* Limit height for vertical scroll */}
          <table
            className="min-w-full text-sm text-left text-gray-500"
            style={{ minWidth: "2000px" }}
          >
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
              </tr>
            </thead>
            <tbody>
              {reportData.map((item, index) => {
                const reportDate = moment(item.date).format("DD-MM-YYYY");
                const employeeName = item.employeeName || "N/A";
                const isEditable = moment(item.date).isSameOrBefore(
                  moment(),
                  "day"
                ); // Check if the date is today or earlier

                return (
                  <tr
                    key={item.id}
                    className="bg-white border-b hover:bg-gray-50"
                  >
                    <td className="border px-4 py-4">
                      {index + 1 + (page - 1) * maxDisplayCount}
                    </td>
                    <td className="border px-4 py-4" style={{ width: "350px" }}>
                      {reportDate}
                    </td>
                    {(userType === "Admin" ||
                      userType === "developerAdmin" ||
                      userType === "idcardAdmin") && (
                      <td
                        className="border px-4 py-4"
                        style={{ width: "250px" }}
                      >
                        {employeeName}
                      </td>
                    )}
                    <td className="border px-4 py-4" style={{ width: "250px" }}>
                      {item.customer || "N/A"}
                    </td>
                    <td
                      className="border px-4 py-4"
                      style={{ width: "1350px" }}
                    >
                      {item.task || "N/A"}
                    </td>
                    <td className="border px-4 py-4" style={{ width: "120px" }}>
                      {item.estimatedTime || "N/A"}
                    </td>
                    <td className="border px-4 py-4" style={{ width: "120px" }}>
                      {item.startTime || "N/A"}
                    </td>
                    <td className="border px-4 py-4" style={{ width: "120px" }}>
                      {item.endTime || "N/A"}
                    </td>
                    <td className="border px-4 py-4" style={{ width: "100px" }}>
                      {item.taskStatus || "N/A"}
                    </td>
                    <td className="border px-4 py-4" style={{ width: "850px" }}>
                      {item.reasonForIncomplete || "N/A"}
                    </td>
                    <td className="border px-4 py-4" style={{ width: "850px" }}>
                      {item.remarks || "N/A"}
                    </td>
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
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-between items-center mt-4">
        <p className="text-gray-500">
          Page {page} of {totalPages}
        </p>
        <p className="text-gray-500">Total Records: {totalRecords}</p>
        <div className="flex items-center">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md mr-2"
          >
            Previous
          </button>
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeReportList;
