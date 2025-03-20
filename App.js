import React, { useState, useEffect } from "react";
import "./App.css";

function AppointmentApp() {
  const [appointments, setAppointments] = useState([]);
  const [patientName, setPatientName] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [doctor, setDoctor] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [availableTimes, setAvailableTimes] = useState([]);

  const doctors = {
    "Dr. Smith": [
      "09:00",
      "09:30 ",
      "10:00",
      "10:30",
      "11:00",
      "11:30",
      "14:00",
      "14:30",
      "15:00",
    ],
    "Dr. Brown": [
      "08:00",
      "08:30",
      "09:00",
      "09:30",
      "11:30",
      "12:00",
      "13:00",
      "13:30",
      "16:00",
    ],
    "Dr. Taylor": [
      "10:00",
      "10:30",
      "11:00",
      "11:30",
      "12:00",
      "14:00",
      "14:30",
      "15:00",
      "16:00",
    ],
    "Dr. Johnson": [
      "09:00",
      "09:30",
      "10:00",
      "11:00",
      "13:00",
      "14:00",
      "15:00",
      "17:00",
      "19:00",
    ],
  };

  useEffect(() => {
    const savedAppointments = localStorage.getItem("appointments");
    if (savedAppointments) {
      setAppointments(JSON.parse(savedAppointments));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("appointments", JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    if (doctor) {
      setAvailableTimes(doctors[doctor]);
    }
  }, [doctor]);

  const isTimeSlotAvailable = () => {
    return !appointments.some(
      (appointment) =>
        appointment.doctor === doctor &&
        appointment.appointmentDate === appointmentDate &&
        appointment.appointmentTime === appointmentTime
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!patientName || !appointmentDate || !appointmentTime || !doctor) {
      setErrorMessage("All fields are required.");
      return;
    }

    if (!isTimeSlotAvailable()) {
      setErrorMessage(
        `The selected time ${appointmentTime} on ${appointmentDate} is already booked for ${doctor}. Please select another time.`
      );
      return;
    }

    const newAppointment = {
      id: new Date().getTime(),
      patientName,
      appointmentDate,
      appointmentTime,
      doctor,
    };

    setAppointments([...appointments, newAppointment]);
    setPatientName("");
    setAppointmentDate("");
    setAppointmentTime("");
    setDoctor("");
    setErrorMessage("");
  };

  const handleDelete = (id) => {
    const filteredAppointments = appointments.filter(
      (appointment) => appointment.id !== id
    );
    setAppointments(filteredAppointments);
  };

  return (
    <div className="container">
      <h1 className="header">Healthcare Appointment Management</h1>

      <form onSubmit={handleSubmit} className="form">
        {errorMessage && <p className="error">{errorMessage}</p>}
        <input
          type="text"
          placeholder="Patient Name"
          value={patientName}
          onChange={(e) => setPatientName(e.target.value)}
          required
          className="input"
        />
        <input
          type="date"
          value={appointmentDate}
          onChange={(e) => setAppointmentDate(e.target.value)}
          required
          className="input"
        />
        <select
          value={doctor}
          onChange={(e) => setDoctor(e.target.value)}
          required
          className="input"
        >
          <option value="" disabled>
            Select Doctor
          </option>
          {Object.keys(doctors).map((doc, index) => (
            <option key={index} value={doc}>
              {doc}
            </option>
          ))}
        </select>

        {doctor && (
          <select
            value={appointmentTime}
            onChange={(e) => setAppointmentTime(e.target.value)}
            required
            className="input"
          >
            <option value="" disabled>
              Select Time
            </option>
            {availableTimes.map((time, index) => (
              <option key={index} value={time}>
                {time}
              </option>
            ))}
          </select>
        )}

        <button type="submit" className="button">
          Book Appointment
        </button>
      </form>

      <div className="appointmentList">
        <h2 className="subheader">Scheduled Appointments</h2>
        {appointments.length > 0 ? (
          <ul className="list">
            {appointments.map((appointment) => (
              <li key={appointment.id} className="listItem">
                {appointment.patientName} has an appointment with{" "}
                {appointment.doctor} on {appointment.appointmentDate} at{" "}
                {appointment.appointmentTime}
                <button
                  onClick={() => handleDelete(appointment.id)}
                  className="deleteButton"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No appointments scheduled.</p>
        )}
      </div>
    </div>
  );
}

export default AppointmentApp;
