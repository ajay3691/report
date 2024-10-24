import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { FaEdit, FaTrash } from 'react-icons/fa'; // Import icons

const EmployeeList = () => {
  const { employeeId } = useSelector((state) => state.login.userData);
  const [employeeList, setEmployeeList] = useState([]);
  const [totalRecord, setTotalRecord] = useState(0);
  const [page, setPage] = useState(1);
  const [maxDisplayCount, setMaxDisplayCount] = useState(5);
  const tableData1 = ["Profile", "Employee ID", "Name", "Designation", "Mobile", "Email", "Actions"]; // Added "Actions"

  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchIdCardList = async () => {
      try {
        const payload = {
          domain: "",
          page,
          limit: maxDisplayCount,
        };
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/employee_list/`, payload);

        const { status, data, totalRecords } = response.data;
        if (status === "Success") {
          setTotalRecord(totalRecords);
          setEmployeeList(data);
        }
      } catch (error) {
        console.error("Error occurred:", error);
      }
    };
    fetchIdCardList();
  }, [employeeId, maxDisplayCount, page]);

  const handleEdit = (employee) => {
    // Navigate to edit page with employee ID
    navigate(`/edit-employee/${employee.employeeId}`);
  };

  const handleDelete = async (employeeId) => {
    // Add your delete logic here
    // For example, call an API to delete the employee
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/delete_employee/${employeeId}`);
      // Refresh the employee list after deletion
      setPage(1); // Reset to first page to fetch fresh data
    } catch (error) {
      console.error("Error occurred during deletion:", error);
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Employee List</h2>
        <button
          onClick={() => navigate("/dashboard/addEmployee")} // Navigate to add employee page
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Add Employee
        </button>
      </div>

      <div className="relative overflow-x-auto rounded-t-md">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 whitespace-nowrap">
          <thead className="text-xs text-gray-700 uppercase bg-slate-200">
            <tr>
              {tableData1.map((title) => (
                <th key={title} scope="col" className="px-4 py-3">
                  {title}
                </th>
              ))}
            </tr>
          </thead>
          {employeeList.length > 0 ? (
            <tbody>
              {employeeList.map((value) => (
                <tr key={value.employeeId} className="bg-gray-50 border-b text-gray-500">
                  <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    <img alt="profile pic" className="w-10 h-10 rounded-full" src={value.profileUrl} />
                  </th>
                  <td className="px-4 py-4">{value.employeeId.toUpperCase()}</td>
                  <td className="px-4 py-4">{value.employeeName}</td>
                  <td className="px-4 py-4">{value.designation}</td>
                  <td className="px-4 py-4">{value.mobileNumber}</td>
                  <td className="px-4 py-4">{value.email}</td>
                  <td className="px-4 py-4 flex gap-2"> {/* Action buttons */}
                    <button onClick={() => handleEdit(value)} className="text-blue-500">
                      <FaEdit />
                    </button>
                    <button onClick={() => handleDelete(value.employeeId)} className="text-red-500">
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          ) : (
            <div className="flex justify-center font-bold">No Data</div>
          )}
        </table>
      </div>

      {totalRecord > 5 && (
        <div className="flex flex-col items-center p-3">
          <span className="text-sm text-gray-700">
            Showing <span className="font-semibold text-gray-900">{(page - 1) * maxDisplayCount + 1}</span> to <span className="font-semibold text-gray-900">{Math.min(page * maxDisplayCount, totalRecord)}</span> of <span className="font-semibold text-gray-900">{totalRecord}</span> Entries
          </span>
          <div className="inline-flex mt-2 xs:mt-0">
            <button disabled={page === 1} onClick={() => setPage(page - 1)} className="flex items-center justify-center px-3 h-8 text-sm font-medium text-white bg-gray-800 rounded-s hover:bg-gray-900">
              <svg className="w-3.5 h-3.5 me-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5H1m0 0 4 4M1 5l4-4" />
              </svg>
              Prev
            </button>
            <button disabled={page * maxDisplayCount >= totalRecord} onClick={() => setPage(page + 1)} className="flex items-center justify-center px-3 h-8 text-sm font-medium text-white bg-gray-800 border-0 border-s border-gray-700 rounded-e hover:bg-gray-900">
              Next
              <svg className="w-3.5 h-3.5 ms-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default EmployeeList;
