import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { saveBookingToDB } from "../../store/movie-actions";

import emailjs from "@emailjs/browser";
import "./BookTicket.css";
function BookTicket() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedMovie, loading, error } = useSelector((state) => state.movie);
  const movieName = selectedMovie.name;
  const movieId = useSelector((state) => state.movie.selectedMovieId);
  const { showtimes } = selectedMovie;
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    phoneNumber: "",
    showtime: "",
    seats: 1,
  });

  // Handle form input changes
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    const messageToSend = `
  Hi ${formData.userName},  
  
  Thank you for booking your ticket!  
  
  Details:  
  - Movie: ${movieName}  
  - Date & Time: ${formData.showtime}  
  - Seats: ${formData.seats}  
  
  Please save this for reference. For questions, contact us at support@example.com.  
  
  Enjoy the show!`;

    console.log("Booking Details:", formData);

    const bookingData = {
      ...formData,
      movieName,
      movieId,
    };

    const templateParams = {
      from_name: "sukanya".trim(),
      to_name: formData.userName.trim(),
      to_email: formData.email.trim(),
      message: messageToSend.trim(),
    };
    const userId = "W_W0JxwkWytxQVAfe";
    const serviceId = "service_hz873ms";
    const templateId = "template_8z6b5tv";
    console.log("Template Params:", templateParams);
    // Add logic to save booking details to the database
    try {
      // Save booking data to database
      await dispatch(saveBookingToDB(bookingData));

      // Send confirmation email
      // await sendConfirmationEmail(templateParams);
      emailjs.init(userId);
      //
      const response = await emailjs.send(
        serviceId,
        templateId,
        templateParams,
        userId
      );
      console.log("Email sent successfully:", response.status, response.text);

      alert("Booking Confirmed!");
      navigate("/user");
    } catch (error) {
      console.error("Error handling submission:", error);
      alert("An error occurred while processing your booking.");
    }
  };
  if (loading) return <p>Loading movie details...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!selectedMovie) return <p>No movie details available.</p>;

  return (
    <div className="booking-form-container">
      {/* Movie Name Section */}
      <h2 className="movie-name-title">Book Tickets for: {movieName}</h2>

      {/* Booking Form */}
      <form className="booking-form" onSubmit={handleSubmit}>
        {/* Name */}
        <div className="form-group">
          <label htmlFor="userName">Name:</label>
          <input
            type="text"
            id="userName"
            name="userName"
            value={formData.userName}
            onChange={handleChange}
            placeholder="Enter your full name"
            required
          />
        </div>

        {/* Email */}
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email address"
            required
          />
        </div>

        {/* Phone Number */}
        <div className="form-group">
          <label htmlFor="phoneNumber">Phone Number:</label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            placeholder="Enter your phone number"
            pattern="[0-9]{10}"
            required
          />
        </div>

        {/* Showtime Selection */}
        <div className="form-group">
          <label htmlFor="showtime">Showtime:</label>
          <select
            id="showtime"
            name="showtime"
            value={formData.showtime}
            onChange={handleChange}
            required
          >
            <option value="" disabled>
              Select Showtime
            </option>
            {showtimes.map((showtime, index) => (
              <option key={index} value={showtime.showtimeString}>
                {showtime.showtimeString}
              </option>
            ))}
          </select>
        </div>

        {/* Number of Seats */}
        <div className="form-group">
          <label htmlFor="seats">Number of Seats:</label>
          <input
            type="number"
            id="seats"
            name="seats"
            min="1"
            max="10"
            value={formData.seats}
            onChange={handleChange}
            required
          />
        </div>

        {/* Submit Button */}
        <button type="submit" className="submit-button">
          Confirm Booking
        </button>
      </form>
    </div>
  );
}

export default BookTicket;
