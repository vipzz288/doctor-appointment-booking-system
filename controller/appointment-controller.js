const {v4 : uuid} = require('uuid');
const { doctors, appointments } = require('../utils/doctors')


exports.bookAppointment = (req,res) => {

    const { firstName, lastName, email, appointmentSlot, doctorName } = req.body;

    if(!doctors[doctorName]){
        return res.status(400).json({ message: 'Invalid doctor name' });
    }

    const availableSlots  = doctors[doctorName]
    if(!availableSlots.includes(appointmentSlot))
    {
        return res.status(400).json({ message: 'Time slot not available' });
    }

    const appointmentId = uuid();
    const newAppointment = {
        id: appointmentId,
        firstName,
        lastName,
        email,
        appointmentSlot,
        doctorName
    }

    appointments.push(newAppointment)
    doctors[doctorName] = availableSlots.filter(slot => slot !== appointmentSlot)


    res.status(201).json({message : 'Appointment Booked Successfully',
        appointmentDetails : newAppointment
    })

}

exports.getAppointmentDetails = (req, res) => {
    const { email } = req.params;
    
    const appointment = appointments.find(appt => appt.email === email);

    if (!appointment) {
        return res.status(404).json({ message: 'Appointment not found' });
    }

    res.status(200).json({
        message: 'Appointment details retrieved successfully',
        appointmentDetails: appointment
    });
};

exports.getAppointmentsByDoctor = (req, res) => {
    const { doctorName } = req.params;


    const doctorAppointments = appointments.filter(appt => appt.doctorName === doctorName);

    if (doctorAppointments.length === 0) {
        return res.status(404).json({ message: 'No appointments found for this doctor' });
    }

    res.status(200).json({
        message: `Appointments for ${doctorName} retrieved successfully`,
        appointments: doctorAppointments
    });
};

exports.cancelAppointment = (req, res) => {
    const { email, appointmentSlot } = req.body;


    const appointmentIndex = appointments.findIndex(
        appt => appt.email === email && appt.appointmentSlot === appointmentSlot
    );

 
    if (appointmentIndex === -1) {
        return res.status(404).json({ message: 'Appointment not found' });
    }

  
    appointments.splice(appointmentIndex, 1);


    res.status(200).json({ message: 'Appointment canceled successfully' });
};

exports.modifyAppointment = (req, res) => {
    const { email, originalAppointmentSlot, newAppointmentSlot } = req.body;

  
    const appointmentIndex = appointments.findIndex(
        appt => appt.email === email && appt.appointmentSlot === originalAppointmentSlot
    );

    if (appointmentIndex === -1) {
        return res.status(404).json({ message: 'Appointment not found' });
    }

  
    const isSlotTaken = appointments.some(
        appt => appt.doctorName === appointments[appointmentIndex].doctorName && appt.appointmentSlot === newAppointmentSlot
    );

    if (isSlotTaken) {
        return res.status(400).json({ message: 'New time slot not available' });
    }

    appointments[appointmentIndex].appointmentSlot = newAppointmentSlot;

    
    res.status(200).json({
        message: 'Appointment updated successfully',
        updatedAppointment: appointments[appointmentIndex]
    });
};