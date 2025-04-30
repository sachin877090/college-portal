const ContactModel =require("../models/contact")


class ContactController {
    // contactByUser
    static contactByUser = async (req, res) => {
      try {
        //   console.log(req.body);
        const { fullName, phoneNumber, email, message } = req.body;
  
        if (!fullName || !phoneNumber || !email || !message) {
          req.flash("error", "All fields are Required.");
          return res.redirect("/contact");
        }
  
        const contactData = await ContactModel.create({
          fullName,
          phoneNumber,
          email,
          message,
        });
        req.flash("success", "Submitted Successfully !");
        res.redirect("/contact");
      } catch (error) {
        console.log(error);
      }
    };
  }

module.exports = ContactController;