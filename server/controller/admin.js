const {connection,attendanceConnection} = require("../dbConfig");

exports.employee_list = async (req, res, next) => {
  try {
    const sql = `Select *,name as employeeName from tbl_userDetails where isActive='1' and userType="employee" order by employeeId asc`;
    const [result] = await connection.execute(sql);
    let projectDetails = []
    for (let i = 0; i < result.length; i++) {
      const sql1 = `select a.project,a.subProject from tbl_projects a join tbl_employee_project_map b on a.id=b.projectId where b.employeeId="${result[i].employeeId}" AND a.isActive='1' AND b.isActive='1'`;
      const [result1] = await connection.execute(sql1);
      const sql2 = `select project,subProject from tbl_projects where id not in (select a.id from tbl_projects a join tbl_employee_project_map b on a.id=b.projectId where employeeId="${result[i].employeeId}" AND a.isActive='1' AND b.isActive='1') AND isActive='1'`;
      const [result2] = await connection.execute(sql2);

      const trueValue = result1.map(item => [{ projectName: item.project, subCategory: item.subProject, "isActive": true }])
      const falseValue = result2.map(item => [{ projectName: item.project, subCategory: item.subProject, "isActive": false }])
      const val = [...trueValue, ...falseValue].flat()
      result[i].projectDetails = val
      projectDetails.push(result[i])
    }
    res.send({ status: "Success", data: projectDetails.flat() });
  } catch (error) {
    next(error);
  }
};

exports.reportHistory_admin = async (req, res, next) => {
  let { domain, fromDate, toDate } = req.body
  const page = parseInt(req.body.page) || 1; 
  const limit = parseInt(req.body.limit) || 10; 
  const offset = (page - 1) * limit;

  function processResults(results) {
    const groupedResults = results.reduce((acc, row) => {
      const {
        employeeId, id, reportDetails, selectedProjectList, subCategoryList, reportDate,name
      } = row;
  
      const report = {
        id,
        reportDetails,
        selectedProjectList,
        subCategoryList,
        employeeId,
        name
      };
  
      if (!acc[reportDate]) {
        acc[reportDate] = [];
      }
  
      acc[reportDate].push(report);
  
      return acc;
    }, {});
  console.log(groupedResults)
  console.log(Object.keys(groupedResults))
    return Object.keys(groupedResults).map(reportDate => ({
      reportDate,
      reports: groupedResults[reportDate]
    }));
  }
  

  try {
    if (domain == 'Development') {
      fromDate=fromDate||'CURDATE()';
      toDate=toDate||'CURDATE()';
      const sql = `
SELECT 
    er.id,
      er.employeeId,
      er.reportDetails,
      er.seletedProjectList,
      er.subCategoryList,
      DATE_FORMAT(er.reportDate, '%d-%b-%Y') AS reportDate,
      ud.name
FROM 
    tbl_emp_reports er
INNER JOIN 
    tbl_userdetails ud 
ON 
    er.employeeId = ud.employeeId
  WHERE 
      er.isActive = '1' 
      AND er.reportDate BETWEEN '${fromDate}' AND '${toDate}'
  ORDER BY 
      er.reportDate DESC LIMIT ${limit} OFFSET ${offset}
`;
      let countSql = `
SELECT COUNT(*) as total
FROM       tbl_emp_reports 
  WHERE 
      isActive = '1' 
      AND reportDate BETWEEN '${fromDate}' AND '${toDate}'
`;
      const [countResult] = await connection.execute(countSql);
      const totalRecords = countResult[0].total;
      const [result] = await connection.execute(sql);
      const processedResults = processResults(result);
      res.send({ status: "Success", totalRecords, limit: limit, page: page, data: processedResults });
    } else {
      console.log("first")
    //   let sql = `SELECT id,employeeId,application,location,receivedDate,regNo,noOfForms,scanning,typing,photoshop,coraldraw,underPrinting,toBeDelivered,delivered,remarks
    //   ,DATE_FORMAT(reportDate, '%d-%b-%Y') AS reportDate FROM report.tbl_idcard_reports where isActive='1' AND 
    //   reportDate BETWEEN ${fromDate ? `"${fromDate}"` : 'DATE_SUB(CURDATE(), INTERVAL 7 DAY) '} AND ${toDate ? `"${toDate}"` : 'CURDATE()'}
    // ORDER BY reportDate DESC LIMIT ${limit} OFFSET ${offset}`;

let sql = `
    SELECT 
      r.id,
      r.employeeId,
      e.name, 
      r.application,
      r.location,
      r.receivedDate,
      r.regNo,
      r.noOfForms,
      r.scanning,
      r.typing,
      r.photoshop,
      r.coraldraw,
      r.underPrinting,
      r.toBeDelivered,
      r.delivered,
      r.remarks,
      DATE_FORMAT(r.reportDate, '%d-%b-%Y') AS reportDate 
    FROM report.tbl_idcard_reports r
    LEFT JOIN tbl_userdetails e ON r.employeeId = e.employeeId 
    WHERE r.isActive = '1'
      AND r.reportDate BETWEEN ${fromDate ? `"${fromDate}"` : 'DATE_SUB(CURDATE(), INTERVAL 7 DAY)'}
      AND ${toDate ? `"${toDate}"` : 'CURDATE()'}
    ORDER BY r.reportDate DESC
    LIMIT ${limit} OFFSET ${offset}
  `;
  

      let countSql = `
SELECT COUNT(*) as total
FROM tbl_idcard_reports 
WHERE isActive='1' AND
  reportDate BETWEEN ${fromDate ? `"${fromDate}"` : 'DATE_SUB(CURDATE(), INTERVAL 7 DAY) '} AND ${toDate ? `"${toDate}"` : 'CURDATE()'}
`;
      const [countResult] = await connection.execute(countSql);
      const totalRecords = countResult[0].total;
      const [result] = await connection.execute(sql);
      res.send({
        status: "Success", totalRecords, limit: limit,
        page: page, data: result
      });
    }
  } catch (error) {
    next(error)
  }
}



