import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import moment from "moment"; // Using moment.js for easier date formatting

const EmployeeReportList = () => {
  const { employeeId } = useSelector((state) => state.login.userData);
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
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/reportHistory_admin`,
          payload
        );

        console.log("API Response:", response.data); // Log the response data

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
  }, [fromDate, toDate, page, maxDisplayCount]);

  return (
    <>
      <div className="my-5 flex items-center justify-center gap-4">
        <div className="relative">
          <input
            name="fromDate"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            type="date"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
          />
        </div>
        <span className="mx-4 text-gray-500">to</span>
        <div className="relative">
          <input
            name="toDate"
            value={toDate}
            type="date"
            onChange={(e) => setToDate(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
          />
        </div>
      </div>

      <div className="my-5">
        {employeeReportList.length > 0 ? (
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-300">
              <tr>
                <th scope="col" className="px-6 py-3">
                  S/No
                </th>
                <th scope="col" className="px-6 py-3">
                  Date
                </th>
                <th scope="col" className="px-6 py-3">
                  Employee Name
                </th>
                <th scope="col" className="px-6 py-3">
                  Project Name
                </th>
                <th scope="col" className="px-6 py-3">
                  Subcategory
                </th>
                <th scope="col" className="px-6 py-3">
                  Report
                </th>
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
                            {reportItem.reportDetails[0]?.projectName || "N/A"}{" "}
                            {/* Ensure projectName is accessed correctly */}
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
                              {/* Display Subcategories and Reports */}
                              {reportItem.reportDetails.map((detail) =>
                                detail.subCategory.map(
                                  (subCat, subCatIndex) => (
                                    <tr
                                      key={subCatIndex}
                                      className="bg-white border-b hover:bg-gray-50"
                                    >
                                      {/* <td className="px-6 py-4">
                                        {subCat.subCategoryName || "N/A"}
                                      </td> */}
                                      <td className="px-6 py-4">
                                        {subCat.report ||
                                          "No report available."}{" "}
                                        {/* Use subCat.report */}
                                      </td>
                                    </tr>
                                  )
                                )
                              )}
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
    </>
  );
};

export default EmployeeReportList;
