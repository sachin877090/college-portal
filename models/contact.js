const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema(
    {
      fullName: {
        type: String,
        Required: true,
      },
      phoneNumber: {
        type: String,
        Required: true,
      },
      email: {
        type: String,
        Required: true,
      },
      message: {
        type: String,
        Required: true,
      },
    },
    { timestamps: true }
  ); //jb ham insert krege to 2 field dega createdadd -->date time btyegi or update
  const ContactModel = mongoose.model("contact", ContactSchema);
  module.exports = ContactModel; //exporting the model