exports.create_project = async (req, res, next) => {
  const { id, projectName, subProject } = req.body;
  const subProjectString = JSON.stringify(subProject);
  try {
    if (id) {
      const sql = `UPDATE tbl_projects SET subProject='${subProjectString}',project='${projectName}' WHERE id=${id}`;
      const [result] = await connection.execute(sql);
      res.send({ status: "Success", message: "ProjectDetails Updated Successfully" })
    } else {
      const sql = `Insert into tbl_projects(project,subProject)Values('${projectName}','${subProjectString}')`;
      const [result] = await connection.execute(sql);
      res.send({ status: "Success", message: "ProjectDetails Inserted Successfully" })
    }
  } catch (error) {
    next(error)
  }
}
exports.delete_project=async(req,res,next)=>{
  const {id}=req.body;
  try {
    const sql=`update tbl_projects set isActive='0' where id=${id}`;
    const [result] = await connection.execute(sql);
    res.send({ status: "Success", message: "ProjectDetails Deleted Successfully" })
  } catch (error) {
    next(error)
  }
}


exports.applyLeave = async (req, res, next) => {
  const { Employee_id, userName, leaveTypes, leaveTimes, startDate, endDate, reason } = req.body;

  try {
    console.log("Request body:", req.body);

    const start = new Date(startDate);
    const end = new Date(endDate);

    const timeDifference = end.getTime() - start.getTime();
    let noOfDays = timeDifference / (1000 * 3600 * 24) + 1; 

    if (startDate === endDate) {
      if (leaveTimes === "Full Day") {
        noOfDays = 1;
      } else if (leaveTimes === "Halfday") {
        noOfDays = 0;
      } else if (leaveTypes === "Permission") {
        noOfDays = 0; 
      }
    } else {
      if (leaveTimes === "Halfday") {
        noOfDays -= 0.5; 
      }
    }

    const currentMonth = start.getMonth() + 1; 
    const currentYear = start.getFullYear();

    const checkCasualLeaveQuery = `
      SELECT * FROM leaverequest_form
      WHERE Employee_id = ? 
        AND leaveTypes = 'Casual Leave'
        AND MONTH(startDate) = ?
        AND YEAR(startDate) = ?
    `;
    const [casualLeave] = await attendanceConnection.execute(checkCasualLeaveQuery, [Employee_id, currentMonth, currentYear]);

    if (casualLeave.length > 0 && leaveTypes === 'Casual Leave') {
      return res.status(400).send({ status: "Error", message: "Casual Leave has already been used this month." });
    }

    const checkSaturdayOffQuery = `
      SELECT * FROM leaverequest_form
      WHERE Employee_id = ? 
        AND leaveTypes = 'Saturday Off'
        AND MONTH(startDate) = ?
        AND YEAR(startDate) = ?
    `;
    const [saturdayOff] = await attendanceConnection.execute(checkSaturdayOffQuery, [Employee_id, currentMonth, currentYear]);

    if (saturdayOff.length > 0 && leaveTypes === 'Saturday Off') {
      return res.status(400).send({ status: "Error", message: "Saturday Off has already been used this month." });
    }

    const insertLeaveQuery = `
      INSERT INTO leaverequest_form (Employee_id, userName, leaveTypes, leaveTimes, startDate, endDate, reason, noOfDays, status) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Pending')
    `;

    const [result] = await attendanceConnection.execute(insertLeaveQuery, [
      Employee_id !== undefined ? Employee_id : null, 
      userName !== undefined ? userName : null,    
      leaveTypes !== undefined ? leaveTypes : null, 
      leaveTimes !== undefined ? leaveTimes : null, 
      startDate !== undefined ? startDate : null,   
      endDate !== undefined ? endDate : null,       
      reason !== undefined ? reason : null,         
      noOfDays 
    ]);

    res.send({ status: "Success", message: "Leave applied successfully", data: { Id: result.insertId } });

  } catch (error) {
    next(error);
  }
};

