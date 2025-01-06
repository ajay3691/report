import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {useNavigate} from 'react-router-dom'

const EmployeeReport = () => {
  const { employeeId } = useSelector((state) => state.login.userData);
  const [projectList, setProjectList] = useState([]);
  const [reportDetails, setReportDetails] = useState([]);
  const [seletedProjectList, setSelectedProjectList] = useState([]);
  const [subCategoryList, setSubCategoryList] = useState([]);
  const [reportDate, setReportDate] = useState(new Date().toISOString().slice(0, 10));
  const [todayReportDetail, setTodayReportDetail] = useState([]);
  const navigate = useNavigate();


  console.log(todayReportDetail);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reportDetails, projectsList] = await Promise.all([axios.post(`${process.env.REACT_APP_API_URL}/get_report_details/${employeeId}`), axios.post(`${process.env.REACT_APP_API_URL}/get_projects_list/${employeeId}`)]).then((responses) => responses.map((response) => response.data));

        const handleResponse = (data, setFunction, errorMessage) => {
          console.log(data.status);
          if (data.status === "Success") {
            setFunction(data.data);
          } else {
            console.error(errorMessage);
          }
        };

        handleResponse(reportDetails, setTodayReportDetail, "Report Details Fetch Failed");
        handleResponse(projectsList, setProjectList, "Product List Fetch Failed");
      } catch (error) {
        console.error("Error occurred:", error);
      }
    };

    fetchData();
  }, [employeeId]);
  console.log("projectList", projectList);
  const handleProjectChange = (event) => {
    const { value, checked } = event.target;
    const project = JSON.parse(value);

    setSelectedProjectList((prevState) => (checked ? [...prevState, project] : prevState.filter((item) => item.projectName !== project.projectName)));
    if (!checked) {
      setSubCategoryList((prevList) => prevList.filter((item) => item.projectName !== project.projectName));
      setReportDetails((prevList) => prevList.filter((item) => item.projectName !== project.projectName));
    }
  };

  const handleSubCategoryChange = (event) => {
    const { value, checked } = event.target;
    const { projectName, subCategory } = JSON.parse(value);

    setSubCategoryList((prevState) => {
      const projectIndex = prevState.findIndex((item) => item.projectName === projectName);

      if (checked) {
        if (projectIndex > -1) {
          // Project already exists, update subCategory
          const updatedProject = {
            ...prevState[projectIndex],
            subCategory: [...new Set([...prevState[projectIndex].subCategory, subCategory])],
          };
          return [...prevState.slice(0, projectIndex), updatedProject, ...prevState.slice(projectIndex + 1)];
        } else {
          // Project does not exist, add new project
          return [...prevState, { projectName, subCategory: [subCategory] }];
        }
      } else {
        // Checkbox is unchecked, remove the subCategory from the project
        if (projectIndex > -1) {
          const updatedSubCategory = prevState[projectIndex].subCategory.filter((cat) => cat !== subCategory);

          if (updatedSubCategory.length > 0) {
            const updatedProject = {
              ...prevState[projectIndex],
              subCategory: updatedSubCategory,
            };
            return [...prevState.slice(0, projectIndex), updatedProject, ...prevState.slice(projectIndex + 1)];
          } else {
            return prevState.filter((_, index) => index !== projectIndex);
          }
        } else {
          return prevState;
        }
      }
    });

    setReportDetails((prevState) => {
      if (!checked) {
        return prevState.map((project) => {
          if (project.projectName === projectName) {
            return {
              ...project,
              report: "",
              subCategory: project.subCategory.filter((subCat) => subCat.subCategoryName !== subCategory),
            };
          }
          return project;
        });
      }
      return prevState;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        employeeId,
        id: todayReportDetail[0]?.id || null,
        reportDate,
        seletedProjectList,
        subCategoryList,
        reportDetails: reportDetails.map(project => ({
          projectName: project.projectName,
          report: project.report,
          subCategory: project.subCategory.map(subCat => ({
            subCategoryName: subCat.subCategoryName,
            report: subCat.report,
          })),
        })),
      };
      console.log(payload);
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/post_emp_report`, payload);
  
      const { status } = response.data;
      console.log(status);
      if (status === "Success") {
        setReportDetails([]);
        setSelectedProjectList([]);
        setSubCategoryList([]);
        alert('Report added successfully!');
        navigate("/dashboard/report-history");

      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };
  

  const handleChange = (e) => {
    const { name, value } = e.target; // Get the input name and value
    const [projectName, subCategoryName] = name.split("_"); // Split the name into project and subcategory
  
    setReportDetails((prevState) => {
      const projectIndex = prevState.findIndex((project) => project.projectName === projectName);
      
      if (projectIndex > -1) {
        const project = prevState[projectIndex];
  
        if (subCategoryName === "description") {
          // If it's the main report description
          return [...prevState.slice(0, projectIndex), { ...project, report: value }, ...prevState.slice(projectIndex + 1)];
        } else {
          // If it's a subcategory report
          const subCategoryIndex = project.subCategory.findIndex((subCat) => subCat.subCategoryName === subCategoryName);
          
          if (subCategoryIndex > -1) {
            // If subcategory exists, update the report
            const updatedSubCategory = project.subCategory.map((subCat, index) =>
              index === subCategoryIndex ? { ...subCat, report: value } : subCat
            );
            return [...prevState.slice(0, projectIndex), { ...project, subCategory: updatedSubCategory }, ...prevState.slice(projectIndex + 1)];
          } else {
            // If subcategory does not exist, create a new one
            return [...prevState.slice(0, projectIndex), { ...project, subCategory: [...project.subCategory, { subCategoryName, report: value }] }, ...prevState.slice(projectIndex + 1)];
          }
        }
      } else {
        // If the project does not exist, create a new one
        const newProject = {
          projectName,
          report: subCategoryName === "description" ? value : "",
          subCategory: subCategoryName === "description" ? [] : [{ subCategoryName, report: value }],
        };
        return [...prevState, newProject];
      }
    });
  };
  

  const loadTodayReportDetail = () => {
    const reportDetailObj = todayReportDetail[0];
    setReportDetails(reportDetailObj.reportDetails);
    setSelectedProjectList(reportDetailObj.seletedProjectList);
    setSubCategoryList(reportDetailObj.subCategoryList);
    setReportDate(reportDetailObj.reportDate);
  };
  console.log("reportDetails", reportDetails);
  return (
    <div className="mt-5">
      <div className="flex items-center my-2">
        <label htmlFor={reportDate} className="block mb-2 text-sm font-medium text-gray-900">
          Report Date:
        </label>
        <input max={new Date().toISOString().split('T')[0]} onChange={(e) => setReportDate(e.target.value)} type="date" id="reportDate" value={reportDate} className="ml-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5" placeholder="" required />
      </div>
      <h2 className="mb-4 mt-5 text-left font-semibold text-gray-900">Select Projects</h2>
      <ul className="items-center w-full text-sm font-medium mb-5 text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex">
        {projectList.map((project, index) => (
          <li key={index} className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
            <div className="flex items-center ps-3">
              <input onChange={handleProjectChange} id={`project-checkbox-${index}`} type="checkbox" checked={seletedProjectList.some((item) => item.projectName === project.projectName) ? true : false} value={JSON.stringify(project)} name={project.projectName} className="w-4 h-4 checked:bg-orange-500 text-orange-500 bg-gray-100 border-gray-300 focus:ring-orange-500 rounded" />
              <label htmlFor={`project-checkbox-${index}`} className="w-full py-3 ms-2 text-sm font-medium text-gray-900">
                {project.projectName}
              </label>
            </div>
          </li>
        ))}
      </ul>

      <form onSubmit={handleSubmit} className="mx-auto m-2">
        {seletedProjectList.map((selectedProject, index) => (
          <div key={`projectName${index}`}>
            <h1 htmlFor="projectName" className="max-w-lg text-2xl font-semibold leading-loose text-start text-gray-900">
              {selectedProject.projectName}
            </h1>
            <div className="flex">
              {selectedProject.subCategory.map((subCategory, index) => (
                <div key={`subcategory_${index}`} className="flex items-center me-4 my-3">
                  <input onChange={handleSubCategoryChange} id={`subcategory-checkbox-${index}`} type="checkbox" checked={subCategoryList.find((item) => item.projectName === selectedProject.projectName)?.subCategory.includes(subCategory) || false} value={JSON.stringify({ projectName: selectedProject.projectName, subCategory })} name={subCategory} className="w-4 h-4 checked:bg-orange-500 text-orange-500 bg-gray-100 border-gray-300 rounded focus:ring-orange-500"/>
                  <label htmlFor={`subcategory-checkbox-${index}`} className="ms-2 text-sm font-medium text-gray-900">
                    {subCategory}
                  </label>
                </div>
              ))}
            </div>
            {subCategoryList.some((item) => item.projectName === selectedProject.projectName) ? (
              <div className="relative overflow-x-auto my-2">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 w-64">
                        Project name
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Report
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {subCategoryList
                      .find((item) => item.projectName === selectedProject.projectName)
                      .subCategory.map((category, index) => (
                        <tr key={`subcategory_report_${index}`} className="bg-white border-b">
                          <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                            {category}
                          </th>
                          <td className="px-6 py-4">
                          <textarea
                              value={reportDetails.find((project) => project.projectName === selectedProject.projectName)?.subCategory.find((subCat) => subCat.subCategoryName === category)?.report || ""}
                              onChange={handleChange}
                              id={`${selectedProject.projectName}_${category}`}
                              name={`${selectedProject.projectName}_${category}`}
                              rows="3"
                              className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                              placeholder=""
                              required
                            />
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div>
                <label htmlFor="description" className="block text-left my-2 text-sm font-medium text-gray-900">
                  Report
                </label>
{/*                 <textarea value={reportDetails.find((project) => project.projectName === selectedProject.projectName)?.report || ""} onChange={handleChange} id={`${selectedProject.projectName}_description`} name={`${selectedProject.projectName}_description`} rows="4" className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500" placeholder="" required></textarea>
 */}              </div>
            )}
          </div>
        ))}
        {seletedProjectList.length > 0 && (
          <button type="submit" className="flex justify-start mt-3 text-white bg-indigo-900 hover:bg-indigo-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
            Submit
          </button>
        )}
      </form>
      {!!todayReportDetail.length && (
        <p className="font-semibold text-sm text-right">
          Today Report Submitted Succesfully,{" "}
          <span onClick={loadTodayReportDetail} className="text-blue-700 cursor-pointer">
            Click here to Edit
          </span>
        </p>
      )}
    </div>
  );
};

export default EmployeeReport;
