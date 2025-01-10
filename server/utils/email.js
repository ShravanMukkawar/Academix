const sgMail = require('@sendgrid/mail');

const sendEmail = async (options) => {
  try {
    // Set the SendGrid API key
    console.log(process.env.SENDGRID_API_KEY)
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    // Define the email details
    const msg = {
      from: 'Academix <myacademix2025@gmail.com>', // Sender email
      to: options.email, // Receiver email
      subject: options.subject, // Subject of the email
      html: options.html // Email body in HTML
    };

    // Send the email
    const response = await sgMail.send(msg);
    console.log("Email sent successfully:", response);
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

module.exports = sendEmail;
