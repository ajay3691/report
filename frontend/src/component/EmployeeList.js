import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const EmployeeList = () => {
  const { employeeId } = useSelector((state) => state.login.userData);
  const [employeeList, setEmployeeList] = useState([]);
  const [totalRecord, setTotalRecord] = useState(0);
  const [page, setPage] = useState(1);
  const [maxDisplayCount, setMaxDisplayCount] = useState(5);
  const tableHeaders = ["Profile", "Employee ID", "Name", "Designation", "Mobile", "Email", "Actions"];
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployeeList = async () => {
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
    fetchEmployeeList();
  }, [employeeId, maxDisplayCount, page]);

  const handleEdit = async (employeeId) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/getEmployeeById/${employeeId}`);
      if (response.data.status === 'Success') {
        navigate('/dashboard/addEmployee', { state: { employee: response.data.data } });
      }
    } catch (error) {
      console.error('Error fetching employee details:', error);
    }
  };
  

  const handleDelete = async (id) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/deleteEmployee/${id}`);
      if (response.data.status === "Success") {
        setEmployeeList(employeeList.filter((emp) => emp.id !== id));
        console.log("Deleted employee with ID:", id);
      }
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };

  return (
    <div className="relative">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Employee List</h2>
        <button
          onClick={() => navigate("/dashboard/addEmployee")}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add Employee
        </button>
      </div>

      <div className="relative border rounded-md max-h-[480px] overflow-auto">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-200 sticky top-0 z-10">
            <tr>
              {tableHeaders.map((header) => (
                <th key={header} className="px-4 py-3">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {employeeList.length > 0 ? (
              employeeList.map((value, index) => (
                <tr key={index} className="bg-gray-50 border-b">
                 <td className="px-4 py-4">
                    <img
                      alt="profile pic"
                      className="w-10 h-10 rounded-full"
                      // Check if the profileUrl starts with "http" to distinguish between full URLs and relative paths
                      src={value.profileUrl.startsWith('http') ? value.profileUrl : `${process.env.REACT_APP_API_URL}/uploads/Images/${value.profileUrl}`}
                      width={80}
                      height={80}
                    />
                  </td>
                  <td className="px-4 py-4">{value.employeeId.toUpperCase()}</td>
                  <td className="px-4 py-4">{value.employeeName}</td>
                  <td className="px-4 py-4">{value.designation}</td>
                  <td className="px-4 py-4">{value.mobileNumber}</td>
                  <td className="px-4 py-4">{value.email}</td>
                  <td className="px-4 py-4 flex gap-4">
                  <button
                      onClick={() => handleEdit(value.employeeId)} // Pass the entire employee object
                      className="text-blue-500 hover:text-blue-700"
                      title="Edit"
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button
                      onClick={() => handleDelete(value.id)}
                      className="text-red-500 hover:text-red-700"
                      title="Delete"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={tableHeaders.length} className="text-center px-4 py-4">
                  No Data
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalRecord > 5 && (
        <div className="flex justify-between items-center p-3">
          <span className="text-sm text-gray-700">
            Showing <span className="font-semibold text-gray-900">{(page - 1) * maxDisplayCount + 1}</span> to{" "}
            <span className="font-semibold text-gray-900">
              {Math.min(page * maxDisplayCount, totalRecord)}
            </span>{" "}
            of <span className="font-semibold text-gray-900">{totalRecord}</span> Entries
          </span>
          <div className="inline-flex">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="px-3 py-2 text-sm font-medium text-white bg-gray-800 rounded-l hover:bg-gray-900"
            >
              Prev
            </button>
            <button
              disabled={page * maxDisplayCount >= totalRecord}
              onClick={() => setPage(page + 1)}
              className="px-3 py-2 text-sm font-medium text-white bg-gray-800 rounded-r hover:bg-gray-900"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeList;
