const CourseModel = require('../models/course')

class CourseController{
    static createCourse = async(req,res)=>{
        try {
            // console.log(req.body)
            const {id} = req.udata
            const {name,email,phone,dob,address,gender,education,course}=req.body
            await CourseModel.create({
                name,
                email,
                phone,
                dob,
                address,
                gender,
                education,
                course,
                user_id:id
            })
            this.sendEmail(name,email,course)
            res.redirect('/courseDisplay')
        } catch (error) {
            console.log(error)
        }
    }
    static courseDisplay = async(req,res)=>{
        try {
            const {id,name,image} = req.udata
            const course = await CourseModel.find({user_id:id})
            // console.log(course)
            res.render('course/display',{c:course,n:name,i:image,msg:req.flash('success')})
        } catch (error) {
            console.log(error)
        }
    }
    static ViweCourse = async(req,res)=>{
        try {
            const {name,image} = req.udata
            const id = req.params.id
            // console.log(id)
            const course = await CourseModel.findById(id)
            // console.log(course)
            res.render('course/view',{c:course,n:name,i:image})
        } catch (error) {
            console.log(error)
        }
    }
    static editCourse = async(req,res)=>{
        try {
            const {name,image} = req.udata
            const id = req.params.id
            // console.log(id)
            const course = await CourseModel.findById(id)
            // console.log(course)
            res.render('course/edit',{c:course,n:name,i:image})
        } catch (error) {
            console.log(error)
        }
    }
    static courseUpdate = async(req,res)=>{
        try {
            const id = req.params.id
            console.log(id)
            const {name,email,phone,dob,address,gender,education,course}=req.body
            await CourseModel.findByIdAndUpdate(id,{
                name,
                email,
                phone,
                dob,
                address,
                gender,
                education,
                course,
                // user_id:id
            })
            req.flash("success", "Course Update successfully!")
            res.redirect("/courseDisplay")
        } catch (error) {
            console.log(error)
        }
    }
    static DeleteCourse = async(req,res)=>{
        try {
            const {name,image} = req.udata
            const id = req.params.id
            // console.log(id)
            const course = await CourseModel.findByIdAndDelete(id)
            res.redirect('/courseDisplay')
        } catch (error) {
            console.log(error)
        }
    }
}
module.exports = CourseController