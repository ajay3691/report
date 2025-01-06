import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import moment from "moment";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";

const EmployeeReportList = () => {
  const { employeeId, designation } = useSelector((state) => state.login.userData);
  const [reportData, setReportData] = useState([]);
  const [fromDate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
  const [toDate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const [totalRecords, setTotalRecords] = useState(0);
  const [page, setPage] = useState(1);
  const [maxDisplayCount, setMaxDisplayCount] = useState(25);
  const navigate = useNavigate();

  const [employees, setEmployees] = useState([]); // State to store unique employee names
  const [selectedEmployee, setSelectedEmployee] = useState("All"); // Set default to "All"
  const [reviewData, setReviewData] = useState(null);
  const [reviewText, setReviewText] = useState("");

  const handleReviewClick = (id) => {
    const updatedReview = prompt("Enter the updated review:");
  
      const payload = {
        review: updatedReview  
      };
  
      console.log("Sending Payload:", payload);  
  
      axios.post(`${process.env.REACT_APP_API_URL}/updateReview/${id}`, payload)
        .then(response => {
          console.log(response.data.message); 
        })
        .catch(error => {
          console.error("Error updating the review:", error.response ? error.response.data : error);
        });
  
  };
  
  
  
  const handleReviewUpdate = async () => {
    if (!reviewText.trim()) return;

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/updateReview`, {
        method: "POST",
        body: JSON.stringify({ id: reviewData.reportId, review: reviewText }),
      });

      const result = await response.json();
      if (result.status === "Success") {
        alert("Review updated successfully!");
        setReviewData(null);
      } else {
        alert("Error updating review");
      }
    } catch (error) {
      console.error("Error updating review:", error);
      alert("Error updating review");
    }
  };

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

        if(designation === "Sr Technical Lead" ){
          if (data && Array.isArray(data)) {
            const employeeNames = [
              ...new Set(data.flatMap((report) => report.reports.map((employeeReport) => employeeReport.name))),
            ];
            setEmployees(["All", ...employeeNames]); 
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
  }, [fromDate, toDate, page, maxDisplayCount, employeeId, designation]);

  const handleDateChange = (e) => {
    if (e.target.name === "fromDate") {
      setFromDate(e.target.value);
    } else {
      setToDate(e.target.value);
    }
  };

  const handleEmployeeChange = (e) => {
    setSelectedEmployee(e.target.value);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleMaxDisplayCountChange = (e) => {
    setMaxDisplayCount(e.target.value);
    setPage(1);
  };

  const totalPages = Math.ceil(totalRecords / maxDisplayCount);
  const today = new Date().toISOString().split("T")[0]; // Get today's date in "YYYY-MM-DD" format

  const handleDelete = async (id) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/deleteReport/${id}`
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
  const handleEdit = (id) => {
    localStorage.setItem("selectedIdCardId", id);
    navigate(`/dashboard/idCardReportEdit`, { state: { recordId: id } });
  };
  return (
    <div className="container mx-auto">
    <div date-rangepicker className="my-4 flex flex-col sm:flex-row items-center">
      <div className="flex flex-col sm:flex-row">
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
         {designation === "Sr Technical Lead" && (
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
      <option value="">Select Employee</option>
      {employees.map((employeeName, index) => (
        <option key={index} value={employeeName}>
          {employeeName}
        </option>
      ))}
    </select>
  </div>
)}

        </div>
      </div>

      {/* Admin View Table */}
      {designation === "Sr Technical Lead" || designation === "developerAdmin" ? (       
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
                <th className="border px-4 py-2" style={{ width: "50px" }}>Review</th>
              </tr>
            </thead>
            <tbody>
            {(() => {
  // Calculate the starting serial number based on the current page and maxDisplayCount
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
            const id = reportItem.id || "N/A";
            const reportDetails = reportItem.reportDetails || [];
  
            return reportDetails.map((detailItem, detailIndex) => {
              const subcategories = detailItem.subCategory || [];
  
            return (
              <React.Fragment key={detailIndex}>
                {subcategories.map((subCategoryItem, subCatIndex) => (
                  <tr key={subCatIndex} className="bg-white border-b hover:bg-gray-50">
                    {subCatIndex === 0 && detailIndex === 0 && (
                      <>
                        {/* Serial Number */}
                        <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
                          {serialNo++} {/* Increment serial number here */}
                        </td>
                        {/* Report Date */}
                        <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
                          {reportDate}
                        </td>
                        {/* Employee Name */}
                        <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
                          {employeeName}
                        </td>
                      </>
                    )}
                    {/* Project Name */}
                    {subCatIndex === 0 && (
                      <td className="border px-6 py-4" rowSpan={subcategories.length}>
                        {detailItem.projectName || "N/A"}
                      </td>
                    )}
                    {/* Subcategory */}
                    <td className="border px-6 py-4">{subCategoryItem.subCategoryName || "N/A"}</td>
                    {/* Report */}
                    <td className="border px-6 py-4">{subCategoryItem.report || "No report available."}</td>
                    <td className="border px-6 py-4">
                      <button onClick={() => handleReviewClick(id)}>
                        Update Review
                      </button>
                {/*      { id} */}
                    </td>

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
        // Employee View Table
        <div className="my-5">
          {reportData.length > 0 ? (
            //<div className="overflow-auto max-h-80">
              <div className="overflow-auto" style={{ maxHeight: '430px' }}>
              <table className="min-w-full text-sm text-left text-gray-500 border border-gray-300">
                <thead className="text-xs text-gray-700 uppercase bg-slate-200 border-b border-gray-300" style={{ height: '50px', overflowY: 'hidden' }}>
                  <tr>
                    <th className="border px-4 py-2" style={{ width: "50px" }}>S/No</th>
                    <th className="border px-4 py-2" style={{ width: "180px" }}>Date</th>
                    <th className="border px-4 py-2" style={{ width: "150px" }}>Project Name</th>
                    <th className="border px-4 py-2" style={{ width: "150px" }}>Subcategory</th>
                    <th className="border px-4 py-2" style={{ width: "500px" }}>Report</th>
                    {/* <th className="border px-4 py-2" style={{ width: "50px" }}>Edit</th> */}
                    <th className="border px-4 py-2" style={{ width: "50px" }}>Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    let serialNo = 1; // Serial number counter

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
                                    {/* Serial Number */}
                                    <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
                                      {serialNo++}
                                    </td>
                                    {/* Report Date */}
                                    <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
                                      {reportDate}
                                    </td>
                                  </>
                                )}
                                {/* Project Name */}
                                {subCatIndex === 0 && (
                                  <td className="border px-6 py-4" rowSpan={subcategories.length}>
                                    {detailItem.projectName || "N/A"}
                                  </td>
                                )}
                                {/* Subcategory */}
                                <td className="border px-6 py-4">{subCategoryItem.subCategoryName || "N/A"}</td>
                                {/* Report */}
                                <td className="border px-6 py-4">{subCategoryItem.report || "No report available."}</td>
                                {/* {designation === "employee" && moment(reportDate, "DD-MM-YYYY").isSame(
                        moment(),
                        "day"
                      ) && (
                      <td className="px-4 py-3">
                        <button onClick={() => handleEdit(dateItem.id)}>
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                      </td>
                    )} */}
                    {designation === "employee" || "Employee" && moment(reportDate, "DD-MM-YYYY").isSame(
                        moment(),
                        "day"
                      ) && (
                    <td className="px-4 py-3">
                    <button onClick={() => handleDelete(dateItem.id)}>
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </td>
                    )}
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
      )} {reviewData && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-md shadow-lg w-1/3">
            <h3 className="text-xl mb-4">Update Review</h3>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              rows="4"
              className="w-full border p-2 rounded-md"
              placeholder="Write your review here"
            />
            <div className="mt-4 text-right">
              <button onClick={handleReviewUpdate} className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                Update Review
              </button>
              <button onClick={() => setReviewData(null)} className="ml-2 px-6 py-2 bg-gray-300 text-black rounded-lg hover:bg-gray-400">
                Cancel
              </button>
            </div>
          </div>
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
