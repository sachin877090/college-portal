const CourseModel = require('../../models/course')
const nodemailer = require('nodemailer')      // npm i nodemailer
class AdminController {
    static dashboard = async (req, res) => {
        try {
            const { name, email, image } = req.udata
            res.render('admin/dashboard', { n: name, i: image, e: email })
        } catch (error) {
            console.log(error)
        }
    }
    static courseDisplay = async (req, res) => {
        try {
            const { name, email, image } = req.udata
            const course = await CourseModel.find()
            res.render('admin/courseDisplay', { n: name, i: image, e: email, c: course })
        } catch (error) {
            console.log(error)
        }
    }
    static update_status = async (req, res) => {
        try {
            const id = req.params.id;
            const { name, email, course, status, comment } = req.body
            await CourseModel.findByIdAndUpdate(id, {
                status,
                comment
            })
            if (status == "Reject") {
                this.RejectEmail(name, email, course, status, comment)
            } else {
                this.ApprovedEmail(name, email, course, status, comment)
            }
            //  this.sendEmail(name,email,course,status,comment)
            res.redirect('/admin/Coursedisplay')
        } catch (error) {
            console.log(error)
        }
    }
    static RejectEmail = async (name, email, course, status, comment) => {
        //console.log(name, email, course)
        // connenct with the smtp server

        let transporter = await nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,

            auth: {
                user: "sachinshrivastava380@gmail.com",
                pass: "oqjz bsru hafh ucth",
            },
        });
        let info = await transporter.sendMail({
            from: "test@gmail.com", // sender address
            to: email, // list of receivers
            subject: ` Course ${course} Reject`, // Subject line
            text: "heelo", // plain text body
            html: `<head>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    background-color: #f9f9f9;
                    margin: 0;
                    padding: 0;
                }
                .email-container {
                    max-width: 600px;
                    margin: 20px auto;
                    background: #ffffff;
                    padding: 20px;
                    border: 1px solid #dddddd;
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                }
                .email-header {
                    font-size: 20px;
                    font-weight: bold;
                    margin-bottom: 10px;
                    text-align: center;
                }
                .email-body {
                    font-size: 16px;
                    color: #333333;
                    margin-bottom: 20px;
                }
                .email-footer {
                    font-size: 14px;
                    color: #777777;
                    text-align: center;
                    margin-top: 20px;
                }
            </style>
        </head>
        <body>
            <div class="email-container">
                <div class="email-header">Message Registered Successfully</div>
                <div class="email-body">
                    <p>Dear <b>${name}</b>,</p>
                     
                    <p>Unfortunately, your course has been rejected. Please review the feedback below for further details:<br>
                   ${comment}</p>
                    <p>We appreciate your effort and encourage you to reach out if you have any questions or need clarification.</p>
                </div>
                <div class="email-footer">
                    Thank you,<br>
                    The Support Team
                </div>
            </div>
        </body>
         `, // html body
        });
    };
    static ApprovedEmail = async (name, email, course, status, comment) => {
        console.log(name, email, course)
        // connenct with the smtp server

        let transporter = await nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,

            auth: {
                user: "sachinshrivastava380@gmail.com",
                pass: "oqjz bsru hafh ucth",
            },
        });
        let info = await transporter.sendMail({
            from: "test@gmail.com", // sender address
            to: email, // list of receivers
            subject: ` Course ${course} Approved`, // Subject line
            text: "heelo", // plain text body
            html: `<head>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    background-color: #f9f9f9;
                    margin: 0;
                    padding: 0;
                }
                .email-container {
                    max-width: 600px;
                    margin: 20px auto;
                    background: #ffffff;
                    padding: 20px;
                    border: 1px solid #dddddd;
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                }
                .email-header {
                    font-size: 20px;
                    font-weight: bold;
                    margin-bottom: 10px;
                    text-align: center;
                }
                .email-body {
                    font-size: 16px;
                    color: #333333;
                    margin-bottom: 20px;
                }
                .email-footer {
                    font-size: 14px;
                    color: #777777;
                    text-align: center;
                    margin-top: 20px;
                }
            </style>
        </head>
        <body>
            <div class="email-container">
                <div class="email-header">Message Registered Successfully</div>
                <div class="email-body">
                    <p>Dear <b>${name}</b>,</p>
                   <p>We are pleased to inform you that your course has been approved! Congratulations on your hard work and dedication.<br>
                   ${comment}<p>
                    <p>We appreciate your effort and encourage you to reach out if you have any questions or need clarification.</p>
                </div>
                <div class="email-footer">
                    Thank you,<br>
                    The Support Team
                </div>
            </div>
        </body>
             `, // html body
        });
    }
    static sendEmail = async (name, email, course) => {
        //   console.log(name,email,course)
        // connenct with the smtp server

        let transporter = await nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,

            auth: {
                user: "sachinshrivastava380@gmail.com",
                pass: "oqjz bsru hafh ucth",
            },
        });
        let info = await transporter.sendMail({
            from: "test@gmail.com", // sender address
            to: email, // list of receivers
            subject: ` Course ${course}`, // Subject line
            text: "heelo", // plain text body
            html: `<head>
              <style>
                  body {
                      font-family: Arial, sans-serif;
                      line-height: 1.6;
                       /* Replace with your image URL */
                      background-size: cover;
                      background-repeat: no-repeat;
                      background-position: center;
                      margin: 0;
                      padding: 0;
                  }
                  .email-container {
                      margin: 0 auto;
                      padding: 20px;
                      max-width: 600px;
                      background: rgba(255, 255, 255, 0.9); /* Optional: Add transparency for readability */
                      border: 1px solid #ccc;
                      border-radius: 5px;
                  }
                  .email-header {
                      font-size: 18px;
                      font-weight: bold;
                      margin-bottom: 10px;
                  }
                  .email-body {
                      margin-bottom: 20px;
                  }
                  .email-footer {
                      font-size: 14px;
                      color: #555;
                  }
              </style>
          </head>
          <body>
              <div class="email-container">
                  <div class="email-header">Course Enrollment Successful</div>
        
                  <div class="email-body">
                      <p><b>${name}</b>,</p>
        
                      <p>Your enrollment in the course <b>${course}</b> has been successfully processed!</p>
        
                      <p>We are excited to have you on board. Please feel free to reach out if you have any questions or need assistance.</p>
                  </div>
        
                  <div class="email-footer">
                      Thank you,<br>
                      The Support Team
                  </div>
              </div>
          </body>
               `, // html body
        });
    }
}
module.exports = AdminController