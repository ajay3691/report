import axios from "axios";
import React, { useState } from "react";

const Addjob = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const postResponse = await axios.post(`${process.env.REACT_APP_API_URL}/career/post_new_job`, formData);
    const { status } = postResponse.data;
    console.log(status);
    if (status === "Success") {
      setFormData({
        title: "",
        description: "",
      });
      console.log(status);
    }
  };
  return (
    <>
      <form onSubmit={handleSubmit} className="mx-auto">
        <label htmlFor="title" className="block text-left mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Title
        </label>
        <input value={formData.title} onChange={handleChange} type="text" id="title" name="title" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="" />

        <label htmlFor="description" className="block text-left mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Description
        </label>
        <textarea value={formData.description} onChange={handleChange} id="description" name="description" rows="4" className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder=""></textarea>

        <button type="submit" className="flex justify-start mt-3 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
          Save
        </button>
      </form>
    </>
  );
};

export default Addjob;
