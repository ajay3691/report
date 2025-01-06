import React, { Suspense } from "react";
import { Link, Route, Routes, useLocation } from "react-router-dom";

const EmployeeReportList = React.lazy(() => import(/* webpackPrefetch: true */ "../moduleTl/EmployeeReportList"));
const IdCardList = React.lazy(() => import(/* webpackPrefetch: true */ "../moduleTl/IdCardList"));
const TaskList = React.lazy(() => import(/* webpackPrefetch: true */ "../moduleTl/TaskList"));

const ReportHistory = () => {
  const location = useLocation();
  return (
    <>
      <nav className="bg-gray-50">
        <div className="flex items-center max-w-screen-xl px-4 py-3 mx-auto">
          <ul className="flex flex-row font-medium mt-0 space-x-8 rtl:space-x-reverse text-sm">
            <li>
              <Link to="/dashboard/report-historyTl" className={location.pathname === "/dashboard/report-historyTl" ? "underline" : ""}>
                Employee Report
              </Link>
            </li>
            <li>
              <Link to="/dashboard/report-historyTl/id-card-report" className={location.pathname === "/dashboard/report-historyTl/id-card-report" ? "underline" : ""}>
                ID Card Report
              </Link>
            </li>
            <li>
              <Link to="/dashboard/report-historyTl/taskList" className={location.pathname === "/dashboard/report-historyTl/taskList" ? "underline" : ""}>
                Daily Task
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      <div className="images_content">
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<EmployeeReportList />} />
            <Route path="/id-card-report" element={<IdCardList />} />
            <Route path="/taskList" element={<TaskList />} />
          </Routes>
        </Suspense>
      </div>
    </>
  );
};

export default ReportHistory;
