const nodemailer = require("nodemailer");

// Configure the transporter (Gmail example)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "sukku@gmail.com",
    pass: "your_app_password",    // App password (not your main email password)
  },
});

// Function to send email
export const sendConfirmationEmail = async ({ email, userName, movieName, showtime, seats }) => {
  const mailOptions = {
    from: "your_email@gmail.com", // Sender's email
    to: email,                    // Recipient's email
    subject: "Booking Confirmation", // Subject line
    text: `Dear ${userName}, your booking is confirmed for the movie "${movieName}" at ${showtime}. Number of seats: ${seats}.`, // Plain text
    html: `
      <h2>Booking Confirmation</h2>
      <p>Dear ${userName},</p>
      <p>Your booking is confirmed:</p>
      <ul>
        <li><strong>Movie:</strong> ${movieName}</li>
        <li><strong>Showtime:</strong> ${showtime}</li>
        <li><strong>Seats:</strong> ${seats}</li>
      </ul>
      <p>Enjoy your movie!</p>
    `, // HTML content
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
    return { success: true, info };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error };
  }
};

