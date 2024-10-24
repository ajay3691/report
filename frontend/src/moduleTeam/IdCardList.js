import React, { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import { useSelector } from "react-redux";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";

const IdCardList = () => {
  const { employeeId, userType,designation } = useSelector((state) => state.login.userData);
  const [idCardList, setIdCardList] = useState([]);
  const [fromDate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
  const [toDate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const [totalRecord, setTotalRecord] = useState(0);
  const [page, setPage] = useState(1);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const adminTableHeaders = [
    "S/No",
    "Report Date",
    "Employee Name",
    "Application",
    "Location",
    "Received Date",
    "Reg No",
    "No of Forms",
    "Scanning",
    "Typing",
    "Photoshop",
    "Coraldraw",
    "Under Printing",
    "To be Delivered",
    "Delivered",
  ];

  const employeeTableHeaders = [
    "S/No",
    "Report Date",
    "Application",
    "Location",
    "Received Date",
    "Reg No",
    "No of Forms",
    "Scanning",
    "Typing",
    "Photoshop",
    "Coraldraw",
    "Under Printing",
    "To be Delivered",
    "Delivered",
    "Edit",
  ];

  useEffect(() => {
    const fetchIdCardList = async () => {
      try {
        const payload = {
          domain: "idCard",
          page,
          limit: 25, // Default to 20 records
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
          setTotalRecord(totalRecords);
          setIdCardList(data);
          setError(null); // Clear any previous error
        } else {
          setError("Failed to fetch data.");
        }
      } catch (error) {
        console.error("Error occurred:", error);
        setError("An error occurred while fetching the data.");
      }
    };

    fetchIdCardList();
  }, [employeeId, fromDate, page, toDate, userType]);

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    if (name === "fromDate") {
      setFromDate(value);
      setPage(1); // Reset to first page on date change
    } else {
      setToDate(value);
      setPage(1); // Reset to first page on date change
    }
  };

  const handleEdit = (id) => {
    localStorage.setItem("selectedIdCardId", id);
    navigate(`/dashboard/idCardReportEdit`, { state: { recordId: id } });
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  // Calculate total pages
  const totalPages = Math.ceil(totalRecord / 20); // Default to 20 records

  // Grouping the ID card list for display
  const groupedIdCardList = idCardList.reduce((acc, curr) => {
    const reportDate = moment(curr.reportDate).format("DD-MM-YYYY");
    const employeeName = curr.name;

    const key = `${reportDate}|${employeeName}`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(curr);
    return acc;
  }, {});

  return (
    <>
      {error && <div className="text-red-600 mb-4">{error}</div>}
      <div date-rangepicker className="my-4 flex items-center">
        <div className="flex">
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
        </div>
      </div>

      <div className="overflow-auto" style={{ maxHeight: '470px' }}>
        <table className="w-full text-sm text-left rtl:text-right text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-slate-200 sticky top-0">
            <tr>
              {(designation !== "Sr Technical Lead"
                ? employeeTableHeaders
                : adminTableHeaders
              ).map((title, index) => (
                <th key={index} scope="col" className="px-4 py-2">
                  {title}
                </th>
              ))}
            </tr>
          </thead>
          {Object.keys(groupedIdCardList).length > 0 ? (
            <tbody>
              {Object.entries(groupedIdCardList).map(([key, group], groupIndex) => {
                const [reportDate, employeeName] = key.split("|");
                
                return group.map((value, index) => (
                  <tr
                    className="odd:bg-white even:bg-gray-50 border text-gray-600 whitespace-nowrap"
                    key={`${groupIndex}-${index}`}
                  >
                    {/* Display Serial No only once per unique group */}
                    {index === 0 && (
                      <td rowSpan={group.length} className="border px-4 py-2">
                        {groupIndex + 1} {/* Display group index as serial number */}
                      </td>
                    )}
                    {index === 0 && (
                      <td rowSpan={group.length} className="px-4 py-3">
                        {reportDate}
                      </td>
                    )}
                    {(designation === "Sr Technical Lead" || userType === "idcardAdmin") && index === 0 && (
                      <td rowSpan={group.length} className="px-4 py-3">
                        {employeeName}
                      </td>
                    )}

                    <td className="px-4 py-3">{value.application}</td>
                    <td className="px-4 py-3">{value.location}</td>
                    <td className="px-4 py-3">{value.receivedDate}</td>
                    <td className="px-4 py-3">{value.regNo}</td>
                    <td className="px-4 py-3">{value.noOfForms}</td>
                    <td className="px-4 py-3">{value.scanning}</td>
                    <td className="px-4 py-3">{value.typing}</td>
                    <td className="px-4 py-3">{value.photoshop}</td>
                    <td className="px-4 py-3">{value.coraldraw}</td>
                    <td className="px-4 py-3">{value.underPrinting}</td>
                    <td className="px-4 py-3">{value.toBeDelivered}</td>
                    <td className="px-4 py-3">{value.delivered}</td>
                    {designation !== "Sr Technical Lead" && (
                      <td className="px-4 py-3">
                        <button onClick={() => handleEdit(value.id)}>
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                      </td>
                    )}
                  </tr>
                ));
              })}
            </tbody>
          ) : (
            <tbody>
              <tr>
                <td colSpan={adminTableHeaders.length} className="text-center py-4">
                  No records found
                </td>
              </tr>
            </tbody>
          )}
        </table>
      </div>

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


    </>
  );
};

export default IdCardList;
