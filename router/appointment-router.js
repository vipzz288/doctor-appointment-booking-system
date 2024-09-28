const express = require('express');
const { bookAppointment, getAppointmentDetails, getAppointmentsByDoctor, cancelAppointment, modifyAppointment } = require('../controller/appointment-controller');
const router = express.Router();

router.route('/book-appointment').post(bookAppointment)

router.get('/appointment/:email', getAppointmentDetails);

router.get('/appointments/doctor/:doctorName', getAppointmentsByDoctor);

router.delete('/cancel-appointment', cancelAppointment);

router.put('/modify-appointment', modifyAppointment);

module.exports = router;