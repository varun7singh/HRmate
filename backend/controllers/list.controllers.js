const Job = require("../model/Job");
const ErrorResponse = require("../middleware/error");
const asyncHandler = require("../middleware/asyncHandler");
const axios = require("axios");
const Employee = require("../model/Employee");
const URL = "http://127.0.0.1:5000";

exports.addJob = asyncHandler(async (req, res, next) => {
  const { title, description, salary, location, minQualification, skills } =
    req.body;
  const hr = req.user;
  if (
    !title ||
    !description ||
    !salary ||
    !location ||
    !minQualification ||
    !skills
  ) {
    return next(new ErrorResponse("Please fill all the fields", 400));
  }
  let jobData = {
    title,
    description,
    salary,
    location,
    minQualification,
    skills,
  };
  jobData.createdBy = hr._id;
  // fetch employees from flask
  // jobData.selectedEmployee = [];
  const job = await Job.create(jobData);
  if (!job) {
    return next(new ErrorResponse("Job not created", 400));
  }
  res.status(200).json({ success: true, data: job });
});

exports.getJobs = asyncHandler(async (req, res, next) => {
  const jobs = await Job.find({ createdBy: req.user._id });
  if (!jobs) {
    return next(new ErrorResponse("No jobs found", 404));
  }
  res.status(200).json({ success: true, data: jobs });
});

//job id in params
exports.getJob = asyncHandler(async (req, res, next) => {
  const job = await Job.findById(req.params.id);
  if (!job) {
    return next(new ErrorResponse("No job found", 404));
  }
  const employees = [];
  job.selectedEmployee.map(async (employee) => {
    const temp = await Employee.findById(employee);
    employees.push(temp);
  });
  res.status(200).json({ success: true, data: job, employees: employees });
});

// // job id in params
// exports.selectEmployee = asyncHandler(async (req, res, next) => {
//   const { employeeId } = req.body;
//   const job = await Job.findById(req.params.id);
//   if (!job) {
//     return next(new ErrorResponse("No job found", 404));
//   }
//   const employee = await Employee.findById(employeeId);
//   if (!employee) {
//     return next(new ErrorResponse("No employee found", 404));
//   }
//   if (employee.joblist.includes(job._id)) {
//     return next(new ErrorResponse("Employee already selected", 400));
//   }
//   employee.joblist.push(job._id);
//   job.selectedEmployee.push(employee._id);
//   await employee.save();
//   await job.save();
//   res.status(200).json({ success: true, data: job });
// });

// // job id in params
// exports.removeEmployee = asyncHandler(async (req, res, next) => {
//   const { employeeId } = req.body;
//   const job = await Job.findById(req.params.id);
//   if (!job) {
//     return next(new ErrorResponse("No job found", 404));
//   }
//   job.selectedEmployee = job.selectedEmployee.filter(
//     (employee) => employee !== employeeId
//   );
//   await job.save();
//   res.status(200).json({ success: true, data: job });
// });

// post request
exports.saveJobList = asyncHandler(async (req, res, next) => {
  const { jobList } = req.body;
  const job = await Job.findById(req.params.id);
  if (!job) {
    return next(new ErrorResponse("No job found", 404));
  }
  job.selectedEmployee = jobList;
  const employees = [];
  job.selectedEmployee.map(async (employee) => {
    const temp = await Employee.findById(employee);
    employees.push(temp);
  });
  await job.save();
  res.status(200).json({ success: true, data: job, employees: employees });
});
