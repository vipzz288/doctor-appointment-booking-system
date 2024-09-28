const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const appointmentRoutes = require('../router/appointment-router');

const app = express();
app.use(bodyParser.json());
app.use('/api', appointmentRoutes);

describe('Appointment Booking API', () => {
  beforeEach(() => {
 
  });

  it('should book an appointment successfully', async () => {
    const response = await request(app)
      .post('/api/book-appointment')
      .send({
        firstName: "ABC",
        lastName: "XYZ",
        email: "abc.xyz@test.com",
        appointmentSlot: "10:00 AM - 11:00 AM",
        doctorName: "Dr. TEST1" // Ensure this doctor is available in your setup
      });
      
    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Appointment booked successfully');
    expect(response.body.appointmentDetails).toHaveProperty('id');
    expect(response.body.appointmentDetails).toMatchObject({
      firstName: "ABC",
      lastName: "XYZ",
      email: "a@test.com",
      appointmentSlot: "10:00 AM - 11:00 AM",
      doctorName: "Dr. TEST1"
    });
  });

  it('should return an error for an unavailable time slot', async () => {
    await request(app)
      .post('/api/book-appointment')
      .send({
        firstName: "AAA",
        lastName: "BBB",
        email: "AAA.BBB@example.com",
        appointmentSlot: "10:00 AM - 11:00 AM", 
        doctorName: "Dr. TEST1"
      });

    const response = await request(app)
      .post('/api/book-appointment')
      .send({
        firstName: "CCC",
        lastName: "DDD",
        email: "CCC.DDD@example.com",
        appointmentSlot: "10:00 AM - 11:00 AM", 
        doctorName: "Dr. TEST1"
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Time slot not available');
  });

  it('should return an error for a non-existent doctor', async () => {
    const response = await request(app)
      .post('/api/book-appointment')
      .send({
        firstName: "TTT",
        lastName: "UUU",
        email: "TTT.UUU@example.com",
        appointmentSlot: "11:00 AM - 12:00 PM",
        doctorName: "Dr. None" 
      });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Doctor not found');
  });
});

describe('View All Appointments by Doctor API', () => {
  beforeEach(() => {
   
    appointments = [
      {
        firstName: "ABC",
        lastName: "XYZ",
        email: "abc.xyz@test.com",
        appointmentSlot: "10:00 AM - 11:00 AM",
        doctorName: "Dr. TEST1"
      },
      {
        firstName: "qwe",
        lastName: "rty",
        email: "a@test.com",
        appointmentSlot: "11:00 AM - 12:00 PM",
        doctorName: "Dr. TEST2"
      }
    ];
  });

  it('should retrieve all appointments for a doctor', async () => {
    const response = await request(app)
      .get('/api/appointments/doctor/Dr. Smith');

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Appointments for Dr. Smith retrieved successfully');
    expect(response.body.appointments.length).toBe(2); 
  });

  it('should return an error if no appointments are found for the doctor', async () => {
    const response = await request(app)
      .get('/api/appointments/doctor/Dr. None');

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('No appointments found for this doctor');
  });
});

describe('View Appointment Details API', () => {
  beforeEach(() => {
  
    appointments = [{
      firstName: "XYZ",
      lastName: "ABC",
      email: "xyz.abc@test.com",
      appointmentSlot: "10:00 AM - 11:00 AM",
      doctorName: "Dr. TEST1"
    }];
  });

  it('should retrieve appointment details successfully', async () => {
    const response = await request(app)
      .get('/api/appointment/john.doe@example.com');

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Appointment details retrieved successfully');
    expect(response.body.appointmentDetails).toMatchObject({
      firstName: "XYZ",
      lastName: "ABC",
      email: "xyz.abc@test.com",
      appointmentSlot: "10:00 AM - 11:00 AM",
      doctorName: "Dr. TEST2"
    });
  });

  it('should return an error for a non-existent email', async () => {
    const response = await request(app)
      .get('/api/appointment/nonexistent@example.com');

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Appointment not found');
  });
});

describe('Cancel Appointment API', () => {
  beforeEach(() => {
 
    appointments = [
      {
        firstName: "a",
        lastName: "b",
        email: "a@x.com",
        appointmentSlot: "10:00 AM - 11:00 AM",
        doctorName: "Dr. TEST1"
      },
      {
        firstName: "x",
        lastName: "y",
        email: "x@y.com",
        appointmentSlot: "11:00 AM - 12:00 PM",
        doctorName: "Dr. TEST2"
      }
    ];
  });

  it('should cancel the appointment successfully', async () => {
    const response = await request(app)
      .delete('/api/cancel-appointment')
      .send({
        email: "a@x.com",
        appointmentSlot: "10:00 AM - 11:00 AM"
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Appointment canceled successfully');
  });

  it('should return an error if the appointment is not found', async () => {
    const response = await request(app)
      .delete('/api/cancel-appointment')
      .send({
        email: "no@test.com",
        appointmentSlot: "10:00 AM - 11:00 AM"
      });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Appointment not found');
  });
});

describe('Modify Appointment API', () => {
  beforeEach(() => {

    appointments = [
      {
        firstName: "a",
        lastName: "b",
        email: "a.b@test.com",
        appointmentSlot: "10:00 AM - 11:00 AM",
        doctorName: "Dr. TEST1"
      },
      {
        firstName: "x",
        lastName: "y",
        email: "x@y.com",
        appointmentSlot: "11:00 AM - 12:00 PM",
        doctorName: "Dr. TEST2"
      }
    ];
  });

  it('should modify the appointment successfully', async () => {
    const response = await request(app)
      .put('/api/modify-appointment')
      .send({
        email: "x@y.com",
        originalAppointmentSlot: "10:00 AM - 11:00 AM",
        newAppointmentSlot: "12:00 PM - 01:00 PM"
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Appointment updated successfully');
    expect(response.body.updatedAppointment).toMatchObject({
      firstName: "x",
      lastName: "y",
      email: "x@y.com",
      appointmentSlot: "12:00 PM - 01:00 PM",
      doctorName: "Dr. TEST1"
    });
  });

  it('should return an error if the appointment is not found', async () => {
    const response = await request(app)
      .put('/api/modify-appointment')
      .send({
        email: "no@test.com",
        originalAppointmentSlot: "10:00 AM - 11:00 AM",
        newAppointmentSlot: "12:00 PM - 01:00 PM"
      });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Appointment not found');
  });

  it('should return an error if the new time slot is already taken', async () => {
    const response = await request(app)
      .put('/api/modify-appointment')
      .send({
        email: "x@y.com",
        originalAppointmentSlot: "10:00 AM - 11:00 AM",
        newAppointmentSlot: "11:00 AM - 12:00 PM" 
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('New time slot not available');
  });
});