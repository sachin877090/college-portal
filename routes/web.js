const express = require('express')
const Frontcontroller = require('../controllers/Frontcontroller')
const route = express.Router()
const checkAuth = require('../middleware/auth')
const CourseController = require('../controllers/coursecontroller')
const AdminController = require('../controllers/admin/AdminController')

//routes
route.get('/home',checkAuth,Frontcontroller.home)
route.get('/about',checkAuth,Frontcontroller.about)
route.get('/contact',checkAuth,Frontcontroller.contact)
route.get('/',Frontcontroller.login)
route.get('/register',Frontcontroller.register)
//insert data
route.post('/userinsert',Frontcontroller.userinsert)
route.post('/verifyLogin',Frontcontroller.verifyLogin)
route.get('/logout',Frontcontroller.logout)
// profile
route.get('/profile',checkAuth,Frontcontroller.profile)
route.post('/changePassword',checkAuth,Frontcontroller.changePassword)
route.post('/updateProfile',checkAuth,Frontcontroller.updateProfile)
//course
route.post('/course_insert',checkAuth,CourseController.createCourse)
route.get('/courseDisplay',checkAuth,CourseController.courseDisplay)
route.get('/ViewCourse/:id',checkAuth,CourseController.ViweCourse)
route.get('/DeleteCourse/:id',checkAuth,CourseController.DeleteCourse)
route.get('/editCourse/:id',checkAuth,CourseController.editCourse)
route.post('/courseUpdate/:id',checkAuth,CourseController.courseUpdate)
//admincontroller
route.get('/admin/dashboard',checkAuth,AdminController.dashboard)
route.get('/admin/courseDisplay',checkAuth,AdminController.courseDisplay)
route.post('/admin/update_status/:id',checkAuth,AdminController.update_status)

//forget password
route.post('/forgot_Password',Frontcontroller.forgetPasswordVerify)
route.get('/reset-password',Frontcontroller.reset_Password)
route.post('/reset_Password1',Frontcontroller.reset_Password1)

module.exports = route