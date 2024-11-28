const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const dotenv = require('dotenv');
const userViews = require('./views/user');
const taskViews = require('./views/task');
const dashboardViews = require('./views/dashboard');

dotenv.config();
connectDB();

const corsOptions = {
    origin: [process.env.FRONTEND_URL],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};
const app = express();

app.use(express.json());
app.use(cors(corsOptions));

app.use('/api/users', userViews);
app.use('/api/tasks', taskViews);
app.use('/api/dashboard', dashboardViews);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
