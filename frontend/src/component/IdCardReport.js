import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // Import useParams

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

const NumberInputField = ({ label, handleInputChange, value }) => {
  const id = toCamelCase(label);
  return (
    <div>
      <div className="py-2 block text-sm font-medium text-gray-900 bg-slate-100 p-2 rounded">
        <label htmlFor={id}>{label}</label>
      </div>
      <div className="py-3">
        <input onChange={handleInputChange} type="number" id={id} value={value} className="w-full sm:w-28 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5" placeholder="" />
      </div>
    </div>
  );
};

const IdCardReport = () => {
  // Get employeeId and reportId from local storage
  const employeeId = localStorage.getItem("employeeId");
  const selectedIdCardId = localStorage.getItem('selectedIdCardId');

  // Initialize formData state with fields from formTwo set to 0
  const formTwo = ["Scanning", "Typing", "Photoshop", "Coraldraw", "Under Printing", "To be Delivered", "Delivered"];
  const initialFormData = {
    reportDate: new Date().toISOString().slice(0, 10),
    receivedDate: "",
    regNo: "",
    noOfForms: "",
    remarks: "",
  };

  // Add fields from formTwo to the initialFormData
  formTwo.forEach(label => {
    initialFormData[toCamelCase(label)] = 0; // Set default value to 0
  });

  const [formData, setFormData] = useState(initialFormData);
  const [application, setApplication] = useState([]);
  const [location, setLocation] = useState([]);

  useEffect(() => {
    const fetchApplications = async () => {
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

    fetchApplications();
  }, []);

  useEffect(() => {
    const fetchIdReportDetails = async () => {
      if (selectedIdCardId && employeeId) { // Ensure both IDs are present
        try {
          const response = await axios.post(`${process.env.REACT_APP_API_URL}/getIdReportById/${employeeId}/${selectedIdCardId}`); // Fetching using employeeId and reportId
          const { status, data } = response.data;
          if (status === "Success") {
            if (data.length > 0) {
              setFormData(data[0]); // Populate form with the fetched data
            }
          }
        } catch (error) {
          console.error("Network error:", error);
        }
      }
    };

    fetchIdReportDetails();
  }, [selectedIdCardId, employeeId]); // Run effect when reportId or employeeId changes

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

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevents page reload
    try {
      formData.employeeId = employeeId;
      console.log("formData", formData);
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/post_id_report`, formData);

      const { status } = response.data;
      console.log(status);
      if (status === "Success") {
        alert("Data added successfully");
      }
    } catch (error) {
      console.error("Network error:", error);
      alert("Error submitting data: " + error.message); // Display error message
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 mb-6 md:grid-cols-2">
          <InputField label="Report Date" type="date" value={formData.reportDate || ""} handleInputChange={handleInputChange} max={new Date().toISOString().split("T")[0]} />
          <SelectInput label="Application" options={application} value={formData.application || ""} handleInputChange={handleInputChange} />
          <SelectInput label="Location" options={location} value={formData.location || ""} handleInputChange={handleInputChange} />
          <InputField label="Received Date" type="date" value={formData.receivedDate || ""} handleInputChange={handleInputChange} />
          <InputField label="Reg No" type="number" value={formData.regNo || ""} handleInputChange={handleInputChange} />
          <InputField label="No of Forms" type="number" value={formData.noOfForms || ""} handleInputChange={handleInputChange} />
        </div>

        <div className="my-2 whitespace-nowrap grid grid-cols-2 xl:grid-cols-7 md:grid-cols-4 sm:grid-cols-2">
          {formTwo.map((label) => (
            <NumberInputField key={label} label={label} handleInputChange={handleInputChange} value={formData[toCamelCase(label)]} />
          ))}
        </div>
        <hr />
        <div className="my-2">
          <label htmlFor="remarks" className="block mb-2 text-sm font-medium text-gray-900">
            Remarks
          </label>
          <textarea value={formData.remarks || ""} onChange={handleInputChange} id="remarks" name="remarks" rows="3" className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500" placeholder="" />
        </div>

        <div className="flex items-center justify-between">
          <button type="submit" className="text-white bg-indigo-900 hover:bg-indigo-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">
            Submit
          </button>
        </div>
      </form>
    </>
  );
};

export default IdCardReport;
