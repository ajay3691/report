import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import moment from "moment";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import './employeelist.css'; // Importing the CSS file for styles

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
          setReportData(data || []);
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
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const handleMaxDisplayCountChange = (e) => {
    setMaxDisplayCount(e.target.value);
    setPage(1);
  };

  const totalPages = Math.ceil(totalRecords / maxDisplayCount);

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

      {reportData.length > 0 ? (
        <div className="my-5">
          <div className="overflow-auto" style={{ maxHeight: '430px' }}>
            <table className="min-w-full text-sm text-left text-gray-500 border border-gray-300">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-300 sticky top-0" style={{ height: '50px', overflowY: 'hidden' }}>
                <tr>
                  <th className="border px-4 py-2" style={{ width: "50px" }}>S/No</th>
                  <th className="border px-4 py-2" style={{ width: "150px" }}>Date</th>
                  {userType === "Admin" && (
                    <>
                      <th className="border px-4 py-2" style={{ width: "150px" }}>Employee Name</th>
                      <th className="border px-4 py-2" style={{ width: "150px" }}>Project Name</th>
                      <th className="border px-4 py-2" style={{ width: "150px" }}>Subcategory</th>
                    </>
                  )}
                  <th className="border px-4 py-2" style={{ width: "500px" }}>Report</th>
                </tr>
              </thead>
              <tbody>
                {reportData.map((dateItem, dateIndex) => {
                  const reports = dateItem.reports || [];
                  let serialNo = 1;

                  return (
                    <React.Fragment key={dateIndex}>
                      {reports.map((reportItem) => {
                        const reportDate = moment(dateItem.reportDate, "DD-MMM-YYYY").format("DD-MM-YYYY");
                        const employeeName = reportItem.name || "N/A";
                        const reportDetails = reportItem.reportDetails || [];

                        return reportDetails.map((detailItem, detailIndex) => {
                          const subcategories = detailItem.subCategory || [];

                          return (
                            <React.Fragment key={detailIndex}>
                              {subcategories.map((subCategoryItem, subCatIndex) => (
                                <tr key={subCatIndex} className="bg-white border-b hover:bg-gray-50">
                                  {subCatIndex === 0 && detailIndex === 0 && (
                                    <>
                                      <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
                                        {serialNo++}
                                      </td>
                                      <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
                                        {reportDate}
                                      </td>
                                      <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
                                        {employeeName}
                                      </td>
                                    </>
                                  )}
                                  {subCatIndex === 0 && (
                                    <td className="border px-6 py-4" rowSpan={subcategories.length}>
                                      {detailItem.projectName || "N/A"}
                                    </td>
                                  )}
                                  <td className="border px-6 py-4">{subCategoryItem.subCategoryName || "N/A"}</td>
                                  <td className="border px-6 py-4">{subCategoryItem.report || "No report available."}</td>
                                </tr>
                              ))}
                            </React.Fragment>
                          );
                        });
                      })}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className="flex items-center bg-indigo-500 text-white px-4 py-1 rounded-lg"
            >
              <FontAwesomeIcon icon={faChevronLeft} className="mr-1" />
              <span className="hidden sm:inline">Previous</span>
            </button>
            <div className="flex items-center space-x-2">
              <span className="text-sm">Page {page} of {totalPages}</span>
            </div>
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
              className="flex items-center bg-indigo-500 text-dark px-4 py-1 rounded-lg"
            >
              <span className="hidden sm:inline">Next</span>
              <FontAwesomeIcon icon={faChevronRight} className="ml-1" />
            </button>
          </div>
        </div>
      ) : (
        <p className="text-gray-500">No reports found for the selected date range.</p>
      )}
    </div>
  );
};

export default EmployeeReportList;
