import React, { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import { useSelector } from "react-redux";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";

const IdCardList = () => {
  const { employeeId, userType } = useSelector((state) => state.login.userData);

  const [idCardList, setIdCardList] = useState([]);
  const [fromDate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
  const [toDate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const [totalRecord, setTotalRecord] = useState(0);
  const [page, setPage] = useState(1);
  const [maxDisplayCount, setMaxDisplayCount] = useState(10);
  const navigate = useNavigate();

  const adminTableHeaders = [
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
          setTotalRecord(totalRecords);
          setIdCardList(data);
        }
      } catch (error) {
        console.error("Error occurred:", error);
      }
    };
    fetchIdCardList();
  }, [employeeId, fromDate, maxDisplayCount, page, toDate, userType]);

  const handleDateChange = (e) => {
    if (e.target.name === "fromDate") {
      setFromDate(e.target.value);
    } else {
      setToDate(e.target.value);
    }
  };

  const handleEdit = (id) => {
    console.log(`Edit clicked for record id: ${id}`);
    localStorage.setItem("selectedIdCardId", id);
    navigate(`/dashboard/idCardReportEdit`, { state: { recordId: id } });
  };

  const handleMaxDisplayCountChange = (e) => {
    setMaxDisplayCount(e.target.value);
    setPage(1);
  };

  // Function to check if the date is today
  const isToday = (date) => {
    const today = new Date();
    const formattedToday = `${String(today.getDate()).padStart(2, '0')}-${today.toLocaleString('default', { month: 'short' })}-${today.getFullYear()}`;
    return date === formattedToday;
  };

  // Filter and sort data
  const filteredIdCardList = idCardList.filter((value) => {
    if (!fromDate && !toDate) {
      return isToday(value.reportDate);
    }
    if (fromDate && toDate) {
      const reportDate = new Date(value.reportDate.split("-").reverse().join("-")); // Adjust format for comparison
      return reportDate >= new Date(fromDate) && reportDate <= new Date(toDate);
    } else if (fromDate) {
      const reportDate = new Date(value.reportDate.split("-").reverse().join("-")); // Adjust format for comparison
      return reportDate >= new Date(fromDate) && reportDate <= new Date();
    }
    return false;
  }).sort((a, b) => new Date(b.reportDate) - new Date(a.reportDate)); // Sort by date descending

  // Helper function to determine the row spans
  const getRowSpans = (list) => {
    const spans = {};
    let prevKey = "";
    let prevApplication = "";

    list.forEach((item) => {
      const currentKey = `${item.reportDate}_${item.name}`;
      const count = spans[currentKey] || { applicationCounts: {}, total: 0 };

      // Count the occurrences of the current application
      count.applicationCounts[item.application] = (count.applicationCounts[item.application] || 0) + 1;

      // If it's the same report date and employee name
      if (prevKey === currentKey) {
        count.total++; // Increase the count for this key
      } else {
        count.total = 1; // Reset count for new combination
      }

      spans[currentKey] = count;
      prevKey = currentKey;
      prevApplication = item.application;
    });

    return spans;
  };

  const rowSpans = getRowSpans(filteredIdCardList);

  return (
    <>
      <div date-rangepicker className="my-5 flex items-center">
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
      </div>

      <div className="relative overflow-x-auto rounded-t-md">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-slate-200">
            <tr>
              {(userType !== "Admin" ? employeeTableHeaders : adminTableHeaders).map((title, index) => (
                <th key={index} scope="col" className="px-4 py-2">
                  {title}
                </th>
              ))}
            </tr>
          </thead>
          {filteredIdCardList.length > 0 ? (
            <tbody>
              {filteredIdCardList.map((value, index) => {
                const currentKey = `${value.reportDate}_${value.name}`;
                const { applicationCounts, total } = rowSpans[currentKey];
                const rowSpan = applicationCounts[value.application];

                // Determine if the current row should have a row span or not
                const isMerged = index > 0 && filteredIdCardList[index - 1].reportDate === value.reportDate && filteredIdCardList[index - 1].name === value.name && filteredIdCardList[index - 1].application === value.application;

                return (
                  <tr className="odd:bg-white even:bg-gray-50 border text-gray-600 whitespace-nowrap" key={index}>
                    {index === 0 || !isMerged ? (
                      <td rowSpan={total} className="px-4 py-3">{value.reportDate}</td>
                    ) : null}
                    {userType === "Admin" && (
                      <td rowSpan={total} className="px-4 py-3">{value.name}</td>
                    )}
                    {index === 0 || !isMerged ? (
                      <td rowSpan={rowSpan} className="px-4 py-3">{value.application}</td>
                    ) : null}
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
                    {userType === "Admin" && (
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleEdit(value._id)}
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
          ) : (
            <tbody>
              <tr>
                <td colSpan={userType === "Admin" ? adminTableHeaders.length : employeeTableHeaders.length} className="text-center py-4">
                  No records found
                </td>
              </tr>
            </tbody>
          )}
        </table>
      </div>
    </>
  );
};

export default IdCardList;
