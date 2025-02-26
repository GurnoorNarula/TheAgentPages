const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/database');
const agentRoutes = require('./routes/agentRoutes');
const taskRoutes = require('./routes/taskRoutes');

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/agents', agentRoutes);
app.use('/api/tasks', taskRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
