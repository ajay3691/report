import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

const EmployeeList = () => {
  const { employeeId } = useSelector((state) => state.login.userData);
  const [employeeList, setEmployeeList] = useState([]);
  const [totalRecord, setTotalRecord] = useState(0);
  const [page, setPage] = useState(1);
  // eslint-disable-next-line no-unused-vars
  const [maxDisplayCount, setMaxDisplayCount] = useState(5);
  const tableData1 = ["Profile", "Employee ID", "Name", "Designation", "Mobile", "Email", 
    // "Actions"
  ];

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
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };
  return (
    <>
      <>
        {isModalOpen && (
          <div className="overflow-y-auto flex overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full" aria-hidden="true">
            <div className="relative p-4 w-full max-w-2xl max-h-full">
              <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Static modal</h3>
                  <button onClick={toggleModal} type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white">
                    <span className="sr-only">Close modal</span>
                  </button>
                </div>
                <div className="p-4 md:p-5 space-y-4">
                  <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">With less than a month to go before the European Union enacts new consumer privacy laws for its citizens, companies around the world are updating their terms of service agreements to comply.</p>
                  <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">The European Union’s General Data Protection Regulation (G.D.P.R.) goes into effect on May 25 and is meant to ensure a common set of data rights in the European Union. It requires organizations to notify users as soon as possible of high-risk data breaches that could personally affect them.</p>
                </div>
                <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                  <button onClick={toggleModal} type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                    I accept
                  </button>
                  <button onClick={toggleModal} type="button" className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
                    Decline
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </>

      <div className="relative overflow-x-auto rounded-t-md">
        <table class="w-full text-sm text-left rtl:text-right text-gray-500 whitespace-nowrap">
          <thead class="text-xs text-gray-700 uppercase bg-slate-200">
            <tr>
              {tableData1.map((title) => (
                <th scope="col" class="px-4 py-3">
                  {title}
                </th>
              ))}
            </tr>
          </thead>
          {employeeList.length > 0 ? (
            <tbody>
              {employeeList.map((value, index) => (
                <>
                  <tr class="bg-gray-50 border-b text-gray-500">
                    <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                      <img alt="profile pic" class="w-10 h-10 rounded-full" src={value.profileUrl} />
                    </th>
                    <td class="px-4 py-4">{value.employeeId.toUpperCase()}</td>
                    <td class="px-4 py-4">{value.employeeName}</td>
                    <td class="px-4 py-4">{value.designation}</td>
                    <td class="px-4 py-4">{value.mobileNumber}</td>
                    <td class="px-4 py-4">{value.email}</td>
                    {/* <td class="px-4 py-4">
                      <button onClick={toggleModal} className="block text-indigo-700  font-medium rounded-lg text-sm  text-center" type="button">
                        View
                      </button>
                    </td> */}
                  </tr>
                </>
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
            Showing <span className="font-semibold text-gray-900">1</span> to <span className="font-semibold text-gray-900">5</span> of <span className="font-semibold text-gray-900">{totalRecord}</span> Entries
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
