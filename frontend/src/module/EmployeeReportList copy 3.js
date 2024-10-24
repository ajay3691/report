import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import moment from "moment"; // Using moment.js for easier date formatting

const EmployeeReportList = () => {
  const { employeeId, userType } = useSelector((state) => state.login.userData);
  const [employeeReportList, setEmployeeReportList] = useState([]);
  const [fromDate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
  const [toDate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const [totalRecord, setTotalRecord] = useState(0);
  const [page, setPage] = useState(1);
  const [maxDisplayCount, setMaxDisplayCount] = useState(5);

  useEffect(() => {
    const fetchEmployeeReportList = async () => {
      try {
        const payload = {
          domain: "Development",
          page: page.toString(),
          limit: maxDisplayCount,
          fromDate,
          toDate,
        };

        // Use different API endpoints based on user type
        const apiEndpoint =
          userType === "Admin"
            ? `${process.env.REACT_APP_API_URL}/reportHistory_admin`
            : `${process.env.REACT_APP_API_URL}/reportHistory/${employeeId}`;

        const response = await axios.post(apiEndpoint, payload);

        console.log("API Response:", response.data); 
        const { status, data, totalRecords } = response.data;
        if (status === "Success") {
          setTotalRecord(totalRecords);
          setEmployeeReportList(data || []); 
        } else {
          setEmployeeReportList([]);
        }
      } catch (error) {
        console.error("Error occurred:", error);
        setEmployeeReportList([]);
      }
    };

    if (fromDate && toDate) {
      fetchEmployeeReportList();
    }
  }, [fromDate, toDate, page, maxDisplayCount, employeeId, userType]);

  // Handle date change
  const handleDateChange = (e) => {
    if (e.target.name === "fromDate") {
      setFromDate(e.target.value);
    } else {
      setToDate(e.target.value);
    }
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  // Handle max display count change
  const handleMaxDisplayCountChange = (e) => {
    setMaxDisplayCount(e.target.value);
    setPage(1); // Reset to first page when changing display count
  };

  return (
    <div className="container mx-auto">
      <h2 className="text-2xl font-bold mb-4">Employee Report List</h2>
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

      <div className="my-5">
        {employeeReportList.length > 0 ? (
          <table className="min-w-full text-sm text-left text-gray-500 border border-gray-300">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-300">
              <tr>
                <th className="border px-4 py-2">S/No</th>
                <th className="border px-4 py-2">Date</th>
                <th className="border px-4 py-2">Employee Name</th>
                <th className="border px-4 py-2">Project Name</th>
                <th className="border px-4 py-2">Subcategory</th>
                <th className="border px-4 py-2">Report</th>
              </tr>
            </thead>
            <tbody>
              {employeeReportList.map((dateItem, dateIndex) => {
                let serialNo = dateIndex + 1; // Initialize serial number at the top level
                return (
                  <React.Fragment key={dateIndex}>
                    {dateItem.reports.map((reportItem, reportIndex) => (
                      <React.Fragment key={reportIndex}>
                        <tr className="bg-white border-b hover:bg-gray-50">
                          <td
                            className="px-6 py-4"
                            rowSpan={reportItem.reportDetails.reduce(
                              (acc, detail) => acc + detail.subCategory.length,
                              1
                            )}
                          >
                            {serialNo++} {/* Increment serial number */}
                          </td>
                          <td
                            className="px-6 py-4"
                            rowSpan={reportItem.reportDetails.reduce(
                              (acc, detail) => acc + detail.subCategory.length,
                              1
                            )}
                          >
                            {moment(reportItem.reportDate).format(
                              "YYYY-MM-DD"
                            ) || "N/A"}
                          </td>
                          <td
                            className="px-6 py-4"
                            rowSpan={reportItem.reportDetails.reduce(
                              (acc, detail) => acc + detail.subCategory.length,
                              1
                            )}
                          >
                            {reportItem.name || "N/A"}
                          </td>
                          <td
                            className="px-6 py-4"
                            rowSpan={reportItem.reportDetails.reduce(
                              (acc, detail) => acc + detail.subCategory.length,
                              1
                            )}
                          >
                            {reportItem.reportDetails[0]?.projectName || "N/A"}
                          </td>
                        </tr>

                        {/* Display Subcategories and Reports */}
                        {reportItem.reportDetails.map((detail) =>
                          detail.subCategory.map((subCat, subCatIndex) => (
                            <tr
                              key={subCatIndex}
                              className="bg-white border-b hover:bg-gray-50"
                            >
                              <td className="px-6 py-4">
                                {subCat.subCategoryName || "N/A"}
                              </td>
                              <td className="px-6 py-4">
                                {subCat.report || "No report available."}
                              </td>
                            </tr>
                          ))
                        )}
                      </React.Fragment>
                    ))}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500">
            No reports found for the selected date range.
          </p>
        )}
      </div>

      {/* Pagination and Total Records Display */}
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            className="bg-gray-800 text-white text-sm px-3 py-1 rounded disabled:opacity-50 mr-2"
          >
            Previous
          </button>
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={totalRecord <= page * maxDisplayCount}
            className="bg-gray-800 text-white text-sm px-3 py-1 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
        <p className="text-sm text-gray-600">
          Total Records: {totalRecord} | Page {page}
        </p>
      </div>
    </div>
  );
};

export default EmployeeReportList;
