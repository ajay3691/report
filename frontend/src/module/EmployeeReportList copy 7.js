import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import moment from "moment";

const EmployeeReportList = () => {
  const { employeeId, userType } = useSelector((state) => state.login.userData);
  const [reportData, setReportData] = useState([]);
  const [fromDate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
  const [toDate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const [totalRecords, setTotalRecords] = useState(0);
  const [page, setPage] = useState(1);
  const [maxDisplayCount, setMaxDisplayCount] = useState(25);
  const [employees, setEmployees] = useState([]); // State to store unique employee names
  const [selectedEmployee, setSelectedEmployee] = useState(employeeId); // Default to employeeId from redux

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
        if(userType === "Admin" ){
          if (data && Array.isArray(data)) {
            const employeeNames = [
              ...new Set(data.flatMap((report) => report.reports.map((employeeReport) => employeeReport.name))),
            ];
            setEmployees(["All", ...employeeNames]); // Add "All" option at the beginning
          }
        }
        
        
      } catch (error) {
        console.error("Error occurred:", error);
        setReportData([]);
      }
    };
    if (fromDate && toDate) {
      fetchReportData();
    }
  }, [fromDate, toDate, page, maxDisplayCount, employeeId, userType,selectedEmployee]);

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
  const handleEmployeeChange = (e) => {
    setSelectedEmployee(e.target.value);
  };
  const handleMaxDisplayCountChange = (e) => {
    setMaxDisplayCount(e.target.value);
    setPage(1);
  };
  const totalPages = Math.ceil(totalRecords / maxDisplayCount);
  const today = new Date().toISOString().split("T")[0]; // Get today's date in "YYYY-MM-DD" format
  return (
    <div className="container mx-auto">
      <div date-rangepicker className="my-4 flex items-center space-x-4">
          <div className="flex space-x-2">
            <input
              type="date"
              name="fromDate"
              value={fromDate}
              onChange={handleDateChange}
              max={today}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
            />
            <input
              type="date"
              name="toDate"
              value={toDate}
              onChange={handleDateChange}
              max={today}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
            />
          </div>
          
          {userType === "Admin" && (
          <div className="flex items-center">
            <label htmlFor="employee" className="mr-2 text-sm text-gray-700">
              Select Employee:
            </label>
            <select
              id="employee"
              value={selectedEmployee}
              onChange={handleEmployeeChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
            >
              {employees.map((employeeName, index) => (
                <option key={index} value={employeeName}>
                  {employeeName}
                </option>
              ))}
            </select>
          </div>
        )}
        </div>

      {userType === "Admin" || userType === "developerAdmin" ? (       
         <div className="my-5">
          {reportData.length > 0 ? (
           <div className="overflow-auto" style={{ maxHeight: '470px' }}>
          <table className="min-w-full text-sm text-left text-gray-500 border border-gray-300">
            <thead className="text-xs text-gray-700 uppercase bg-slate-200 border-b border-gray-300 "
              style={{ position: 'sticky', top: 0, zIndex: 1, height: '55px' }}
              >
              <tr>
                <th className="border px-4 py-2" style={{ width: "50px" }}>S/No</th>
                <th className="border px-4 py-2" style={{ width: "180px" }}>Date</th>
                <th className="border px-4 py-2" style={{ width: "150px" }}>Employee Name</th>
                <th className="border px-4 py-2" style={{ width: "150px" }}>Project Name</th>
                <th className="border px-4 py-2" style={{ width: "150px" }}>Subcategory</th>
                <th className="border px-4 py-2" style={{ width: "500px" }}>Report</th>
              </tr>
            </thead>
            <tbody>
            {(() => {
              let serialNo = (page - 1) * maxDisplayCount + 1;

              return reportData.map((dateItem, dateIndex) => {
                const reports = dateItem.reports || [];

                return (
                  <React.Fragment key={dateIndex}>
                    {reports
                      .filter((reportItem) => selectedEmployee === "All" || reportItem.name === selectedEmployee) // Filter by selected employee
                      .map((reportItem) => {
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
                                      {serialNo++} {/* Increment serial number here */}
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
              });
            })()}

            </tbody>
          </table>
            </div>
          ) : (
            <p className="text-gray-500">No reports found for the selected date range.</p>
          )}
        </div>
      ) : (
        <div className="my-5">
          {reportData.length > 0 ? (
              <div className="overflow-auto" style={{ maxHeight: '430px' }}>
              <table className="min-w-full text-sm text-left text-gray-500 border border-gray-300">
                <thead className="text-xs text-gray-700 uppercase bg-slate-200 border-b border-gray-300" style={{ height: '50px', overflowY: 'hidden' }}>
                  <tr>
                    <th className="border px-4 py-2" style={{ width: "50px" }}>S/No</th>
                    <th className="border px-4 py-2" style={{ width: "180px" }}>Date</th>
                    <th className="border px-4 py-2" style={{ width: "150px" }}>Project Name</th>
                    <th className="border px-4 py-2" style={{ width: "150px" }}>Subcategory</th>
                    <th className="border px-4 py-2" style={{ width: "500px" }}>Report</th>
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    let serialNo = 1; 
                    return reportData.map((dateItem, dateIndex) => {
                      const reportDate = moment(dateItem.reportDate, "DD-MMM-YYYY").format("DD-MM-YYYY"); // Formatting the date
                      const reportDetails = dateItem.reportDetails || [];
                      return (
                        <React.Fragment key={dateIndex}>
                          {reportDetails.map((detailItem, detailIndex) => {
                            const subcategories = detailItem.subCategory || [];
                            return subcategories.map((subCategoryItem, subCatIndex) => (
                              <tr key={subCatIndex} className="bg-white border-b hover:bg-gray-50">
                                {subCatIndex === 0 && detailIndex === 0 && (
                                  <>
                                    <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
                                      {serialNo++}
                                    </td>
                                    <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
                                      {reportDate}
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
                            ));
                          })}
                        </React.Fragment>
                      );
                    });
                  })()}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500">No reports found for the selected date range.</p>
          )}
        </div>
      )}
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
