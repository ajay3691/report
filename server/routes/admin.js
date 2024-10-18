const express =require("express");
const router =express.Router();

const reports =require("../controller/admin");

router.post('/employee_list',reports.employee_list);
router.post('/create_project',reports.create_project);
router.post('/delete_project',reports.delete_project);
router.post('/employee_project_list',reports.employee_list);
router.post('/reportHistory_admin',reports.reportHistory_admin);

router.post('/applyLeave',reports.applyLeave);
router.post('/getLeaveApplications',reports.getLeaveApplications);



router.get('/admin', (req, resp) => {
    resp.send("hello admin");
  });
module.exports = router;