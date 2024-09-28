const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const appointmentRoutes = require('./router/appointment-router');

const app = express();

app.use(bodyParser.json());
app.use('/api',appointmentRoutes)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`listening on ${PORT}`);
});