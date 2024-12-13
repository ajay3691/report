import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import moment from "moment";

const EmployeeReportList = () => {
  const { employeeId, userType,designation } = useSelector((state) => state.login.userData);
  const [reportData, setReportData] = useState([]);
  const [fromDate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
  const [toDate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const [totalRecords, setTotalRecords] = useState(0);
  const [page, setPage] = useState(1);
  const [maxDisplayCount, setMaxDisplayCount] = useState(25);

  const tlid = localStorage.getItem("tlid");

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
        designation === "Sr Technical Lead"  
            ? `${process.env.REACT_APP_API_URL}/reportHistory_tl/${employeeId}`
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
    setPage(newPage);
  };

  const handleMaxDisplayCountChange = (e) => {
    setMaxDisplayCount(e.target.value);
    setPage(1);
  };

  const totalPages = Math.ceil(totalRecords / maxDisplayCount);
  const today = new Date().toISOString().split("T")[0];
  return (
    <div className="container mx-auto">
      <h2 className="text-2xl font-bold mb-4">Report List</h2>
      <div className="flex mb-4">
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

      {/* Admin View Table */}
      {designation === "Sr Technical Lead"  ? (       
         <div className="my-5">
          {reportData.length > 0 ? (
            <div className="overflow-auto" style={{ maxHeight: '430px' }}>
              <table className="min-w-full text-sm text-left text-gray-500 border border-gray-300">
                <thead className="text-xs text-gray-700 uppercase bg-slate-200 border-b border-gray-300 " style={{height: '55px'}}>
                  <tr>
                    <th className="border px-4 py-2" style={{ width: "50px" }}>S/No</th>
                    <th className="border px-4 py-2" style={{ width: "150px" }}>Date</th>
                    <th className="border px-4 py-2" style={{ width: "150px" }}>Employee Name</th>
                    <th className="border px-4 py-2" style={{ width: "150px" }}>Project Name</th>
                    <th className="border px-4 py-2" style={{ width: "150px" }}>Subcategory</th>
                    <th className="border px-4 py-2" style={{ width: "500px" }}>Report</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.map((employeeItem, index) => {
                    const reports = employeeItem.reportDetails || [];
                    const reportDate = moment(employeeItem.reportDate, "DD-MMM-YYYY").format("DD-MM-YYYY"); // Format the date

                    return (
                      <React.Fragment key={index}>
                        {reports.map((reportItem, reportIndex) => {
                          const subcategories = reportItem.subCategory || [];
                          
                          // Calculate the total rowSpan for the project name
                          const totalRowSpan = subcategories.length;

                          return (
                            <React.Fragment key={reportIndex}>
                              {subcategories.map((subCategoryItem, subCatIndex) => (
                                <tr key={subCatIndex} className="bg-white border-b hover:bg-gray-50">
                                  {/* Show S/No, Date, and Employee Name only for the first subcategory */}
                                  {subCatIndex === 0 && reportIndex === 0 && (
                                    <>
                                      <td className="border px-4 py-2" rowSpan={reports.reduce((acc, report) => acc + (report.subCategory?.length || 0), 0)}>
                                        {index + 1} {/* Serial Number */}
                                      </td>
                                      <td className="border px-4 py-2" rowSpan={reports.reduce((acc, report) => acc + (report.subCategory?.length || 0), 0)}>
                                        {reportDate} {/* Report Date */}
                                      </td>
                                      <td className="border px-4 py-2" rowSpan={reports.reduce((acc, report) => acc + (report.subCategory?.length || 0), 0)}>
                                        {employeeItem.name || "N/A"} {/* Accessing employee name here */}
                                      </td>
                                    </>
                                  )}

                                  {/* Project Name */}
                                  {subCatIndex === 0 && (
                      
                                      <td className="border px-4 py-2" rowSpan={totalRowSpan}>
                                        {reportItem.projectName || "N/A"} {/* Display Project Name for the first subcategory */}
                                      </td>
                                      )}
                                      <td className="border px-4 py-2">{subCategoryItem.subCategoryName || "N/A"}</td>
                                      <td className="border px-4 py-2">{subCategoryItem.report || "No report available."}</td>
                                    
                                
                                  
                                </tr>
                              ))}
                            </React.Fragment>
                          );
                        })}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500">No reports found for the selected date range.</p>
          )}
        </div>
      ) : (
        // Employee View Table
        <div className="my-5">
          {reportData.length > 0 ? (
            //<div className="overflow-auto max-h-80">
              <div className="overflow-auto" style={{ maxHeight: '430px' }}>
              <table className="min-w-full text-sm text-left text-gray-500 border border-gray-300">
                <thead className="text-xs text-gray-700 uppercase bg-slate-200 border-b border-gray-300" style={{ height: '50px', overflowY: 'hidden' }}>
                  <tr>
                    <th className="border px-4 py-2" style={{ width: "50px" }}>S/No</th>
                    <th className="border px-4 py-2" style={{ width: "150px" }}>Date</th>
                    <th className="border px-4 py-2" style={{ width: "150px" }}>Project Name</th>
                    <th className="border px-4 py-2" style={{ width: "150px" }}>Subcategory</th>
                    <th className="border px-4 py-2" style={{ width: "500px" }}>Report</th>
                  </tr>
                </thead>
                <tbody>
  {reportData.map((employeeItem, index) => {
    const reports = employeeItem.reportDetails || [];
    const reportDate = moment(employeeItem.reportDate, "DD-MMM-YYYY").format("DD-MM-YYYY"); // Format the date

    // Calculate the total number of subcategories for the current employee
    const totalSubcategories = reports.reduce((acc, report) => acc + (report.subCategory?.length || 0), 0);
    
    return (
      <React.Fragment key={index}>
        {reports.map((reportItem, reportIndex) => {
          const subcategories = reportItem.subCategory || [];

          return (
            <React.Fragment key={reportIndex}>
              {subcategories.map((subCategoryItem, subCatIndex) => (
                <tr key={subCatIndex} className="bg-white border-b hover:bg-gray-50">
                  {/* Show S/No, Date, and Employee Name only for the first subcategory */}
                  {subCatIndex === 0 && (
                    <>
                      <td className="border px-4 py-2" rowSpan={totalSubcategories}>
                        {index + 2} {/* Serial Number */}
                      </td>
                      <td className="border px-4 py-2" rowSpan={totalSubcategories}>
                        {reportDate} {/* Report Date */}
                      </td>
                      <td className="border px-4 py-2" rowSpan={totalSubcategories}>
                        {employeeItem.employeeName || "N/A"} {/* Employee Name */}
                      </td>
                    </>
                  )}
                  
                  {/* Check if the project name is the same as the previous one */}
                  <td className="border px-4 py-2">
                    {subCatIndex === 0 ? reportItem.projectName || "N/A" : ""}
                  </td>
                  <td className="border px-4 py-2">{subCategoryItem.subCategoryName || "N/A"}</td>
                  <td className="border px-4 py-2">{subCategoryItem.report || "No report available."}</td>
                </tr>
              ))}
            </React.Fragment>
          );
        })}
      </React.Fragment>
    );
  })}
</tbody>



              </table>
            </div>
          ) : (
            <p className="text-gray-500">No reports found for the selected date range.</p>
          )}
        </div>
      )}

      {/* Pagination */}
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
          onClick={() => handlePageChange(page < totalPages ? page + 1 : totalPages)}
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
