const express = require('express')
const Frontcontroller = require('../controllers/Frontcontroller')
const route = express.Router()
const checkAuth = require('../middleware/auth')
const CourseController = require('../controllers/CourseController')
const AdminController = require('../controllers/admin/AdminController')
const ContactController =require('../controllers/ContactController')
const adminRole = require('../middleware/adminRole')
const isLogin = require('../middleware/isLogin')

//routes
route.get('/home',checkAuth,Frontcontroller.home)
route.get('/about',checkAuth,Frontcontroller.about)
route.get('/contact',checkAuth,Frontcontroller.contact)
route.get('/',Frontcontroller.login)
route.get('/register',Frontcontroller.register)
route.get("/logout", Frontcontroller.logout)
//insert data
route.post('/userinsert',Frontcontroller.userinsert)
route.post('/verifyLogin',Frontcontroller.verifyLogin)

// profile
route.get('/profile',checkAuth,Frontcontroller.profile)
route.post('/changePassword',checkAuth,Frontcontroller.changePassword)
route.post('/updateProfile',checkAuth,Frontcontroller.updateProfile)

//contactByUser
route.post("/contactByUser", checkAuth, ContactController.contactByUser)
//course
route.post('/course_insert',checkAuth,CourseController.createCourse)
route.get('/courseDisplay',checkAuth,CourseController.courseDisplay)
route.get('/ViewCourse/:id',checkAuth,CourseController.ViweCourse)
route.get('/DeleteCourse/:id',checkAuth,CourseController.DeleteCourse)
route.get('/editCourse/:id',checkAuth,CourseController.editCourse)
route.post('/courseUpdate/:id',checkAuth,CourseController.courseUpdate)

//verifyemail
route.get("/register/verify", Frontcontroller.verifyMail)
//admincontroller
route.get('/admin/dashboard',checkAuth,AdminController.dashboard)
route.get('/admin/courseDisplay',checkAuth,AdminController.courseDisplay)
route.post('/admin/update_status/:id',checkAuth,AdminController.update_status)

//forget password
route.post('/forgot_Password',Frontcontroller.forgetPasswordVerify)
route.get('/reset-password',Frontcontroller.reset_Password)
route.post('/reset_Password1',Frontcontroller.reset_Password1)

// adminController
route.get(
    "/admin/dashboard",
    checkAuth,
    adminRole("admin"),
    AdminController.dashboard
  );
  route.get(
    "/admin/courseDisplay",
    checkAuth,
    adminRole("admin"),
    AdminController.courseDisplay
  );
  route.post(
    "/admin/update_status/:id",
    checkAuth,
    adminRole("admin"),
    AdminController.update_status
  );
  route.get(
    "/admin/courseView/:id",
    checkAuth,
    adminRole("admin"),
    AdminController.courseView
  );
  route.get(
    "/admin/courseEdit/:id",
    checkAuth,
    adminRole("admin"),
    AdminController.courseEdit
  );
  route.get(
    "/admin/courseDelete/:id",
    checkAuth,
    adminRole("admin"),
    AdminController.courseDelete
  );
  route.get(
    "/admin/deleteMessage/:id",
    checkAuth,
    adminRole("admin"),
    AdminController.delete_message
  );
  route.post(
    "/admin/update_Course/:id",
    checkAuth,
    adminRole("admin"),
    AdminController.update_course
  );
  route.get(
    "/admin/ContactDisplay",
    checkAuth,
    adminRole("admin"),
    AdminController.contactDisplay
  );
  route.get(
    "/admin/update_pass",
    checkAuth,
    adminRole("admin"),
    AdminController.update_pass
  );
  route.get(
    "/admin/profile_update",
    checkAuth,
    adminRole("admin"),
    AdminController.profile_update
  );
  route.post(
    "/admin/changePassword",
    checkAuth,
    adminRole("admin"),
    AdminController.changePassword
  );
  route.post(
    "/admin/updateProfile",
    checkAuth,
    adminRole("admin"),
    AdminController.updateProfile
  );
  route.get(
    "/admin/approvedUsers",
    checkAuth,
    adminRole("admin"),
    AdminController.ApprovedUsers
  );
  route.get(
    "/admin/pendingUsers",
    checkAuth,
    adminRole("admin"),
    AdminController.PendingUsers
  );
  route.get(
    "/admin/rejectedUsers",
    checkAuth,
    adminRole("admin"),
    AdminController.RejectUsers
  );
  

module.exports = route