//employee get
exports.getLeaveApplications = async (req, res, next) => {
  const { Employee_id, startDate, endDate } = req.body;

  try {
    // Validate input
    if (!Employee_id) {
      return res.status(400).send({ status: "Error", message: "Employee ID is required" });
    }
    if (!startDate || !endDate) {  // Use startDate and endDate here
      return res.status(400).send({ status: "Error", message: "Both startDate and endDate are required" });
    }

    // Build SQL query with filters
    let sql = `
      SELECT * FROM leaverequest_form
      WHERE Employee_id = ?
      AND startDate >= ? 
      AND endDate <= ?
    `;

    const params = [Employee_id, startDate, endDate];

    const [results] = await attendanceConnection.execute(sql, params);

    res.send({ status: "Success", data: results });
  } catch (error) {
    next(error);
  }
};

//admin get
/* exports.getLeaveRequestsAll = async (req, res, next) => {
  const { fromDate, toDate } = req.body;

  try {
    if (!fromDate || !toDate) {
      return res.status(400).json({
        status: "Error",
        message: "Missing required parameters: fromDate or toDate",
      });
    }

    const fromDateObj = new Date(fromDate);
    const toDateObj = new Date(toDate);

    if (isNaN(fromDateObj) || isNaN(toDateObj)) {
      return res.status(400).json({
        status: "Error",
        message: "Invalid date format. Please provide valid dates.",
      });
    }

    // Fetch leave requests from 'leaverequest_form' table in the 'attendanceConnection' database
    const fetchLeaveRequestsQuery = `
      SELECT 
        *
      FROM 
        leaverequest_form lr
      WHERE 
        lr.createdAt BETWEEN ? AND ?
    `;

    const [leaveRequests] = await attendanceConnection.execute(fetchLeaveRequestsQuery, [fromDateObj, toDateObj]);

    if (leaveRequests.length === 0) {
      return res.status(404).json({
        status: "Error",
        message: "No leave requests found in the given date range",
      });
    }

    // Fetch employee names from the 'tbl_userDetails' table in the 'connection' database
    const fetchEmployeeNamesQuery = `
      SELECT 
        employeeId, 
        name AS employeeName 
      FROM 
        tbl_userDetails
    `;

    const [employeeDetails] = await connection.execute(fetchEmployeeNamesQuery);
  console.log("employeeDetails",employeeDetails)
    
  // Create a map of Employee_id to employeeName
    const employeeMap = employeeDetails.reduce((acc, employee) => {
      acc[employee.Employee_id] = employee.employeeName;
      return acc;
    }, {});

    // Merge employee name into leaveRequests
    leaveRequests.forEach((leave) => {
      leave.employeeName = employeeMap[leave.employeeName] || "Unknown"; // Default to "Unknown" if employee is not found
    });
    console.log("employeeMap",employeeMap)

    // Return the merged result
    res.status(200).json({
      status: "Success",
      message: "Leave requests retrieved successfully",
      data: leaveRequests,
    });

  } catch (error) {
    next(error);
  }
};
 */
exports.getLeaveRequestsAll = async (req, res, next) => {
  const { fromDate, toDate } = req.body;

  try {
    if (!fromDate || !toDate) {
      return res.status(400).json({
        status: "Error",
        message: "Missing required parameters: fromDate or toDate",
      });
    }

    const fromDateObj = new Date(fromDate);
    const toDateObj = new Date(toDate);

    if (isNaN(fromDateObj) || isNaN(toDateObj)) {
      return res.status(400).json({
        status: "Error",
        message: "Invalid date format. Please provide valid dates.",
      });
    }

    // Fetch leave requests from 'leaverequest_form' table in the 'attendanceConnection' database
    const fetchLeaveRequestsQuery = `
      SELECT 
        *
      FROM 
        leaverequest_form lr
      WHERE 
        lr.createdAt BETWEEN ? AND ?;
    `;

    const [leaveRequests] = await attendanceConnection.execute(fetchLeaveRequestsQuery, [fromDateObj, toDateObj]);

    if (leaveRequests.length === 0) {
      return res.status(404).json({
        status: "Error",
        message: "No leave requests found in the given date range",
      });
    }

    // Fetch employee details from 'tbl_userDetails' table in the 'connection' database
    const fetchEmployeeNamesQuery = `
      SELECT 
        employeeId, 
        name AS employeeName 
      FROM 
        tbl_userDetails;
    `;

    const [employeeDetails] = await connection.execute(fetchEmployeeNamesQuery);
    console.log("employeeDetails", employeeDetails);

    // Create a map of employeeId to employeeName from the employeeDetails
    const employeeMap = employeeDetails.reduce((acc, employee) => {
      acc[employee.employeeId] = employee.employeeName;  // Note: ensure the property name matches exactly.
      return acc;
    }, {});
    console.log("employeeMap", employeeMap);

    // Merge employee name into leaveRequests
    leaveRequests.forEach((leave) => {
      // Check if the employeeId from leaveRequest exists in employeeMap, if so, assign the employeeName
      leave.employeeName = employeeMap[leave.Employee_id] || "Unknown"; // Default to "Unknown" if employee is not found
    });

    // Return the merged result
    res.status(200).json({
      status: "Success",
      message: "Leave requests retrieved successfully",
      data: leaveRequests,
    });

  } catch (error) {
    next(error);
  }
};

