import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const toCamelCase = (str) => str.toLowerCase().replace(/([-_\s]+[a-z])/g, (match) => match.toUpperCase().replace(/[-_\s]/g, ""));

const InputField = ({ label, type, value, handleInputChange, max }) => {
  const id = toCamelCase(label);
  return (
    <div>
      <label htmlFor={id} className="block mb-2 text-sm font-medium text-gray-900">
        {label}
      </label>
      <input max={max} onChange={handleInputChange} type={type} id={id} value={value} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5" placeholder="" required />
    </div>
  );
};
const SelectInput = ({ label, options, value, handleInputChange }) => {
  const id = toCamelCase(label);
  return (
    <div>
      <label htmlFor={id} className="block mb-2 text-sm font-medium text-gray-900">
        {label}
      </label>
      <select id={id} value={value} onChange={handleInputChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5" required>
        <option value="">Choose a {label}</option>
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};
const NumberInputField = ({ label, handleInputChange }) => {
  const id = toCamelCase(label);
  return (
    <div>
      <div className="py-2 block text-sm font-medium text-gray-900 bg-slate-100 p-2 rounded">
        <label htmlFor={id}>{label}</label>
      </div>
      <div className="py-3">
        <input onChange={handleInputChange} type="number" id={id} className="w-full sm:w-28 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5" placeholder="" />
      </div>
    </div>
  );
};

const IdCardReport = () => {
  const { employeeId } = useSelector((state) => state.login.userData);
  const [formData, setFormData] = useState({
    reportDate: new Date().toISOString().slice(0, 10),
  });
  const [application, setApplication] = useState([]);
  const [location, setLocation] = useState([]);
  const [todayIdReportDetail, setTodayIdReportDetail] = useState([]);

  // const formOne = [
  //   { label: "Date", type: "date" },
  //   { label: "Application", type: "text" },
  //   { label: "Location", type: "text" },
  //   { label: "Received Date", type: "date" },
  //   { label: "Reg No.", type: "number" },
  //   { label: "No of Forms", type: "number" },
  // ];

  const formTwo = ["Scanning", "Typing", "Photoshop", "Coraldraw", "Under Printing", "To be Delivered", "Delivered"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/appId`);
        const { status, data } = response.data;
        if (status === "Success") {
          setApplication(data);
        }
      } catch (error) {
        console.error("Network error:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/get_id_report/${employeeId}`);
        const { status, data } = response.data;
        if (status === "Success") {
          setTodayIdReportDetail(data);
        }
      } catch (error) {
        console.error("Network error:", error);
      }
    };

    fetchData();
  }, [employeeId]);

  const handleInputChange = async (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [id]: value }));

    if (id === "application") {
      try {
        const locationIdresponse = await axios.post(`${process.env.REACT_APP_API_URL}/locationId/${value}`);
        const { status, data } = locationIdresponse.data;
        if (status === "Success") {
          setLocation(data);
        }
      } catch (error) {
        console.error("Network error:", error);
      }
    }
  };

  const handleSubmit = async () => {
    try {
      formData.employeeId = employeeId;
      console.log("formData", formData);
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/post_id_report`, formData);

      const { status } = await response.data;
      console.log(status);
      if (status === "Success") {
        setFormData({});
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  const loadTodayIdReportDetail = () => {
    const reportDetailObj = todayIdReportDetail[0];
    setFormData(reportDetailObj);
  };
  console.log(formData);
  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 mb-6 md:grid-cols-2">
          {/* {formOne.map(({ label, type }) => (
          <InputField key={label} label={label} type={type} value={formData[toCamelCase(label)] || ""} handleInputChange={handleInputChange} />
        ))} */}
          <InputField label="Report Date" type="date" value={formData[toCamelCase("Report Date")] || ""} handleInputChange={handleInputChange} max={new Date().toISOString().split("T")[0]} />
          <SelectInput label="Application" options={application} value={formData.application || ""} handleInputChange={handleInputChange} />
          <SelectInput label="Location" options={location} value={formData.location || ""} handleInputChange={handleInputChange} />
          {/* <InputField label="Application" type="text" id="application" value={formData[toCamelCase("Application")] || ""} handleInputChange={handleInputChange} required /> */}
          {/* <InputField label="Location" type="text" id="location" value={formData[toCamelCase("Location")] || ""} handleInputChange={handleInputChange} required /> */}
          <InputField label="Received Date" type="date" value={formData[toCamelCase("Received Date")] || ""} handleInputChange={handleInputChange} />
          <InputField label="Reg No" type="number" value={formData[toCamelCase("Reg No")] || ""} handleInputChange={handleInputChange} />
          <InputField label="No of Forms" type="number" value={formData[toCamelCase("No of Forms")] || ""} handleInputChange={handleInputChange} />
        </div>

        <div className="my-2 whitespace-nowrap grid grid-cols-2 xl:grid-cols-7 md:grid-cols-4 sm:grid-cols-2">
          {formTwo.map((label) => (
            <NumberInputField key={label} label={label} handleInputChange={handleInputChange} />
          ))}
        </div>
        <hr></hr>
        <div className="my-2">
          <label htmlFor="remarks" className="block mb-2 text-sm font-medium text-gray-900">
            Remarks
          </label>
          <textarea value={formData.remarks || ""} onChange={handleInputChange} id="remarks" name="remarks" rows="3" className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500" placeholder="" />
        </div>

        <div className="flex items-center justify-between">
          <button type="submit" className="text-white  bg-indigo-900 hover:bg-indigo-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">
            Submit
          </button>
          {!!todayIdReportDetail.length && (
            <p className="font-semibold text-sm text-right">
              Today ID Card Report Submitted Succesfully,{" "}
              <span onClick={loadTodayIdReportDetail} className="text-blue-700 cursor-pointer">
                Click here to Edit
              </span>
            </p>
          )}
        </div>
      </form>
    </>
  );
};

export default IdCardReport;
