const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');


dotenv.config();

const app = express();


app.use(express.json());
app.use(cors());


const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/task');

app.use('/api', authRoutes);
app.use('/api/tasks', taskRoutes);


app.get('/', (req, res) => {
  res.send('MERN To-Do API is running...');
});

const PORT = process.env.PORT || 5000;
const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
};


startServer();