exports.updateLeaveStatus = async (req, res, next) => {
  const { leaveId, status, remarks } = req.body;

  try {
    if (!leaveId || !status) {
      return res.status(400).json({ status: "Error", message: "Missing required parameters: leaveId or status" });
    }

    const allowedStatuses = ["Accept", "Reject", "Pending"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ status: "Error", message: `Invalid status. Allowed values are: ${allowedStatuses.join(", ")}` });
    }

    let updateLeaveQuery;
    let queryParams;

    const currentDate = new Date();

    if (status === "Accept") {
      updateLeaveQuery = `
        UPDATE leaverequest_form 
        SET status = ?, acceptDate = ?, remarks = ? 
        WHERE lid = ?
      `;
      queryParams = [status, currentDate, remarks !== undefined ? remarks : null, leaveId];
    } else if (status === "Reject") {
      updateLeaveQuery = `
        UPDATE leaverequest_form 
        SET status = ?, remarks = ? 
        WHERE lid = ?
      `;
      queryParams = [status, remarks !== undefined ? remarks : null, leaveId];
    } else {
      updateLeaveQuery = `
        UPDATE leaverequest_form 
        SET status = ?, remarks = ? 
        WHERE lid = ?
      `;
      queryParams = [status, remarks !== undefined ? remarks : null, leaveId];
    }

    const [result] = await attendanceConnection.execute(updateLeaveQuery, queryParams);

    if (result.affectedRows === 0) {
      return res.status(404).json({ status: "Error", message: "Leave request not found" });
    }

    res.status(200).json({
      status: "Success",
      message: "Leave status updated successfully",
      data: { leaveId, updatedStatus: status, remarks, acceptDate: status === "Accepted" ? currentDate : null }
    });

  } catch (error) {
    next(error);
  }
};


exports.updateLeaveStatus1 = async (req, res, next) => {
  const { leaveIds, status, remarks } = req.body;

  try {
    // Validate input
    if (!leaveIds || !Array.isArray(leaveIds) || leaveIds.length === 0) {
      return res.status(400).send({ status: "Error", message: "Leave IDs must be provided in an array" });
    }

    // Update the leave application status
    const sql = `
      UPDATE tbl_leave_applications 
      SET status = ?, remarks = ?, acceptdate = NOW()
      WHERE lid IN (?)
    `;

    // Use parameterized query for IN clause
    await connection.execute(sql, [status, remarks || null, leaveIds]);

    res.send({ status: "Success", message: "Leave application statuses updated successfully" });
  } catch (error) {
    next(error);
  }
};

exports.getEmployeeLeaveReport = async (req, res, next) => {
  const { employeeId } = req.params;

  try {
    if (!employeeId) {
      return res.status(400).send({ status: "Error", message: "Employee ID is required" });
    }

    const sql = `
      SELECT * FROM tbl_leave_applications 
      WHERE employeeId = ?
    `;

    const [results] = await connection.execute(sql, [employeeId]);

    res.send({ status: "Success", data: results });
  } catch (error) {
    next(error);
  }
};


exports.dailypunch = async (req, res) => {
    const { from_date, to_date } = req.body;

    try {
        let query = '';
        let params = [];

        if (from_date && to_date) {
            // If date range is provided
            query = `SELECT * FROM tbl_dailypunch WHERE CAST(createdAt AS DATE) BETWEEN ? AND ?`;
            params = [from_date, to_date];
        } else {
            // Default to today's data
            query = `SELECT * FROM tbl_dailypunch WHERE CAST(createdAt AS DATE) = CURRENT_DATE`;
        }

        const [rows] = await attendanceConnection.execute(query, params);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Server error');
    }
};



