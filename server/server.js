const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const teamRoutes = require('./routes/teamRoutes');
const taskRoutes = require('./routes/taskRoutes');
const http = require("http");
const { Server } = require("socket.io");
const port = 4400;

dotenv.config(); // Load environment variables
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

console.log('MongoDB URI:', process.env.URI);
console.log('CLOUDINARY_API_KEY :', process.env.CLOUDINARY_API_KEY);
// Middleware
app.use(cors());
app.use(express.json({ limit: "5mb" })); 
app.use(express.urlencoded({ limit: "5mb", extended: true }));


// MongoDB Atlas connection
const mongoURI = process.env.URI; 

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    const io = socket.init(server);
    console.log(' Connected to MongoDB');
}).catch(err => {
    console.error(' MongoDB connection error:', err);
});

// Routes
app.use('/auth', authRoutes);
app.use('/team', teamRoutes);
app.use('/task', taskRoutes);


server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

