import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import moment from "moment"; // Using moment.js for easier date formatting

const EmployeeReportList = () => {
  const { employeeId, userType } = useSelector((state) => state.login.userData);
  const [reportData, setReportData] = useState([]);
  const [fromDate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
  const [toDate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const [totalRecords, setTotalRecords] = useState(0);
  const [page, setPage] = useState(1);
  const [maxDisplayCount, setMaxDisplayCount] = useState(5);

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        const payload = {
          domain: "Development",
          page: page.toString(),
          limit: maxDisplayCount,
          fromDate,
          toDate,
        };

        const apiEndpoint =
          userType === "Admin"
            ? `${process.env.REACT_APP_API_URL}/reportHistory_admin`
            : `${process.env.REACT_APP_API_URL}/reportHistory/${employeeId}`;

        const response = await axios.post(apiEndpoint, payload);
        const { status, data, totalRecords } = response.data;

        if (status === "Success") {
          setTotalRecords(totalRecords);
          setReportData(data || []); // Ensure data is an array
        } else {
          setReportData([]);
        }
      } catch (error) {
        console.error("Error occurred:", error);
        setReportData([]);
      }
    };

    if (fromDate && toDate) {
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
    setPage(1); // Reset to first page when changing display count
  };

  return (
    <div className="container mx-auto">
      <h2 className="text-2xl font-bold mb-4">Report List</h2>
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

      {/* Conditional Rendering for Admin and Employee Tables */}
      {userType === "Admin" ? (
        <div className="my-5">
          {reportData.length > 0 ? (
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
                {reportData.map((dateItem, dateIndex) => {
                  const reports = dateItem.reports || [];
                  let serialNo = 1;

                  return (
                    <React.Fragment key={dateIndex}>
                      {reports.map((reportItem) => {
                        const reportDate = moment(
                          dateItem.reportDate,
                          "DD-MMM-YYYY"
                        ).format("YYYY-MM-DD");
                        const employeeName = reportItem.name || "N/A";
                        const reportDetails = reportItem.reportDetails || [];

                        return reportDetails.map((detailItem, detailIndex) => {
                          const isFirstDetail = detailIndex === 0;
                          const subCategories = detailItem.subCategory;

                          return (
                            <tr
                              key={detailIndex}
                              className="bg-white border-b hover:bg-gray-50"
                            >
                              {isFirstDetail && (
                                <>
                                  <td
                                    className="px-6 py-4 border"
                                    rowSpan={reportDetails.length}
                                  >
                                    {serialNo++}
                                  </td>
                                  <td
                                    className="px-6 py-4 border"
                                    rowSpan={reportDetails.length}
                                  >
                                    {reportDate}
                                  </td>
                                  <td
                                    className="px-6 py-4 border"
                                    rowSpan={reportDetails.length}
                                  >
                                    {employeeName}
                                  </td>
                                </>
                              )}
                              <td className="px-6 py-4 border">
                                {detailItem.projectName || "N/A"}
                              </td>
                              <td className="px-6 py-4 border">
                                {subCategories.length > 0
                                  ? subCategories.map((subCat, subCatIndex) => (
                                      <div
                                        key={subCatIndex}
                                        className="border-b last:border-b-0"
                                      >
                                        {subCat.subCategoryName}
                                      </div>
                                    ))
                                  : "N/A"}
                              </td>
                              <td className="px-6 py-4 border">
                                {subCategories.length > 0
                                  ? subCategories.map((subCat, subCatIndex) => (
                                      <div
                                        key={subCatIndex}
                                        className="border-b last:border-b-0"
                                      >
                                        {subCat.report ||
                                          "No report available."}
                                      </div>
                                    ))
                                  : "No report available."}
                              </td>
                            </tr>
                          );
                        });
                      })}
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
      ) : (
        <div className="my-5">
          {reportData.length > 0 ? (
            <table className="min-w-full text-sm text-left text-gray-500 border border-gray-300">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-300">
                <tr>
                  <th className="border px-4 py-2">S/No</th>
                  <th className="border px-4 py-2">Date</th>
                  <th className="border px-4 py-2">Project Name</th>
                  <th className="border px-4 py-2">Subcategory</th>
                  <th className="border px-4 py-2">Report</th>
                </tr>
              </thead>
              <tbody>
                {reportData.map((employeeItem, index) => {
                  const reports = employeeItem.reportDetails || [];

                  return (
                    <React.Fragment key={index}>
                      {reports.map((reportItem, reportIndex) => {
                        const reportDate = moment(
                          employeeItem.reportDate,
                          "DD-MMM-YYYY"
                        ).format("YYYY-MM-DD");
                        const subCategories = reportItem.subCategory;

                        return (
                          <tr
                            key={reportIndex}
                            className="bg-white border-b hover:bg-gray-50"
                          >
                            {reportIndex === 0 && (
                              <>
                                <td
                                  className="px-6 py-4 border"
                                  rowSpan={reports.length}
                                >
                                  {index + 1}
                                </td>
                                <td
                                  className="px-6 py-4 border"
                                  rowSpan={reports.length}
                                >
                                  {reportDate}
                                </td>
                              </>
                            )}
                            <td className="px-6 py-4 border">
                              {reportItem.projectName || "N/A"}
                            </td>
                            <td className="px-6 py-4 border">
                              {subCategories.map((subCat, subCatIndex) => (
                                <div
                                  key={subCatIndex}
                                  className="border-b last:border-b-0"
                                >
                                  {subCat.subCategoryName}
                                </div>
                              ))}
                            </td>
                            <td className="px-6 py-4 border">
                              {subCategories.map((subCat, subCatIndex) => (
                                <div
                                  key={subCatIndex}
                                  className="border-b last:border-b-0"
                                >
                                  {subCat.report || "No report available."}
                                </div>
                              ))}
                            </td>
                          </tr>
                        );
                      })}
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
      )}

      {/* Pagination Controls */}
      <div className="flex justify-between items-center my-5">
        <div>
          <span>Total Records: {totalRecords}</span>
        </div>
        <div>
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            className={`px-4 py-2 text-white bg-black rounded-lg ${
              page === 1 ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Previous
          </button>
          <span className="mx-4">
            Page {page} of {Math.ceil(totalRecords / maxDisplayCount)}
          </span>
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page * maxDisplayCount >= totalRecords}
            className={`px-4 py-2 text-white bg-black rounded-lg ${
              page * maxDisplayCount >= totalRecords
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeReportList;
